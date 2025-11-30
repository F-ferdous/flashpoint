"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function UserHomePage() {
  const { t } = useI18n();
  const [uid, setUid] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [bonusFromAgent, setBonusFromAgent] = useState<number>(0);
  const [earnedOnline, setEarnedOnline] = useState<number>(0);
  const [bonusFromAdmin, setBonusFromAdmin] = useState<number>(0);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
      setCustomerId(null);
      setBonusFromAgent(0);
      setEarnedOnline(0);
      setBonusFromAdmin(0);
      if (user) {
        onSnapshot(doc(db, "Customers", user.uid), (snap) => {
          const x = (snap.data() as any) || {};
          const cid = String(x.CustomerID || x.customerId || x.CustomerId || "").trim() || null;
          setCustomerId(cid);
        });
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!customerId) return;
    const q1 = query(collection(db, "AgentToCustomerTransfer"), where("customerId", "==", customerId));
    const unsub1 = onSnapshot(q1, (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const x = (d.data() as any) || {};
        return sum + Number(x.amount || 0);
      }, 0);
      setBonusFromAgent(total);
    });
    return () => unsub1();
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;
    const q2 = query(collection(db, "CustomerEarningsFromOnline"), where("customerId", "==", customerId));
    const unsub2 = onSnapshot(q2, (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const x = (d.data() as any) || {};
        return sum + Number(x.pointsEarned || 0);
      }, 0);
      setEarnedOnline(total);
    });
    return () => unsub2();
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;
    const q3 = query(collection(db, "AdminToCustomerTransfer"), where("customerId", "==", customerId));
    const unsub3 = onSnapshot(q3, (snap) => {
      const total = snap.docs.reduce((sum, d) => {
        const x = (d.data() as any) || {};
        return sum + Number(x.amount || 0);
      }, 0);
      setBonusFromAdmin(total);
    });
    return () => unsub3();
  }, [customerId]);

  const total = useMemo(() => bonusFromAgent + earnedOnline + bonusFromAdmin, [bonusFromAgent, earnedOnline, bonusFromAdmin]);

  const pointsToUSD = (points: number) => (points / 100).toFixed(2);

  const recentEarnings: any[] = [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("dash.user.header_title")}</h1>
          <p className="text-sm text-foreground/70">Track your earnings and complete tasks to earn rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
            {total} Points
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
        <SummaryCard label="Total Earnings" value={`${total} pts`} delta={"—"} />
        <SummaryCard label="Bonus from Agent" value={`${bonusFromAgent} pts`} delta={"—"} />
        <SummaryCard label="Earned Online" value={`${earnedOnline} pts`} delta={"—"} />
        <SummaryCard label="Bonus from Admin" value={`${bonusFromAdmin} pts`} delta={"—"} />
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
            const source = earning.source === 'adsterra' ? 'Offer' :
                          earning.source?.includes('chargeback') ? 'Offer Refund' :
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
                    
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      earning.source === 'adsterra' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-200' :
                      earning.source?.includes('chargeback') ? 'bg-red-500/15 text-red-600 border-red-200' :
                      'bg-blue-500/15 text-blue-600 border-blue-200'
                    }`}
                  >
                    {earning.source === 'adsterra' ? 'Offer' :
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

function SummaryCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  const positive = delta.startsWith("+");
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{delta}</div>
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
