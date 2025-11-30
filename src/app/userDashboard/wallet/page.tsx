"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function WalletPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [bonusFromAgent, setBonusFromAgent] = useState<number>(0);
  const [earnedOnline, setEarnedOnline] = useState<number>(0);
  const [bonusFromAdmin, setBonusFromAdmin] = useState<number>(0);
  const [withdrawals] = useState<Array<{ id: string; amount: number; person: string; ts?: any; status: string }>>([]);

  // Track auth and customerId
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

  // Subscribe to AgentToCustomerTransfer sum for this customerId
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

  // Subscribe to CustomerEarningsFromOnline for this customerId
  useEffect(() => {
    if (!customerId) return;
    const q2 = query(collection(db, "CustomerEarningsFromOnline"), where("customerId", "==", customerId));
    const unsub2 = onSnapshot(q2, (snap) => {
      // Expect single doc; sum defensively
      const total = snap.docs.reduce((sum, d) => {
        const x = (d.data() as any) || {};
        return sum + Number(x.pointsEarned || 0);
      }, 0);
      setEarnedOnline(total);
    });
    return () => unsub2();
  }, [customerId]);

  // Subscribe to AdminToCustomerTransfer sum for this customerId
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-foreground/70">Track your earning points.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">Withdraw</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WalletCard label="Total Earnings" value={`${total} pts`} />
        <WalletCard label="Bonus from Agent" value={`${bonusFromAgent} pts`} />
        <WalletCard label="Earned Online" value={`${earnedOnline} pts`} />
        <WalletCard label="Bonus from Admin" value={`${bonusFromAdmin} pts`} />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Withdrawals</h2>
          <div className="flex gap-2">
            <Badge variant="outline">Last 30 days</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Sl</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Withdrawal Person</th>
                <th className="p-3">Date and Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {withdrawals.length > 0 ? withdrawals.map((row, idx) => (
                <tr key={row.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 text-foreground/80">{idx + 1}</td>
                  <td className="p-3">{row.amount}</td>
                  <td className="p-3">{row.person}</td>
                  <td className="p-3">{row.ts?.toDate ? row.ts.toDate().toLocaleString() : ""}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs border ${row.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : row.status === 'pending' ? 'bg-yellow-500/10 text-yellow-700 border-yellow-200' : 'bg-red-500/10 text-red-600 border-red-200'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground/60">No withdrawals yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function WalletCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
