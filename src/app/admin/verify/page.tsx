"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function VerifyPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verify</h1>
          <p className="text-sm text-foreground/70">Process and review pending verifications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary">Bulk Approve</Button>
          <Button size="sm" variant="outline">Export</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pending</h2>
          <div className="flex gap-2">
            <Badge variant="warning">12 awaiting</Badge>
          </div>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="font-medium">Customer #{500 + i}</div>
                <div className="text-sm text-foreground/70">National ID • Submitted {i + 1}h ago</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm">Approve</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
