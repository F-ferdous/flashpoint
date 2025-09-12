"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CustomerPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer</h1>
          <p className="text-sm text-foreground/70">Lookup and manage customer accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Add Customer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Customers</h2>
          <div className="flex gap-2">
            <Badge variant="outline">1,245 total</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Wallet</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="p-3 font-medium">Customer #{300 + i}</td>
                  <td className="p-3">customer{i}@flashpoint.io</td>
                  <td className="p-3">$ {(1200 - i * 25).toLocaleString()}</td>
                  <td className="p-3"><Button variant="ghost" size="sm">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
