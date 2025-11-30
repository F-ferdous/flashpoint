"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { useToast } from "@/components/ui/toast";
import { ExternalLink, Play, Smartphone, Gift, Target, Zap } from "lucide-react";

interface EarningTask {
  id: string;
  title: string;
  description: string;
  reward: string;
  points: number;
  icon: React.ReactNode;
  type: "survey" | "video" | "app" | "offer" | "task";
  status: "available" | "loading" | "completed";
  url?: string;
  category?: string;
  server?: "server1" | "server2";
}

export default function AdminEarnOnlinePage() {
  const [tasksServer1, setTasksServer1] = useState<EarningTask[]>([]);
  const [tasksServer2, setTasksServer2] = useState<EarningTask[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [offersLoading, setOffersLoading] = useState(true);
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const pageSize = 10;
  // Bangladesh local date key (YYYY-MM-DD) in Asia/Dhaka time
  const todayStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka' }).format(new Date());
    } catch {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${da}`;
    }
  }, []);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [refreshUsed, setRefreshUsed] = useState<boolean>(false);
  const { toast } = useToast();
  const SMARTLINK =
    "https://otieu.com/4/10161633"; // Monetag DirectLink (Server 1)
  const SMARTLINK_RICHADS =
    "https://11745.xml.4armn.com/direct-link?pubid=992465&siteid=992465"; // RichAds DirectLink (Server 2)

  const buildMonetagTasks = (): EarningTask[] => {
    const base: EarningTask[] = [
      {
        id: "monetag-survey",
        title: "Consumer Survey",
        description: "Share your opinions on products and services",
        reward: "$0.50 - $2.00",
        points: 50,
        icon: <Target className="h-5 w-5" />,
        type: "survey",
        status: "available",
        url: SMARTLINK,
        category: "survey",
        server: "server1",
      },
      {
        id: "monetag-video",
        title: "Video Rewards",
        description: "Watch engaging video content and earn",
        reward: "$0.10 - $0.75",
        points: 25,
        icon: <Play className="h-5 w-5" />,
        type: "video",
        status: "available",
        url: SMARTLINK,
        category: "video",
        server: "server1",
      },
      {
        id: "monetag-apps",
        title: "Mobile Games",
        description: "Try new mobile games and reach certain levels",
        reward: "$1.00 - $5.00",
        points: 100,
        icon: <Smartphone className="h-5 w-5" />,
        type: "app",
        status: "available",
        url: SMARTLINK,
        category: "app",
        server: "server1",
      },
      {
        id: "monetag-offers",
        title: "Special Promotions",
        description: "Sign up for exclusive deals and limited-time offers",
        reward: "$2.00 - $15.00",
        points: 200,
        icon: <Gift className="h-5 w-5" />,
        type: "offer",
        status: "available",
        url: SMARTLINK,
        category: "offer",
        server: "server1",
      },
      {
        id: "monetag-daily",
        title: "Daily Challenges",
        description: "Complete quick daily tasks and bonus activities",
        reward: "$0.25 - $1.50",
        points: 30,
        icon: <Zap className="h-5 w-5" />,
        type: "task",
        status: "available",
        url: SMARTLINK,
        category: "task",
        server: "server1",
      },
      {
        id: "monetag-research",
        title: "Market Research",
        description: "Participate in market research studies",
        reward: "$1.00 - $8.00",
        points: 150,
        icon: <Target className="h-5 w-5" />,
        type: "survey",
        status: "available",
        url: SMARTLINK,
        category: "survey",
        server: "server1",
      },
      {
        id: "monetag-ads",
        title: "Ad Rewards Plus",
        description: "Watch premium video advertisements",
        reward: "$0.15 - $1.00",
        points: 35,
        icon: <Play className="h-5 w-5" />,
        type: "video",
        status: "available",
        url: SMARTLINK,
        category: "video",
        server: "server1",
      },
      {
        id: "monetag-productivity",
        title: "Productivity Apps",
        description: "Install and use productivity applications",
        reward: "$0.75 - $3.50",
        points: 80,
        icon: <Smartphone className="h-5 w-5" />,
        type: "app",
        status: "available",
        url: SMARTLINK,
        category: "app",
        server: "server1",
      },
    ];
    const kinds: Array<Pick<EarningTask, 'type' | 'category' | 'icon'>> = [
      { type: 'survey', category: 'survey', icon: <Target className="h-5 w-5" /> },
      { type: 'video', category: 'video', icon: <Play className="h-5 w-5" /> },
      { type: 'app', category: 'app', icon: <Smartphone className="h-5 w-5" /> },
      { type: 'offer', category: 'offer', icon: <Gift className="h-5 w-5" /> },
      { type: 'task', category: 'task', icon: <Zap className="h-5 w-5" /> },
    ];
    let i = 0;
    while (base.length < 20) {
      const k = kinds[i % kinds.length];
      base.push({
        id: `monetag-auto-${i}`,
        title: `Offer ${i + 1}`,
        description: "Complete this activity to earn points",
        reward: "$0.10 - $5.00",
        points: 25,
        icon: k.icon,
        type: k.type as any,
        status: "available",
        url: SMARTLINK,
        category: k.category as any,
        server: "server1",
      });
      i++;
    }
    return base;
  };

  const buildRichadsTasks = (): EarningTask[] => {
    const kinds: Array<Pick<EarningTask, 'type' | 'category' | 'icon'>> = [
      { type: 'survey', category: 'survey', icon: <Target className="h-5 w-5" /> },
      { type: 'video', category: 'video', icon: <Play className="h-5 w-5" /> },
      { type: 'app', category: 'app', icon: <Smartphone className="h-5 w-5" /> },
      { type: 'offer', category: 'offer', icon: <Gift className="h-5 w-5" /> },
      { type: 'task', category: 'task', icon: <Zap className="h-5 w-5" /> },
    ];
    const base: EarningTask[] = [];
    for (let i = 0; i < 20; i++) {
      const k = kinds[i % kinds.length];
      base.push({
        id: `richads-auto-${i}`,
        title: `Offer ${i + 1}`,
        description: "Complete this activity to earn points",
        reward: "$0.10 - $5.00",
        points: 25,
        icon: k.icon,
        type: k.type as any,
        status: "available",
        url: SMARTLINK_RICHADS,
        category: k.category as any,
        server: "server2",
      });
    }
    return base;
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // Load daily state from localStorage
    try {
      const cKey = `eo_completed_${uid}_${todayStr}`;
      const rKey = `eo_refresh_${uid}_${todayStr}`;
      const arr = JSON.parse(localStorage.getItem(cKey) || '[]');
      const completedSet = Array.isArray(arr) ? new Set<string>(arr) : new Set<string>();
      setCompletedToday(completedSet);
      setRefreshUsed(localStorage.getItem(rKey) === '1');
    } catch {}

    const fetchLocalOffers = async () => {
      try {
        setOffersLoading(true);
        // Use Monetag (Server 1) and RichAds (Server 2) directlink fallback tasks
        const s1 = buildMonetagTasks();
        const s2 = buildRichadsTasks();
        const cKey = `eo_completed_${uid}_${todayStr}`;
        const arr = JSON.parse(localStorage.getItem(cKey) || '[]');
        const completedSet = Array.isArray(arr) ? new Set<string>(arr) : new Set<string>();
        const filtered1 = s1.filter((t) => !completedSet.has(t.id));
        const filtered2 = s2.filter((t) => !completedSet.has(t.id));
        setTasksServer1(filtered1);
        setTasksServer2(filtered2);
        setPage1(1);
        setPage2(1);
      } catch (error) {
        console.error("Error loading local offers:", error);
      } finally {
        setOffersLoading(false);
      }
    };

    fetchLocalOffers();
  }, [toast, todayStr]);

  const awardOnceForOffer = async (
    uid: string,
    task: EarningTask
  ): Promise<boolean> => {
    try {
      const customerRef = doc(db, "Customers", uid);
      const earnRef = doc(db, "CustomerEarningsFromOnline", uid);

      // Award 5 points per completion; rely on localStorage to prevent repeat in same day
      await runTransaction(db, async (tx) => {
        // READS FIRST
        const cSnap = await tx.get(customerRef as any);
        const eSnap = await tx.get(earnRef as any);

        const cx: any = cSnap.exists() ? cSnap.data() : {};
        const customerId = String(cx.CustomerID || cx.customerId || cx.CustomerId || "");
        const prevPoints = Number(((eSnap.exists() ? (eSnap.data() as any)?.pointsEarned : 0)) || 0);
        const nextPoints = prevPoints + 5;

        // WRITES AFTER
        tx.set(
          earnRef,
          {
            customerId,
            customerDocId: uid,
            pointsEarned: nextPoints,
            lastAddedPointTime: Date.now(),
          },
          { merge: true } as any
        );
      });
      return true;
    } catch (e) {
      console.error("Error awarding points:", e);
      return false;
    }
  };

  const totalPages1 = useMemo(() => Math.max(1, Math.ceil(tasksServer1.length / pageSize)), [tasksServer1.length]);
  const totalPages2 = useMemo(() => Math.max(1, Math.ceil(tasksServer2.length / pageSize)), [tasksServer2.length]);
  const visibleTasks1 = useMemo(() => {
    const start = (page1 - 1) * pageSize;
    return tasksServer1.slice(start, start + pageSize);
  }, [tasksServer1, page1]);
  const visibleTasks2 = useMemo(() => {
    const start = (page2 - 1) * pageSize;
    return tasksServer2.slice(start, start + pageSize);
  }, [tasksServer2, page2]);

  const handleTaskClick = async (task: EarningTask) => {
    if (loading[task.id]) return;

    const uid = auth.currentUser?.uid;
    if (!uid) {
      toast({ title: "Please login to continue", variant: "destructive" });
      return;
    }

    setLoading((prev) => ({ ...prev, [task.id]: true }));

    try {
      if (task.url) {
        window.open(task.url, "_blank", "width=900,height=700");
        toast({
          title: "Offer opened",
          description: `Earning will be added shortly…`,
          variant: "success",
        });
        await new Promise((r) => setTimeout(r, 3500));
        const awarded = await awardOnceForOffer(uid, task);
        if (awarded) {
          // Remove the clicked task from UI
          if (task.server === "server2") {
            setTasksServer2((prev) => prev.filter((t) => t.id !== task.id));
          } else {
            setTasksServer1((prev) => prev.filter((t) => t.id !== task.id));
          }
          // Persist completion for the day (using Bangladesh date and custom ID)
          try {
            const cKey = `eo_completed_${uid}_${todayStr}`;
            const next = new Set(completedToday);
            next.add(task.id);
            setCompletedToday(next);
            localStorage.setItem(cKey, JSON.stringify(Array.from(next)));
          } catch {}
          toast({
            title: "+5 points added",
            description: `Rewarded for ${task.title}`,
          });
        }
      } else {
        toast({
          title: "Unavailable",
          description: `${task.title} is not available.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error handling task:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Earn online (Admin Test)
          </h1>
          <p className="text-sm text-foreground/70">
            Discover online tasks to earn more. This page exists for admin testing only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" disabled={refreshUsed} onClick={() => {
            if (refreshUsed) return;
            const uidNow = auth.currentUser?.uid;
            if (uidNow) {
              try {
                const rKey = `eo_refresh_${uidNow}_${todayStr}`;
                localStorage.setItem(rKey, '1');
              } catch {}
            }
            setRefreshUsed(true);
            window.location.reload();
          }}>
            Refresh
          </Button>
        </div>
      </header>
      <section className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Server 1 — Monetag DirectLink</h2>
            <Badge variant="outline" className="flex items-center">
              {offersLoading
                ? "Loading..."
                : `${tasksServer1.filter((t) => t.status === "available").length} Available`}
            </Badge>
          </div>
          {offersLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 w-9 h-9"></div>
                      <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1 w-24"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-full"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTasks1.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  loading={loading[task.id]}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
              {tasksServer1.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 opacity-50" />
                    <p className="text-foreground/60">No offers available at the moment.</p>
                    <p className="text-sm text-foreground/40">Please check back later.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {!offersLoading && tasksServer1.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" disabled={page1 <= 1} onClick={() => setPage1((p) => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm text-foreground/70">Page {page1} of {totalPages1}</span>
              <Button size="sm" variant="outline" disabled={page1 >= totalPages1} onClick={() => setPage1((p) => Math.min(totalPages1, p + 1))}>Next</Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Server 2 — RichAds DirectLink</h2>
            <Badge variant="outline" className="flex items-center">
              {offersLoading
                ? "Loading..."
                : `${tasksServer2.filter((t) => t.status === "available").length} Available`}
            </Badge>
          </div>
          {offersLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 w-9 h-9"></div>
                      <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-1 w-24"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-full"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTasks2.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  loading={loading[task.id]}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
              {tasksServer2.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8 opacity-50" />
                    <p className="text-foreground/60">No offers available at the moment.</p>
                    <p className="text-sm text-foreground/40">Please check back later.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {!offersLoading && tasksServer2.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" disabled={page2 <= 1} onClick={() => setPage2((p) => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm text-foreground/70">Page {page2} of {totalPages2}</span>
              <Button size="sm" variant="outline" disabled={page2 >= totalPages2} onClick={() => setPage2((p) => Math.min(totalPages2, p + 1))}>Next</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TaskCard({
  task,
  loading,
  onClick,
}: {
  task: EarningTask;
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10">
            {task.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium leading-none">{task.title}</h3>
              <Badge variant="secondary" className="text-xs">{task.category}</Badge>
            </div>
            <p className="text-sm text-foreground/70">{task.description}</p>
          </div>
        </div>
        <div className="text-sm font-medium">{task.reward}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-foreground/60">+{task.points} pts</div>
        <Button size="sm" className="gap-1" disabled={!!loading} onClick={onClick}>
          View <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
