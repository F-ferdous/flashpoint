"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function WalletPage() {
  const [platformPts, setPlatformPts] = useState(0);
  const [pendingPts, setPendingPts] = useState(0);
  const [escrowPts, setEscrowPts] = useState(0);
  const [ledger, setLedger] = useState<Array<{ id: string; ts?: any; type?: string; amount?: number; note?: string }>>([]);

  useEffect(() => {
    // Platform balance = sum of Points(customer_*) + sum of CustomerEarnings totals
    let sumPoints = 0;
    let sumEarnAgg = 0;
    const unsubPoints = onSnapshot(collection(db, "Points"), (snap) => {
      sumPoints = snap.docs.reduce((acc, d) => {
        const x: any = d.data();
        if (String(x?.type || "customer").toLowerCase() !== "customer") return acc;
        const pts = Number(x?.totalPoints ?? 0);
        return acc + (Number.isFinite(pts) ? pts : 0);
      }, 0);
      setPlatformPts(sumPoints + sumEarnAgg);
    });
    const unsubCustEarn = onSnapshot(collection(db, "CustomerEarnings"), (snap) => {
      sumEarnAgg = snap.docs.reduce((acc, d) => {
        const x: any = d.data();
        const pts = Number(x?.totalEarned ?? 0);
        return acc + (Number.isFinite(pts) ? pts : 0);
      }, 0);
      setPlatformPts(sumPoints + sumEarnAgg);
    });
    // Optional: listen to transfers as ledger (points). If collection doesn't exist, shows empty.
    const unsubTransfers = onSnapshot(collection(db, "transfers"), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setLedger(rows);
    }, () => setLedger([]));
    return () => {
      unsubPoints();
      unsubCustEarn();
      unsubTransfers();
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-foreground/70">Monitor balances and manage funding.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Fund Wallet</Button>
          <Button size="sm" variant="outline">Withdraw</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WalletCard label="Platform Balance" value={`${platformPts} pts`} />
        <WalletCard label="Pending Payouts" value={`${pendingPts} pts`} />
        <WalletCard label="Escrow" value={`${escrowPts} pts`} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Ledger</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Points</Badge>
          </div>
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
              {ledger.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-foreground/60" colSpan={4}>No ledger entries</td>
                </tr>
              ) : ledger.map((row) => (
                <tr key={row.id}>
                  <td className="p-3">{row.ts?.toDate ? row.ts.toDate().toLocaleString() : "—"}</td>
                  <td className="p-3">{row.type || (row.amount && row.amount > 0 ? "Credit" : "Debit")}</td>
                  <td className="p-3">{Number(row.amount || 0)} pts</td>
                  <td className="p-3">{row.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function WalletCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
