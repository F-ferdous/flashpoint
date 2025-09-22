"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function CustomerHomePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.customer.header_title")}</h1>
          <p className="text-sm text-foreground/70">{t("dash.customer.header_sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{t("dash.customer.badge_profile")}</Badge>
          <Button size="sm">{t("dash.customer.edit")}</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label={t("dash.customer.wallet_balance")} value="$ 820" />
        <Card label={t("dash.customer.active_subs")} value="2" />
        <Card label={t("dash.customer.points")} value="4,250" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("dash.customer.recent_activity")}</h2>
          <Button variant="ghost" className="text-sm">{t("dash.customer.view_all")}</Button>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="p-4 text-sm grid gap-1 sm:grid-cols-[180px_1fr]">
              <div className="text-foreground/70">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>Transaction #{(i + 1) * 7} • {i % 2 ? t("dash.customer.debit") : t("dash.customer.credit")} • $ {(20 + i * 5).toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
