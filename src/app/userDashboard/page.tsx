"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Gift, Wallet, Globe, Stethoscope } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function UserHomePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.user.header_title")}</h1>
          <p className="text-sm text-foreground/70">{t("dash.user.header_sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{t("dash.common.live")}</Badge>
          <Button size="sm">{t("dash.common.export")}</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat icon={<Wallet className="h-4 w-4" />} label={t("dash.user.nav.earnings")} value="$ 560" delta="+4.2%" tone={{ bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" }} />
        <CardStat icon={<Gift className="h-4 w-4" />} label={t("dash.user.nav.referals")} value="8" delta="+2.1%" tone={{ bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300" }} />
        <CardStat icon={<Globe className="h-4 w-4" />} label={t("dash.user.nav.earn_online")} value="3 tasks" delta="+1.0%" tone={{ bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" }} />
        <CardStat icon={<Stethoscope className="h-4 w-4" />} label={t("dash.user.nav.telemedicine")} value="Active" delta="+0.0%" tone={{ bg: "bg-rose-500/15", text: "text-rose-600 dark:text-rose-300" }} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("dash.common.recent_activity")}</h2>
          <Button variant="ghost" className="text-sm">{t("dash.common.view_all")}</Button>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="p-4 text-sm grid gap-1 sm:grid-cols-[180px_1fr]">
              <div className="text-foreground/70">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>Updated wallet balance and invited a friend. Earned <span className="font-medium">$ {(5 + i).toFixed(2)}</span>.</div>
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
