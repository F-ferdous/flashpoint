"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TransferPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transfer</h1>
          <p className="text-sm text-foreground/70">Initiate or review wallet transfers between users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">New Transfer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Transfers</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Today</Badge>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-3">Agent #{200 + i}</td>
                  <td className="p-3">Customer #{300 + i}</td>
                  <td className="p-3">$ {(100 + i * 10).toLocaleString()}</td>
                  <td className="p-3"><Badge variant={i % 3 === 0 ? "warning" : "success"}>{i % 3 === 0 ? "Pending" : "Completed"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
