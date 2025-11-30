"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  runTransaction,
  addDoc,
} from "firebase/firestore";

type AggRow = { id: string; amount: number; lastTransferAt?: number; customerDocId: string; customerName?: string };

export default function TransferPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUid, setSelectedUid] = useState<string>("");
  const [recipientQuery, setRecipientQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestionLimit, setSuggestionLimit] = useState<number>(20);
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [recentAggs, setRecentAggs] = useState<AggRow[]>([]);

  // Track auth UID
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });
    return () => unsub();
  }, []);

  // Subscribe to AgentID from profile
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "Agents", uid), (snap) => {
      const x = (snap.data() as any) || {};
      const aid = String(x.AgentID || x.agentId || x.AgentId || "").trim() || null;
      setAgentId(aid);
    });
    return () => unsub();
  }, [uid]);

  // Load available points from AdminToAgentTransfer (by agentUid document) and recent AgentToCustomerTransfer for this agent
  useEffect(() => {
    if (!uid) return;
    const unsubPts = onSnapshot(doc(collection(db, "AdminToAgentTransfer"), uid), (snap) => {
      const x = (snap.data() as any) || {};
      setAvailablePoints(Number(x.amount || 0));
    });
    const unsubAgg = onSnapshot(
      query(collection(db, "AgentToCustomerTransfer"), where("agentDocId", "==", uid)),
      async (snap) => {
        const rows: AggRow[] = await Promise.all(
          snap.docs.map(async (d) => {
            const x = (d.data() as any) || {};
            const cdoc = x.customerDocId as string;
            let name: string | undefined = undefined;
            try {
              const cs = await getDoc(doc(collection(db, "Customers"), cdoc));
              const cx = (cs.data() as any) || {};
              name = String(cx.fullName || cx.name || cx.username || cx.email || "Customer");
            } catch {}
            return { id: d.id, amount: Number(x.amount || 0), lastTransferAt: Number(x.lastTransferAt || 0), customerDocId: cdoc, customerName: name };
          })
        );
        rows.sort((a, b) => (Number(b.lastTransferAt || 0) - Number(a.lastTransferAt || 0)));
        setRecentAggs(rows);
      }
    );
    return () => { unsubPts(); unsubAgg(); };
  }, [uid]);

  // Load customers referred by this AgentID
  useEffect(() => {
    if (!agentId) return;
    const qRef = query(collection(db, "Customers"), where("ReferrerID", "==", agentId));
    const unsub = onSnapshot(qRef, (snap) => {
      const list = snap.docs.map((d) => {
        const x: any = d.data();
        return { id: d.id, name: String(x.fullName || x.name || x.username || x.email || "Unnamed") };
      });
      setCustomers(list);
    });
    return () => unsub();
  }, [agentId]);

  // Reset state when opening/closing
  useEffect(() => {
    setSelectedUid("");
    setRecipientQuery("");
    setShowSuggestions(false);
    setSuggestionLimit(20);
    setAmount("");
  }, [open]);

  // Reset suggestion limit when query changes
  useEffect(() => { setSuggestionLimit(20); }, [recipientQuery]);

  const filteredCustomers = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [customers, recipientQuery]);

  async function submitTransfer(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!uid || !agentId) {
        toast({ title: "Not signed in", variant: "destructive" });
        return;
      }
      const custUid = selectedUid.trim();
      if (!custUid) {
        toast({ title: "Select a customer", variant: "destructive" });
        return;
      }
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        toast({ title: "Enter a valid positive amount", variant: "destructive" });
        return;
      }
      if (amt > availablePoints) {
        toast({ title: "Insufficient points", variant: "destructive" });
        return;
      }

      setSubmitting(true);

      // Fetch business CustomerID
      let customerId = custUid;
      try {
        const cuSnap = await getDoc(doc(collection(db, "Customers"), custUid));
        const cu = (cuSnap.data() as any) || {};
        customerId = String(cu.CustomerID || cu.customerId || cu.CustomerId || custUid);
      } catch {}

      const agentToCustId = `${uid}_${custUid}`;

      // Transaction: deduct from AdminToAgentTransfer (agent doc) and upsert AgentToCustomerTransfer
      const adminAggRef = doc(collection(db, "AdminToAgentTransfer"), uid);
      const agentCustRef = doc(collection(db, "AgentToCustomerTransfer"), agentToCustId);
      await runTransaction(db, async (tx) => {
        // READS FIRST
        const aSnap = await tx.get(adminAggRef);
        const cSnap = await tx.get(agentCustRef);

        const aData = (aSnap.exists() ? (aSnap.data() as any) : {}) as any;
        const cur = Number(aData?.amount || 0);
        if (cur < amt) {
          throw new Error("Insufficient points");
        }
        const remain = cur - amt;

        const cData = (cSnap.exists() ? (cSnap.data() as any) : {}) as any;
        const prev = Number(cData?.amount || 0);
        const next = prev + amt;

        // WRITES AFTER ALL READS
        tx.set(adminAggRef, { amount: remain, lastTransferAt: Date.now() }, { merge: true });
        tx.set(
          agentCustRef,
          {
            agentId,
            agentDocId: uid,
            customerId,
            customerDocId: custUid,
            amount: next,
            lastTransferAt: Date.now(),
          },
          { merge: true }
        );
      });

      toast({ title: "Transfer completed", variant: "success" });
      setOpen(false);
    } catch (err: any) {
      toast({ title: err?.message || "Transfer failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transfer</h1>
          <p className="text-sm text-foreground/70">Send points to your customers</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Available: {availablePoints} pts</Badge>
          <Button size="sm" onClick={() => setOpen(true)}>New Transfer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Transfers</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{recentAggs.length} total</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">To</th>
                <th className="p-3">Amount (total)</th>
                <th className="p-3">Last Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {recentAggs.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-foreground/60" colSpan={3}>No transfers yet.</td>
                </tr>
              ) : (
                recentAggs.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3">{t.customerName || t.customerDocId}</td>
                    <td className="p-3">{t.amount} pts</td>
                    <td className="p-3">{t.lastTransferAt ? new Date(t.lastTransferAt).toLocaleString() : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="agent-transfer-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="agent-transfer-title" className="text-xl font-bold tracking-tight">New Transfer</h3>
                <p className="text-sm text-foreground/70">Choose a customer and amount to send points.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <form onSubmit={submitTransfer} className="p-4 md:p-5 grid gap-4">
              <div className="grid gap-1.5 relative">
                <label className="text-sm" htmlFor="recipient-customer">Select Customer</label>
                <div className="relative">
                  <input
                    id="recipient-customer"
                    value={recipientQuery}
                    onChange={(e) => { setRecipientQuery(e.target.value); setSelectedUid(""); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                    placeholder="Type to search customers"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 pr-8 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/60"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowSuggestions((v) => !v)}
                    aria-label="Toggle dropdown"
                  >
                    ▼
                  </button>
                </div>
                {showSuggestions && (
                  <div
                    className="absolute z-[101] top-full mt-1 w-full max-h-64 overflow-auto rounded-md border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-lg"
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
                        setSuggestionLimit((n) => n + 20);
                      }
                    }}
                  >
                    {filteredCustomers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-foreground/60">No matches</div>
                    ) : (
                      filteredCustomers.slice(0, suggestionLimit).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 ${selectedUid === r.id ? 'bg-black/5 dark:bg-white/10' : ''}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSelectedUid(r.id); setRecipientQuery(r.name); setShowSuggestions(false); }}
                        >
                          {r.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
                {selectedUid && (
                  <div className="text-xs text-foreground/60">Selected: {recipientQuery}</div>
                )}
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm" htmlFor="amount">Amount (points)</label>
                <input id="amount" inputMode="numeric" pattern="[0-9]*" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Max ${availablePoints}`} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                {availablePoints > 0 && <div className="text-xs text-foreground/60">Available: {availablePoints} pts</div>}
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting || !selectedUid || !amount}>{submitting ? 'Sending…' : 'Send Points'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
