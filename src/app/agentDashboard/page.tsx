"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users, Gift, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";

export default function AgentHomePage() {
  const { t } = useI18n();
  const [points, setPoints] = useState<number>(0);
  const [uid, setUid] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [customersCount, setCustomersCount] = useState<number>(0);

  // Track auth UID
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
      if (!user) setPoints(0);
    });
    return () => unsub();
  }, []);

  // Subscribe to AgentID from profile
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "Agents", uid), (snap) => {
      const x = (snap.data() as any) || {};
      const aid = String(x.AgentID || x.agentId || x.AgentId || "").trim() || null;
      setAgentId(aid);
    });
    return () => unsub();
  }, [uid]);

  // Subscribe to AdminToAgentTransfer sum by AgentID
  useEffect(() => {
    if (!agentId) return;
    const qAgg = query(collection(db, "AdminToAgentTransfer"), where("agentId", "==", agentId));
    const unsub = onSnapshot(qAgg, (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const x = (d.data() as any) || {};
        return sum + Number(x.amount || 0);
      }, 0);
      setPoints(total);
    });
    return () => unsub();
  }, [agentId]);

  // Subscribe to Customers count where ReferrerID matches AgentID
  useEffect(() => {
    if (!agentId) return;
    const qRef = query(collection(db, "Customers"), where("ReferrerID", "==", agentId));
    const unsub = onSnapshot(qRef, (snap) => {
      setCustomersCount(snap.docs.length);
    });
    return () => unsub();
  }, [agentId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.agent.header_title")}</h1>
          <p className="text-sm text-foreground/70">{t("dash.agent.header_sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{t("dash.common.live")}</Badge>
          <Button size="sm">{t("dash.common.export")}</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat icon={<Users className="h-4 w-4" />} label={t("dash.agent.stats.customers")} value={`${customersCount}`} delta="—" tone={{ bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" }} />
        <CardStat icon={<Gift className="h-4 w-4" />} label={t("dash.agent.stats.referals")} value="—" delta="—" tone={{ bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300" }} />
        <CardStat icon={<Wallet className="h-4 w-4" />} label={t("dash.agent.stats.earnings")} value={`${points} pts`} delta={points > 0 ? "+ this period" : "—"} tone={{ bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" }} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("dash.common.recent_activity")}</h2>
          <Button variant="ghost" className="text-sm">{t("dash.common.view_all")}</Button>
        </div>
        <Separator />
        <div className="p-4 text-sm text-foreground/70">No recent activity yet.</div>
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
