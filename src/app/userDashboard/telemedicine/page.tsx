"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TelemedicinePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Telemedicine</h1>
          <p className="text-sm text-foreground/70">Access telemedicine services and appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Book Session</Button>
          <Button size="sm" variant="outline">Manage Plan</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TeleCard label="Plan" value="Family Basic" hint="Renews on 28th" tone="neutral" />
        <TeleCard label="Upcoming" value="Mon, 10:30 AM" hint="Dr. Khan (GP)" tone="positive" />
        <TeleCard label="Doctors Available" value="9" hint="Now online" tone="neutral" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Sessions</h2>
          <Badge variant="outline">Last 6 months</Badge>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="p-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="font-medium">Session #{400 + i} • General Physician</div>
                <div className="text-foreground/70">{new Date().toLocaleDateString()} • 20 min • Outcome: Follow-up</div>
              </div>
              <div className="flex items-center gap-3 justify-start sm:justify-end">
                <div className="font-medium">$ {(12 + i).toFixed(2)}</div>
                <Button size="sm" variant="outline">Summary</Button>
                <Button size="sm">Rebook</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function TeleCard({ label, value, hint, tone = "neutral" }: { label: string; value: string; hint?: string; tone?: "neutral" | "positive" | "negative" }) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-300"
      : tone === "negative"
      ? "text-rose-600 dark:text-rose-300"
      : "text-foreground/70";
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className={`mt-1 text-xs ${toneClass}`}>{hint}</div>}
    </div>
  );
}
