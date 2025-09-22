"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { ExternalLink, Play, Smartphone, Gift, Target, Zap } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface EarningTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  points: number;
  icon: React.ReactNode;
  type: 'survey' | 'video' | 'app' | 'offer' | 'task';
  status: 'available' | 'loading' | 'completed';
}

export default function EarningsPage() {
  const [points, setPoints] = useState<number | null>(null);
  const [ledger, setLedger] = useState<Array<{ id: string; ts?: any; amount: number; offer_name?: string; source?: string }>>([]);
  const [tasks, setTasks] = useState<EarningTask[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userRef, (snap) => {
      const data = snap.data() as any;
      setPoints(typeof data?.points === "number" ? data.points : 0);
    });
    const ledgerRef = collection(db, "users", uid, "offerwall_ledger");
    const q = query(ledgerRef, orderBy("ts", "desc"), limit(15));
    const unsubLedger = onSnapshot(q, (snap) => {
      setLedger(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      );
    });
    
    // Initialize earning tasks
    setTasks([
      {
        id: 'cpx-surveys',
        title: 'Complete Surveys',
        description: 'Answer surveys and earn rewards based on length and complexity',
        reward: '$0.25 - $5.00',
        points: 25,
        icon: <Target className="h-5 w-5" />,
        type: 'survey',
        status: 'available'
      },
      {
        id: 'watch-ads',
        title: 'Watch Video Ads',
        description: 'Watch short video advertisements to earn points',
        reward: '$0.05 - $0.25',
        points: 5,
        icon: <Play className="h-5 w-5" />,
        type: 'video',
        status: 'available'
      },
      {
        id: 'install-apps',
        title: 'Install & Try Apps',
        description: 'Download apps and use them for a specified time',
        reward: '$0.50 - $3.00',
        points: 50,
        icon: <Smartphone className="h-5 w-5" />,
        type: 'app',
        status: 'available'
      },
      {
        id: 'special-offers',
        title: 'Special Offers',
        description: 'Sign up for services, make purchases, or try free trials',
        reward: '$1.00 - $25.00',
        points: 100,
        icon: <Gift className="h-5 w-5" />,
        type: 'offer',
        status: 'available'
      },
      {
        id: 'daily-tasks',
        title: 'Daily Tasks',
        description: 'Complete daily check-ins and bonus activities',
        reward: '$0.10 - $1.00',
        points: 10,
        icon: <Zap className="h-5 w-5" />,
        type: 'task',
        status: 'available'
      }
    ]);
    
    return () => {
      unsubUser();
      unsubLedger();
    };
  }, []);

  const handleTaskClick = async (task: EarningTask) => {
    if (loading[task.id]) return;
    
    const uid = auth.currentUser?.uid;
    if (!uid) {
      toast({ title: 'Please login to continue', variant: 'destructive' });
      return;
    }

    setLoading(prev => ({ ...prev, [task.id]: true }));

    try {
      if (task.id === 'cpx-surveys') {
        // Handle CPX Research surveys
        const response = await fetch(`/api/cpx-research/generate-url?userId=${uid}`);
        const data = await response.json();
        
        if (data.success) {
          // Open CPX Research in a new window
          window.open(data.url, '_blank', 'width=800,height=600');
          toast({ 
            title: 'Survey window opened', 
            description: 'Complete surveys in the new window to earn rewards!',
            variant: 'success' 
          });
        } else {
          toast({ 
            title: 'Configuration needed', 
            description: data.error || 'CPX Research not configured',
            variant: 'destructive' 
          });
        }
      } else {
        // For other task types, show a placeholder message
        toast({ 
          title: 'Coming Soon', 
          description: `${task.title} will be available soon!`,
          variant: 'default' 
        });
      }
    } catch (error) {
      console.error('Error handling task:', error);
      toast({ 
        title: 'Error', 
        description: 'Something went wrong. Please try again.',
        variant: 'destructive' 
      });
    } finally {
      setLoading(prev => ({ ...prev, [task.id]: false }));
    }
  };

  const calculateEarnings = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyEarnings = ledger
      .filter(entry => entry.ts?.toDate && entry.ts.toDate() >= thisMonth)
      .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    const totalEarnings = ledger.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    return {
      monthly: monthlyEarnings,
      total: totalEarnings,
      pending: 0 // You can implement pending calculation based on your needs
    };
  };

  const earnings = calculateEarnings();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Earn Rewards</h1>
          <p className="text-sm text-foreground/70">Complete tasks to earn points and cash rewards.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
            {points ?? 0} Points Available
          </Badge>
          <Button size="sm">Withdraw</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Points Balance" value={`${points ?? 0} pts`} delta="" />
        <SummaryCard label="This Month" value={`${earnings.monthly} pts`} delta="+12.5%" />
        <SummaryCard label="Pending" value={`${earnings.pending} pts`} delta="0%" />
      </section>

      {/* Earning Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Tasks</h2>
          <Badge variant="outline">{tasks.filter(t => t.status === 'available').length} Available</Badge>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              loading={loading[task.id]} 
              onClick={() => handleTaskClick(task)}
            />
          ))}
        </div>
      </section>

      {/* Earnings History */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Earnings History</h2>
          <Badge variant="outline">Recent Activity</Badge>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Source</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {ledger.length > 0 ? ledger.map((row) => (
                <tr key={row.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-3 text-foreground/80">
                    {row.ts?.toDate ? row.ts.toDate().toLocaleString() : "Recent"}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className={
                      row.source === 'cpx_research' ? 'bg-emerald-500/15 text-emerald-600 border-emerald-200' :
                      row.source?.includes('chargeback') ? 'bg-red-500/15 text-red-600 border-red-200' :
                      'bg-blue-500/15 text-blue-600 border-blue-200'
                    }>
                      {row.source === 'cpx_research' ? 'Survey' :
                       row.source?.includes('chargeback') ? 'Refund' :
                       'Offer'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${
                      row.amount >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-300'
                    }`}>
                      {row.amount >= 0 ? '+' : ''}{row.amount} pts
                    </span>
                  </td>
                  <td className="p-3 text-foreground/70">{row.offer_name || "Earning Task"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/60">
                    <div className="flex flex-col items-center gap-2">
                      <Target className="h-8 w-8 opacity-50" />
                      <p>No earnings yet. Complete your first task above!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TaskCard({ task, loading, onClick }: { task: EarningTask; loading?: boolean; onClick: () => void }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 hover:bg-[var(--surface)]/80 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600">
            {task.icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{task.title}</h3>
            <p className="text-xs text-foreground/70">{task.reward}</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            task.type === 'survey' ? 'bg-emerald-500/15 text-emerald-600' :
            task.type === 'video' ? 'bg-blue-500/15 text-blue-600' :
            task.type === 'app' ? 'bg-purple-500/15 text-purple-600' :
            task.type === 'offer' ? 'bg-orange-500/15 text-orange-600' :
            'bg-yellow-500/15 text-yellow-600'
          }`}
        >
          {task.type === 'survey' ? '📋 Survey' :
           task.type === 'video' ? '📺 Video' :
           task.type === 'app' ? '📱 App' :
           task.type === 'offer' ? '🎁 Offer' :
           '⚡ Task'}
        </Badge>
      </div>
      
      <p className="text-sm text-foreground/80 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-emerald-600">
          Up to {task.points}+ pts
        </div>
        <Button 
          size="sm" 
          onClick={onClick}
          disabled={loading || task.status === 'completed'}
          className="bg-[var(--brand)] text-black hover:brightness-110"
        >
          {loading ? (
            <>
              <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V2.5a.5.5 0 0 1 1 0V4a8 8 0 1 1-8 8z" />
              </svg>
              Loading...
            </>
          ) : task.status === 'completed' ? (
            'Completed'
          ) : (
            <>
              Start
              <ExternalLink className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </div>
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
