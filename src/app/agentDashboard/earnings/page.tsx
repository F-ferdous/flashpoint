"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
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
        <SummaryCard label="This Month" value="$ 1,280" delta="+8.6%" />
        <SummaryCard label="Last Month" value="$ 1,178" delta="+3.1%" />
        <SummaryCard label="Pending" value="$ 210" delta="-0.8%" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Ledger</h2>
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
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-3">{new Date().toLocaleString()}</td>
                  <td className="p-3">{i % 2 ? "Credit" : "Debit"}</td>
                  <td className="p-3">$ {(50 + i * 7).toLocaleString()}</td>
                  <td className="p-3">Entry #{i + 1}</td>
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
