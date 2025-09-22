"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query, updateDoc, serverTimestamp, where, getDoc, runTransaction } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PayoutReq {
  id: string;
  uid: string;
  email?: string | null;
  method: string;
  amountPoints: number;
  details?: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt?: any;
  processedAt?: any;
  processedBy?: string | null;
}

export default function AdminPayoutsPage() {
  const [items, setItems] = useState<PayoutReq[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const base = collection(db, "payout_requests");
    const q = query(base, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as PayoutReq[]
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => x.status === filter);
  }, [items, filter]);

  async function approve(req: PayoutReq) {
    const adminUser = auth.currentUser;
    if (!adminUser) return;
    setBusyId(req.id);
    try {
      await runTransaction(db, async (tx) => {
        const userRef = doc(db, "users", req.uid);
        const reqRef = doc(db, "payout_requests", req.id);
        const userSnap = await tx.get(userRef);
        const reqSnap = await tx.get(reqRef);
        if (!reqSnap.exists()) throw new Error("Request not found");
        const cur = userSnap.data() as any;
        const currentPoints = Number(cur?.points || 0);
        if (currentPoints < req.amountPoints) {
          throw new Error("Insufficient user points");
        }
        tx.update(userRef, { points: currentPoints - req.amountPoints });
        tx.update(reqRef, {
          status: "approved",
          processedAt: serverTimestamp(),
          processedBy: adminUser.email || adminUser.uid,
        });
      });
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Failed to approve");
    } finally {
      setBusyId(null);
    }
  }

  async function reject(req: PayoutReq) {
    const adminUser = auth.currentUser;
    if (!adminUser) return;
    setBusyId(req.id);
    try {
      const ref = doc(db, "payout_requests", req.id);
      await updateDoc(ref, {
        status: "rejected",
        processedAt: serverTimestamp(),
        processedBy: adminUser.email || adminUser.uid,
      });
    } catch (e) {
      console.error(e);
      alert("Failed to reject");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="text-sm text-foreground/70">Review and process user redemption requests.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>Filter:</span>
          <select
            className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Requests</h2>
          <Badge variant="outline">{filtered.length} shown</Badge>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">User</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount (pts)</th>
                <th className="p-3">Details</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="p-3">{r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : ""}</td>
                  <td className="p-3">{r.email || r.uid}</td>
                  <td className="p-3">{r.method}</td>
                  <td className="p-3">{r.amountPoints}</td>
                  <td className="p-3">{r.details || ""}</td>
                  <td className="p-3">
                    <Badge variant={r.status === "pending" ? "secondary" : r.status === "approved" ? "success" : "destructive"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" disabled={busyId === r.id} onClick={() => approve(r)}>Approve</Button>
                        <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => reject(r)}>Reject</Button>
                      </div>
                    ) : (
                      <span className="text-foreground/60">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
