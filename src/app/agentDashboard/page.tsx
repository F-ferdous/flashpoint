"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, Gift, Wallet } from "lucide-react";

export default function AgentHomePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-sm text-foreground/70">Quick overview of your activity and earnings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Live</Badge>
          <Button size="sm">Export</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat icon={<Users className="h-4 w-4" />} label="Customers" value="245" delta="+3.2%" tone={{ bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" }} />
        <CardStat icon={<ShieldCheck className="h-4 w-4" />} label="Verifications" value="34" delta="+5.1%" tone={{ bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300" }} />
        <CardStat icon={<Gift className="h-4 w-4" />} label="Referals" value="12" delta="+1.9%" tone={{ bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300" }} />
        <CardStat icon={<Wallet className="h-4 w-4" />} label="Earnings" value="$ 1,280" delta="+8.6%" tone={{ bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" }} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <Button variant="ghost" className="text-sm">View all</Button>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="p-4 text-sm grid gap-1 sm:grid-cols-[180px_1fr]">
              <div className="text-foreground/70">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>Verified Customer #{(i + 1) * 9} and earned <span className="font-medium">$ {(15 + i).toFixed(2)}</span>.</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CardStat({ icon, label, value, delta, tone = { bg: "bg-[var(--brand-15)]", text: "text-foreground" } }: { icon: React.ReactNode; label: string; value: string; delta: string; tone?: { bg: string; text: string } }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="flex items-center justify-between text-sm text-foreground/70">
        <span className="inline-flex items-center gap-2">
          <span className={`grid place-items-center rounded-md p-1.5 ${tone.bg} ${tone.text}`}>{icon}</span>
          {label}
        </span>
        <span className={delta.startsWith("-") ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"}>{delta}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
