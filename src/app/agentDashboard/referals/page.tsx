"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ReferalsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referals</h1>
          <p className="text-sm text-foreground/70">Track referal conversions and rewards.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">12 total</Badge>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Referals</h2>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full grid place-items-center bg-[var(--brand-15)]">#{100 + i}</div>
                <div>
                  <div className="font-medium">Ref #{100 + i}</div>
                  <div className="text-foreground/70">Converted • {new Date().toLocaleDateString()}</div>
                </div>
              </div>
              <div className="font-medium">$ {(10 + i).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
