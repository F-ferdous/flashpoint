"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";

export default function ReferalsPage() {
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [refLink, setRefLink] = useState<string>("");
  const [myRefId, setMyRefId] = useState<string>("");
  const [customers, setCustomers] = useState<Array<{ id: string; fullName?: string; email?: string; phone?: string; district?: string; CustomerID?: string }>>([]);
  const [view, setView] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const id = user?.uid || null;
      setUid(id);
      if (!id) return;
      // subscribe to Customers/{uid} for CustomerID (for future link; UI disabled for now)
      const unsubCustomer = onSnapshot(doc(db, "Customers", id), (snap: any) => {
        const x = (snap.exists() ? (snap.data() as any) : null) as any;
        const customerId = (x?.CustomerID as string) || null;
        const shortId = customerId && customerId.length > 0 ? customerId : id;
        setRefLink(`${window.location.origin}/signup?ref=${shortId}`);
        setMyRefId(shortId || "");
      });

      return () => {
        unsubCustomer();
      };
    });
    return () => unsub();
  }, []);

  // Subscribe to referred customers once we know myRefId
  useEffect(() => {
    if (!myRefId) return;
    const qCust = query(collection(db, "Customers"), where("ReferrerID", "==", myRefId));
    const unsub = onSnapshot(qCust, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      const approved = rows.filter((r: any) => r?.Approved === true);
      setCustomers(approved as any);
    });
    return () => unsub();
  }, [myRefId]);

  async function copyLink() {}

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referals</h1>
          <p className="text-sm text-foreground/70">Invite friends using your personal link. Approvals are finalized by agents.</p>
        </div>
        <div className="flex items-center gap-2 text-sm" />
      </header>

      {/* Share link (disabled) */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Referral link</h2>
            <p className="text-xs text-foreground/70">Referral link is not available yet.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              readOnly
              disabled
              value={refLink}
              className="flex-1 min-w-0 sm:min-w-[520px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
            />
            <Button size="sm" disabled>Copy</Button>
          </div>
        </div>
      </section>

      {/* Referred customers (approved) */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Customers via your referral</h2>
          <div className="text-sm text-foreground/70">{customers.length} total</div>
        </div>
        {customers.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No customers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-foreground/70">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-medium">{c.fullName || "—"}</td>
                    <td className="p-3">{(c.email || "").toLowerCase()}</td>
                    <td className="p-3">{(c as any).phone || "—"}</td>
                    <td className="p-3">{(c as any).district || "—"}</td>
                    <td className="p-3">{(c as any).CustomerID || "—"}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="secondary" onClick={() => setView(c)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {view && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="view-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setView(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="view-title" className="text-xl font-bold tracking-tight">Customer</h3>
                <p className="text-sm text-foreground/70">Details (read-only)</p>
              </div>
              <button onClick={() => setView(null)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg:white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <div className="p-4 md:p-5 grid gap-3 text-sm">
              <div className="grid gap-1.5">
                <Label>Name</Label>
                <input value={view.fullName || view.name || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label>Email</Label>
                <input value={view.email || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg:white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label>Phone</Label>
                <input value={view.phone || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg:white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label>District</Label>
                <input value={view.district || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg:white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label>Customer ID</Label>
                <input value={view.CustomerID || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg:white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div className="p-4 md:p-5 pt-0 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
