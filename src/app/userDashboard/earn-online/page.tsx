"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function EarnOnlinePage() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Not signed in");
        const res = await fetch(`/api/adgate-url?uid=${encodeURIComponent(uid)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to get URL");
        if (mounted) setUrl(data.url);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load offerwall");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Earn online</h1>
          <p className="text-sm text-foreground/70">Discover online tasks to earn more.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => window.location.reload()}>Refresh</Button>
          <Button size="sm" variant="outline">How it works</Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TaskCard label="Active Tasks" value="3" trend="+1" />
        <TaskCard label="Completed" value="14" trend="+2" />
        <TaskCard label="Earnings from Tasks" value="$ 120" trend="+$12" />
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">OfferWall</h2>
          <Badge variant="outline">Secure</Badge>
        </div>
        <Separator />
        <div className="p-4">
          {loading && (
            <div className="text-sm text-foreground/70 flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Loading OfferWall...
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
              {error}
            </div>
          )}
          {url && (
            <iframe
              src={url}
              width="100%"
              height={700}
              frameBorder={0}
              className="rounded-lg bg-white"
            />
          )}
        </div>
      </section>
    </div>
  );
}

function TaskCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  const positive = trend.startsWith("+") || trend.startsWith("$");
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
      <div className="text-sm text-foreground/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>{trend} this week</div>
    </div>
  );
}
