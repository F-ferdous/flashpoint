"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function WalletPage() {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any;
      setPoints(typeof data?.points === "number" ? data.points : 0);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-foreground/70">Manage your balance, deposits, and withdrawals.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Add Funds</Button>
          <Button size="sm" variant="outline">Withdraw</Button>
          <a href="/userDashboard/redeem"><Button size="sm" className="bg-[var(--brand)] text-black hover:brightness-110">Redeem</Button></a>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WalletCard label="Points Balance" value={`${points ?? "..."} pts`} trend="" />
        <WalletCard label="Pending" value="$ 45" trend="-0.5%" />
        <WalletCard label="Total Earned" value="$ 2,340" trend="+5.4%" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Ledger</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Last 30 days</Badge>
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
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-3">{new Date().toLocaleTimeString()}</td>
                  <td className="p-3">{i % 2 ? "Credit" : "Debit"}</td>
                  <td className="p-3">$ {(30 + i * 9).toLocaleString()}</td>
                  <td className="p-3">User wallet entry #{i + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function WalletCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const positive = trend.startsWith("+");
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{trend} this period</div>
    </div>
  );
}
