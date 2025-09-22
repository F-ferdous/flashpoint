"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Gift, Wallet, Globe, Stethoscope, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query, limit, where } from "firebase/firestore";
import Link from "next/link";

export default function UserHomePage() {
  const { t } = useI18n();
  const [points, setPoints] = useState<number>(0);
  const [recentEarnings, setRecentEarnings] = useState<Array<any>>([]);
  const [monthlyStats, setMonthlyStats] = useState({ earnings: 0, surveys: 0, tasks: 0 });

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // Listen to user points
    const userRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      const data = snap.data() as any;
      setPoints(typeof data?.points === "number" ? data.points : 0);
    });

    // Listen to recent earnings
    const ledgerRef = collection(db, "users", uid, "offerwall_ledger");
    const recentQuery = query(ledgerRef, orderBy("ts", "desc"), limit(5));
    const unsubLedger = onSnapshot(recentQuery, (snap) => {
      setRecentEarnings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Calculate monthly stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyQuery = query(
      ledgerRef, 
      where("ts", ">=", thisMonth),
      orderBy("ts", "desc")
    );
    const unsubMonthly = onSnapshot(monthlyQuery, (snap) => {
      const docs = snap.docs.map(d => d.data());
      const earnings = docs.reduce((sum: number, entry: any) => sum + (entry.amount || 0), 0);
      const surveys = docs.filter((entry: any) => entry.source === 'cpx_research').length;
      const tasks = docs.length;
      setMonthlyStats({ earnings, surveys, tasks });
    });

    return () => {
      unsubUser();
      unsubLedger();
      unsubMonthly();
    };
  }, []);

  const pointsToUSD = (points: number) => (points / 100).toFixed(2);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.user.header_title")}</h1>
          <p className="text-sm text-foreground/70">Track your earnings and complete tasks to earn rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
            {points} Points
          </Badge>
          <Link href="/userDashboard/earnings">
            <Button size="sm" className="bg-[var(--brand)] text-black hover:brightness-110">
              <TrendingUp className="h-4 w-4 mr-1" />
              Earn More
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat 
          icon={<Wallet className="h-4 w-4" />} 
          label={t("dash.user.nav.earnings")} 
          value={`$${pointsToUSD(points)}`} 
          delta={monthlyStats.earnings > 0 ? `+${monthlyStats.earnings} pts` : "No activity"} 
          tone={{ bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" }} 
        />
        <CardStat 
          icon={<Gift className="h-4 w-4" />} 
          label={"Surveys Completed"} 
          value={monthlyStats.surveys.toString()} 
          delta="This month" 
          tone={{ bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300" }} 
        />
        <CardStat 
          icon={<Globe className="h-4 w-4" />} 
          label={"Total Tasks"} 
          value={`${monthlyStats.tasks} tasks`} 
          delta="This month" 
          tone={{ bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" }} 
        />
        <CardStat 
          icon={<Stethoscope className="h-4 w-4" />} 
          label={t("dash.user.nav.telemedicine")} 
          value="Active" 
          delta="Available" 
          tone={{ bg: "bg-rose-500/15", text: "text-rose-600 dark:text-rose-300" }} 
        />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Earnings</h2>
          <Link href="/userDashboard/earnings">
            <Button variant="ghost" className="text-sm hover:text-[var(--brand)]">
              View All Earnings
            </Button>
          </Link>
        </div>
        <Separator />
        <ul className="divide-y divide-black/10 dark:divide-white/10">
          {recentEarnings.length > 0 ? recentEarnings.map((earning) => {
            const isPositive = earning.amount >= 0;
            const source = earning.source === 'cpx_research' ? 'CPX Research Survey' :
                          earning.source?.includes('chargeback') ? 'Survey Refund' :
                          earning.offer_name || 'Earning Task';
            
            return (
              <li key={earning.id} className="p-4 text-sm grid gap-1 sm:grid-cols-[180px_1fr]">
                <div className="text-foreground/70">
                  {earning.ts?.toDate ? earning.ts.toDate().toLocaleDateString() : 'Recent'}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {source}. Earned{' '}
                    <span className={`font-medium ${
                      isPositive ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'
                    }`}>
                      {isPositive ? '+' : ''}{earning.amount} points
                    </span>
                    {' '}(${'{'}{pointsToUSD(Math.abs(earning.amount))}{'}'})
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      earning.source === 'cpx_research' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-200' :
                      earning.source?.includes('chargeback') ? 'bg-red-500/15 text-red-600 border-red-200' :
                      'bg-blue-500/15 text-blue-600 border-blue-200'
                    }`}
                  >
                    {earning.source === 'cpx_research' ? 'Survey' :
                     earning.source?.includes('chargeback') ? 'Refund' :
                     'Task'}
                  </Badge>
                </div>
              </li>
            );
          }) : (
            <li className="p-8 text-center text-foreground/60">
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="h-8 w-8 opacity-50" />
                <p>No earnings yet</p>
                <Link href="/userDashboard/earnings">
                  <Button size="sm" className="bg-[var(--brand)] text-black hover:brightness-110">
                    Start Earning
                  </Button>
                </Link>
              </div>
            </li>
          )}
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
