"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [agentCount, setAgentCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const unsubAgents = onSnapshot(collection(db, "agents"), (snap) => setAgentCount(snap.size));
    const unsubCustomers = onSnapshot(collection(db, "customers"), (snap) => setCustomerCount(snap.size));
    return () => {
      unsubAgents();
      unsubCustomers();
    };
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">{t("dash.admin.header_title")}</h1>
          <p className="text-xs sm:text-sm text-foreground/70">{t("dash.admin.header_sub")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs sm:text-sm">{t("dash.common.live")}</Badge>
          <Button size="sm" className="h-8 px-3 text-xs sm:text-sm">{t("dash.common.export")}</Button>
        </div>
      </header>

      <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <CardStat icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />} label={t("dash.admin.stats.active_agents")} value={String(agentCount)} delta="" tone={{ bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" }} />
        {(() => {
          const lbl = t("dash.admin.stats.customers");
          const label = lbl === "dash.admin.stats.customers" ? "Customers" : lbl;
          return (
            <CardStat icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />} label={label} value={String(customerCount)} delta="" tone={{ bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" }} />
          );
        })()}
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-semibold">{t("dash.common.recent_activity")}</h2>
        </div>
        <Separator />
        <div className="p-6 text-sm text-foreground/70">No recent activity.</div>
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
