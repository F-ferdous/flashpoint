"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query, limit } from "firebase/firestore";

export default function EarningsPage() {
  const [points, setPoints] = useState<number | null>(null);
  const [ledger, setLedger] = useState<Array<{ id: string; ts?: any; amount: number; offer_name?: string }>>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      const data = snap.data() as any;
      setPoints(typeof data?.points === "number" ? data.points : 0);
    });
    const ledgerRef = collection(db, "users", uid, "offerwall_ledger");
    const q = query(ledgerRef, orderBy("ts", "desc"), limit(10));
    const unsubLedger = onSnapshot(q, (snap) => {
      setLedger(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      );
    });
    return () => {
      unsubUser();
      unsubLedger();
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-sm text-foreground/70">Your earnings summary and ledger.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Withdraw</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Points Balance" value={`${points ?? "..."} pts`} delta="" />
        <SummaryCard label="Last Month" value="$ 520" delta="+1.8%" />
        <SummaryCard label="Pending" value="$ 45" delta="-0.5%" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">OfferWall Ledger</h2>
          <Badge variant="outline">Last 30 days</Badge>
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
              {ledger.map((row) => (
                <tr key={row.id}>
                  <td className="p-3">{row.ts?.toDate ? row.ts.toDate().toLocaleString() : ""}</td>
                  <td className="p-3">Credit</td>
                  <td className="p-3">{row.amount}</td>
                  <td className="p-3">{row.offer_name || "OfferToro"}</td>
                </tr>
              ))}
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
      <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{delta} vs last</div>
    </div>
  );
}
