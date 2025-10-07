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
          <p className="text-sm text-foreground/70">Process your pending verifications.</p>
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
            <Badge variant="warning">— awaiting</Badge>
          </div>
        </div>
        <Separator />
        <div className="p-4 text-sm text-foreground/70">No pending verifications yet.</div>
      </section>
    </div>
  );
}
