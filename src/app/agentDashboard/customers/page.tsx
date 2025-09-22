"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

type Customer = {
  uid: string;
  name?: string | null;
  username?: string | null;
  password?: string | null; // stored per current backend implementation
  contactEmail?: string | null;
  phone?: string | null;
  nidNumber?: string | null;
  district?: string | null;
  address?: string | null;
  createdAt?: number | null;
};

export default function CustomersPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Customer | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const q = query(collection(db, "users"), where("referrerUid", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any) }))
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setCustomers(items);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const total = useMemo(() => customers.length, [customers]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-foreground/70">Approved users who registered via your referral link.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{total} total</Badge>
          {/* Removed Add Customer button per requirement */}
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Customers</h2>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={4}>Loading…</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan={4}>No customers yet.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.uid}>
                    <td className="p-3 font-medium">{c.name || "—"}</td>
                    <td className="p-3">{c.username || "—"}</td>
                    <td className="p-3">{(c.contactEmail || "").toString().toLowerCase()}</td>
                    <td className="p-3">
                      <Button size="sm" variant="secondary" onClick={() => setView(c)}>View Details</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {view && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setView(null)} />
          <div className="relative w-full max-w-lg rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Customer details</h3>
              <button onClick={() => setView(null)} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div><span className="text-foreground/70">Name: </span><span className="font-medium">{view.name || "—"}</span></div>
              <div><span className="text-foreground/70">Username: </span><span className="font-medium">{view.username || "—"}</span></div>
              <div><span className="text-foreground/70">Password: </span><span className="font-medium">{view.password || "—"}</span></div>
              <div><span className="text-foreground/70">Email: </span><span className="font-medium">{(view.contactEmail || "").toString().toLowerCase()}</span></div>
              <div><span className="text-foreground/70">Phone: </span><span className="font-medium">{view.phone || "—"}</span></div>
              <div><span className="text-foreground/70">District: </span><span className="font-medium">{view.district || "—"}</span></div>
              <div><span className="text-foreground/70">NID: </span><span className="font-medium">{view.nidNumber || "—"}</span></div>
              <div><span className="text-foreground/70">Address: </span><span className="font-medium">{view.address || "—"}</span></div>
              <div><span className="text-foreground/70">Created: </span><span className="font-medium">{view.createdAt ? new Date(Number(view.createdAt)).toLocaleString() : "—"}</span></div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
