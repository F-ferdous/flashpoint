"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type PendingItem = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  district?: string | null;
  username?: string | null;
  phone?: string | null;
  address?: string | null;
  nidNumber?: string | null;
};

export default function VerifyPage() {
  const [pendingAgents, setPendingAgents] = useState<PendingItem[]>([]);
  const [pendingCustomers, setPendingCustomers] = useState<PendingItem[]>([]);
  const [view, setView] = useState<{ type: 'agent' | 'customer'; item: PendingItem } | null>(null);
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsub1 = onSnapshot(query(collection(db, "pendingAgents")), (snap) => {
      setPendingAgents(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    const unsub2 = onSnapshot(query(collection(db, "pendingCustomers"), orderBy("createdAt", "desc")), (snap) => {
      setPendingCustomers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verify</h1>
          <p className="text-sm text-foreground/70">Process and review pending registrations.</p>
        </div>
      </header>

      {/* Pending Agents */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pending Agents</h2>
          <div className="flex gap-2">
            <Badge variant="warning">{pendingAgents.length} awaiting</Badge>
          </div>
        </div>
        <Separator />
        {pendingAgents.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No pending agents.</div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {pendingAgents.map((u) => (
              <li key={u.id} className="p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-medium">{u.fullName || "Unnamed"}</div>
                  <div className="text-sm text-foreground/70">{u.email || "—"}{u.district ? ` • ${u.district}` : ""}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setView({ type: 'agent', item: u })}>View</Button>
                  <Button size="sm" onClick={() => setView({ type: 'agent', item: u })}>Approve</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending Customers */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pending Customers</h2>
          <div className="flex gap-2">
            <Badge variant="warning">{pendingCustomers.length} awaiting</Badge>
          </div>
        </div>
        <Separator />
        {pendingCustomers.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No pending customers.</div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {pendingCustomers.map((u) => (
              <li key={u.id} className="p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-medium">{u.fullName || "Unnamed"}</div>
                  <div className="text-sm text-foreground/70">{u.email || "—"}{u.district ? ` • ${u.district}` : ""}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setView({ type: 'customer', item: u })}>View</Button>
                  <Button size="sm" onClick={() => setView({ type: 'customer', item: u })}>Approve</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Unified View/Approve modal */}
      {view && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="approve-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setView(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="approve-title" className="text-xl font-bold tracking-tight">{view.type === 'customer' ? 'Approve Customer' : 'Approve Agent'}</h3>
                <p className="text-sm text-foreground/70">Create username and password to activate.</p>
              </div>
              <button onClick={() => setView(null)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <div className="px-4 pt-4 text-sm grid gap-2">
              <div className="font-medium">{view.item.fullName || 'Unnamed'}</div>
              <div className="text-foreground/70">District: {view.item.district || '—'}</div>
              <div className="text-foreground/70">Login email (username): {view.item.username || view.item.email || '—'}</div>
              {view.item.phone && <div className="text-foreground/70">Phone: {view.item.phone}</div>}
              {view.item.address && <div className="text-foreground/70">Address: {view.item.address}</div>}
              {view.item.nidNumber && <div className="text-foreground/70">NID: {view.item.nidNumber}</div>}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const password = String(fd.get("password") || "");
                try {
                  setApproving(true);
                  const endpoint = view.type === 'customer' ? "/api/admin/approve-customer" : "/api/admin/approve-agent";
                  const payload = { pendingId: view.item.id, password };
                  const resp = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await resp.json();
                  if (!resp.ok) throw new Error(data?.error || `Failed to approve ${view.type}`);
                  toast({ title: `${view.type === 'customer' ? 'Customer' : 'Agent'} approved`, variant: "success" });
                  setView(null);
                } catch (err: any) {
                  toast({ title: err?.message || `Failed to approve ${view?.type || ''}`, variant: "destructive" });
                } finally {
                  setApproving(false);
                }
              }}
              className="p-4 md:p-5 grid gap-3"
            >
              <div className="grid gap-1.5">
                <Label>Login email (from signup)</Label>
                <input value={view.item.username || view.item.email || ''} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <input id="password" name="password" type="password" required minLength={6} placeholder="Temporary password" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" disabled={approving} />
              </div>
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setView(null)} disabled={approving}>Cancel</Button>
                <Button type="submit" disabled={approving}>{approving ? 'Approving…' : 'Approve'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
