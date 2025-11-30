"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Earnings page now only shows statistics

export default function EarningsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [bonusFromAgent, setBonusFromAgent] = useState<number>(0);
  const [earnedOnline, setEarnedOnline] = useState<number>(0);
  const [bonusFromAdmin, setBonusFromAdmin] = useState<number>(0);

  // Track auth and resolve CustomerID
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

  // Bonus from Agent
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

  // Earned Online
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

  // Bonus from Admin
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Earn Rewards</h1>
          <p className="text-sm text-foreground/70">Complete tasks to earn points and cash rewards.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
            {total} Points Available
          </Badge>
          <Button size="sm">Withdraw</Button>
        </div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Earnings" value={`${total} pts`} delta="" />
        <SummaryCard label="Bonus from Agent" value={`${bonusFromAgent} pts`} delta="" />
        <SummaryCard label="Earned Online" value={`${earnedOnline} pts`} delta="" />
        <SummaryCard label="Bonus from Admin" value={`${bonusFromAdmin} pts`} delta="" />
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
      {delta && <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{delta} vs last</div>}
    </div>
  );
}

