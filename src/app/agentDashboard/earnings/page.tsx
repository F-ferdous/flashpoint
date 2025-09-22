"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

type LedgerEntry = {
  id: string;
  time: number; // epoch ms
  type: "Credit" | "Debit";
  amount: number;
  note: string;
};

export default function EarningsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const id = user?.uid || null;
      setUid(id);
    });
    return () => unsub();
  }, []);

  // Subscribe to agent points and approved referrals as ledger entries
  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const unsubs: Array<() => void> = [];

    // Agent points
    unsubs.push(
      onSnapshot(doc(db, "agents", uid), (snap) => {
        const data = snap.data() as any;
        setPoints(Number(data?.points || 0));
      })
    );

    // Approved referrals as credits (100 points each)
    const q = query(
      collection(db, "pendingUsers"),
      where("referrerUid", "==", uid),
      where("status", "==", "Approved")
    );
    unsubs.push(
      onSnapshot(q, (snap) => {
        const items: LedgerEntry[] = snap.docs
          .map((d) => {
            const x = d.data() as any;
            return {
              id: d.id,
              time: Number(x.approvedAt || x.updatedAt || Date.now()),
              type: "Credit" as const,
              amount: 100,
              note: `Referral approved: ${(x.fullName || "").toString()}`,
            };
          })
          .sort((a, b) => b.time - a.time);
        setLedger(items);
        setLoading(false);
      })
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [uid]);

  const totalReferrals = useMemo(() => ledger.length, [ledger]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-sm text-foreground/70">Your earnings summary and ledger.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" disabled>Withdraw</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Total Points" value={`${points.toLocaleString()} pts`} delta={`+${(totalReferrals || 0)} refs`} />
        <SummaryCard label="Approved Referrals" value={`${totalReferrals}`} delta={"+100 pts each"} />
        <SummaryCard label="Pending" value={loading ? "Loading…" : `${Math.max(0, points - totalReferrals * 100)} pts`} delta={"—"} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Ledger</h2>
          <Badge variant="outline">All time</Badge>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={4}>Loading…</td>
                </tr>
              ) : ledger.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan={4}>No earnings yet.</td>
                </tr>
              ) : (
                ledger.map((e) => (
                  <tr key={e.id}>
                    <td className="p-3">{new Date(e.time).toLocaleString()}</td>
                    <td className="p-3">{e.type}</td>
                    <td className="p-3">{`${e.amount.toLocaleString()} pts`}</td>
                    <td className="p-3">{e.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = delta.startsWith("+");
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{delta}</div>
    </div>
  );
}
