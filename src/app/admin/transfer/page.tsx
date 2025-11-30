"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, query, where, runTransaction, serverTimestamp } from "firebase/firestore";

export default function TransferPage() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"agent" | "customer" | null>(null);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUid, setSelectedUid] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [recipientQuery, setRecipientQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestionLimit, setSuggestionLimit] = useState<number>(20);
  const [adminTransfers, setAdminTransfers] = useState<Array<{ id: string; ts?: any; amount: number; note?: string; status?: string; recipient: { uid: string; type: 'agent' | 'customer'; name?: string | null; email?: string | null; username?: string | null } }>>([]);
  const [agentAggs, setAgentAggs] = useState<Array<{ id: string; amount: number; lastTransferAt?: number; agentDocId: string; adminUid?: string }>>([]);
  const [customerAggs, setCustomerAggs] = useState<Array<{ id: string; amount: number; lastTransferAt?: number; customerDocId: string; adminUid?: string }>>([]);

  // Load agents and approved customers from Firestore
  useEffect(() => {
    const unsubAgents = onSnapshot(collection(db, "Agents"), (snap) => {
      setAgents(snap.docs.map((d) => {
        const x: any = d.data();
        return { id: d.id, name: String(x.fullName || x.name || "Unnamed") };
      }));
    });
    const unsubCustomers = onSnapshot(query(collection(db, "Customers"), where("Approved", "==", true)), (snap) => {
      setCustomers(snap.docs.map((d) => {
        const x: any = d.data();
        return { id: d.id, name: String(x.fullName || x.name || x.username || x.email || "Unnamed") };
      }));
    });
    return () => { unsubAgents(); unsubCustomers(); };
  }, []);

  // Reset recipient when switching target type or opening
  useEffect(() => {
    setSelectedUid("");
    setAmount("");
    setRecipientQuery("");
    setShowSuggestions(false);
    setSuggestionLimit(20);
  }, [target, open]);

  // Reset suggestion limit when query changes significantly
  useEffect(() => {
    setSuggestionLimit(20);
  }, [recipientQuery]);

  // Subscribe to AdminTransfers (customer ledger)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'AdminTransfers'), (snap) => {
      const rows = snap.docs.map((d) => {
        const x: any = d.data();
        return {
          id: d.id,
          ts: x.ts,
          amount: Number(x.amount || 0),
          status: 'Completed',
          note: x.note || 'Admin transfer',
          recipient: { uid: x.uid, type: x.type, name: x.name },
        } as any;
      });
      setAdminTransfers(rows);
    });
    return () => unsub();
  }, []);

  // Subscribe to AdminToAgentTransfer (agent aggregates)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'AdminToAgentTransfer'), (snap) => {
      const rows = snap.docs.map((d) => {
        const x: any = d.data();
        return {
          id: d.id,
          amount: Number(x.amount || 0),
          lastTransferAt: Number(x.lastTransferAt || 0),
          agentDocId: String(x.agentDocId || d.id),
          adminUid: x.adminUid,
        };
      });
      setAgentAggs(rows);
    });
    return () => unsub();
  }, []);

  // Subscribe to AdminToCustomerTransfer (customer aggregates)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'AdminToCustomerTransfer'), (snap) => {
      const rows = snap.docs.map((d) => {
        const x: any = d.data();
        return {
          id: d.id,
          amount: Number(x.amount || 0),
          lastTransferAt: Number(x.lastTransferAt || 0),
          customerDocId: String(x.customerDocId || d.id),
          adminUid: x.adminUid,
        };
      });
      setCustomerAggs(rows);
    });
    return () => unsub();
  }, []);

  const mergedTransfers = useMemo(() => {
    const nameOf = (list: Array<{id:string;name:string}>, id: string) => list.find(x => x.id === id)?.name || undefined;
    const agentRows = agentAggs.map((a) => ({
      id: `agent_${a.id}`,
      ts: a.lastTransferAt,
      amount: a.amount,
      status: 'Completed',
      note: 'Admin to Agent (total)',
      recipient: { uid: a.agentDocId, type: 'agent' as const, name: nameOf(agents, a.agentDocId), username: undefined, email: undefined },
    }));
    const customerRows = customerAggs.map((c) => ({
      id: `customer_${c.id}`,
      ts: c.lastTransferAt,
      amount: c.amount,
      status: 'Completed',
      note: 'Admin to Customer (total)',
      recipient: { uid: c.customerDocId, type: 'customer' as const, name: nameOf(customers, c.customerDocId), username: undefined, email: undefined },
    }));
    const rows = [...agentRows, ...customerRows];
    // Normalize ts for sorting
    const tsVal = (ts: any) => ts?.toDate ? ts.toDate().getTime() : (typeof ts === 'number' ? ts : 0);
    rows.sort((a: any, b: any) => tsVal(b.ts) - tsVal(a.ts));
    return rows;
  }, [agentAggs, customerAggs, agents, customers]);

  const filteredCustomers = useMemo(() => {
    const q = recipientQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [customers, recipientQuery]);

  async function submitTransfer(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!target) {
        toast({ title: "Select transfer type", variant: "destructive" });
        return;
      }
      const uid = selectedUid.trim();
      if (!uid) {
        toast({ title: "Select a recipient", variant: "destructive" });
        return;
      }
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        toast({ title: "Enter a valid positive amount", variant: "destructive" });
        return;
      }
      setSubmitting(true);
      const adminEmail = auth.currentUser?.email || 'Admin';
      const adminUid = auth.currentUser?.uid || 'admin';
      const nameLookup = (list: Array<{id:string;name:string}>, id: string) => list.find(x => x.id === id)?.name || 'Recipient';
      const recipientName = nameLookup(target === 'agent' ? agents : customers, uid);

      // Agent transfers: Upsert into AdminToAgentTransfer and DO NOT use points or AdminTransfers
      if (target === 'agent') {
        // Fetch agent's business ID if present; fall back to doc ID
        let agentId = uid;
        try {
          const agSnap = await getDoc(doc(collection(db, 'Agents'), uid));
          const agData = (agSnap.data() as any) || {};
          agentId = String(agData.AgentID || agData.agentId || agData.AgentId || uid);
        } catch {}

        const aggRef = doc(collection(db, 'AdminToAgentTransfer'), uid);
        await runTransaction(db, async (tx) => {
          const curSnap = await tx.get(aggRef);
          const curData = (curSnap.exists() ? (curSnap.data() as any) : {}) as any;
          const prevAmount = Number(curData?.amount || 0);
          const nextAmount = prevAmount + amt;
          tx.set(
            aggRef,
            {
              agentId,
              agentDocId: uid,
              amount: nextAmount,
              lastTransferAt: Date.now(),
              adminUid,
            },
            { merge: true }
          );
        });

        toast({ title: 'Transfer completed', variant: 'success' });
        setOpen(false);
        return;
      }

      // Customer transfers: Upsert into AdminToCustomerTransfer and DO NOT use points or AdminTransfers
      if (target === 'customer') {
        // Fetch customer's business ID if present; fall back to doc ID
        let customerId = uid;
        try {
          const cuSnap = await getDoc(doc(collection(db, 'Customers'), uid));
          const cuData = (cuSnap.data() as any) || {};
          customerId = String(cuData.CustomerID || cuData.customerId || cuData.CustomerId || uid);
        } catch {}

        const aggRef = doc(collection(db, 'AdminToCustomerTransfer'), uid);
        await runTransaction(db, async (tx) => {
          const curSnap = await tx.get(aggRef);
          const curData = (curSnap.exists() ? (curSnap.data() as any) : {}) as any;
          const prevAmount = Number(curData?.amount || 0);
          const nextAmount = prevAmount + amt;
          tx.set(
            aggRef,
            {
              customerId,
              customerDocId: uid,
              amount: nextAmount,
              lastTransferAt: Date.now(),
              adminUid,
            },
            { merge: true }
          );
        });

        toast({ title: 'Transfer completed', variant: 'success' });
        setOpen(false);
        return;
      }

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
          <p className="text-sm text-foreground/70">Initiate or review wallet transfers between users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => { setTarget(null); setOpen(true); }}>New Transfer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Transfers</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{mergedTransfers.length} total</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {mergedTransfers.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-foreground/60" colSpan={5}>No transfers yet.</td>
                </tr>
              ) : (
                mergedTransfers.map((t) => {
                  const primary = t.recipient?.name || t.recipient?.username || t.recipient?.email || `${t.recipient?.type ?? 'user'} ${t.recipient?.uid?.slice(0,6) ?? ''}…`;
                  const secondary = t.recipient?.name ? (t.recipient?.username || t.recipient?.email || '') : '';
                  const timeStr = (t as any).ts?.toDate ? (t as any).ts.toDate().toLocaleString() : (typeof (t as any).ts === 'number' ? new Date((t as any).ts).toLocaleString() : '');
                  return (
                    <tr key={t.id}>
                      <td className="p-3">Admin</td>
                      <td className="p-3">
                        <div className="font-medium">{primary}</div>
                        {secondary && <div className="text-xs text-foreground/60">{secondary}</div>}
                      </td>
                      <td className="p-3">{t.amount} pts</td>
                      <td className="p-3">
                        <Badge variant={t.status === 'Completed' ? 'success' : t.status === 'Pending' ? 'warning' : 'secondary'}>
                          {t.status || 'Completed'}
                        </Badge>
                      </td>
                      <td className="p-3">{timeStr}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* New Transfer Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="new-transfer-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="new-transfer-title" className="text-xl font-bold tracking-tight">New Transfer</h3>
                <p className="text-sm text-foreground/70">Choose a recipient and amount to send points.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <form onSubmit={submitTransfer} className="p-4 md:p-5 grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium">Transfer to</div>
                <div className="flex gap-2">
                  <Button type="button" variant={target === 'agent' ? 'default' : 'secondary'} size="sm" onClick={() => setTarget('agent')}>Agent</Button>
                  <Button type="button" variant={target === 'customer' ? 'default' : 'secondary'} size="sm" onClick={() => setTarget('customer')}>Customer</Button>
                </div>
              </div>

              {target && (
                target === 'agent' ? (
                  <div className="grid gap-1.5">
                    <label className="text-sm" htmlFor="recipient-agent">Select Agent</label>
                    <select id="recipient-agent" value={selectedUid} onChange={(e) => setSelectedUid(e.target.value)} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]">
                      <option value="">Select one</option>
                      {agents.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
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
                )
              )}

              <div className="grid gap-1.5">
                <label className="text-sm" htmlFor="amount">Amount (points)</label>
                <input id="amount" inputMode="numeric" pattern="[0-9]*" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting || !target || !selectedUid || !amount}>{submitting ? 'Sending…' : 'Send Points'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
