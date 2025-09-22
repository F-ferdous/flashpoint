"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export default function ReferalsPage() {
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [refLink, setRefLink] = useState<string>("");
  const [pending, setPending] = useState<Array<{ id: string; fullName?: string; email?: string; createdAt?: any }>>([]);
  const [approved, setApproved] = useState<Array<{ id: string; name?: string; contactEmail?: string; createdAt?: any }>>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const id = user?.uid || null;
      setUid(id);
      if (!id) return;
      setRefLink(`${window.location.origin}/signup?ref=${id}`);

      // Live pending signups
      const qPending = query(
        collection(db, "pendingUsers"),
        where("referrerUid", "==", id),
        where("status", "==", "Pending")
      );
      const unsubPending = onSnapshot(qPending, (snap) => {
        setPending(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      });

      // Latest approved referrals (from users collection)
      (async () => {
        const qUsers = query(
          collection(db, "users"),
          where("referrerUid", "==", id),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const res = await getDocs(qUsers);
        setApproved(res.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      })();

      return () => {
        unsubPending();
      };
    });
    return () => unsub();
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(refLink);
      toast({ title: "Referral link copied", variant: "success" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referals</h1>
          <p className="text-sm text-foreground/70">Invite friends using your personal link. Approvals are finalized by agents.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1">Approved: <span className="font-semibold">{approved.length}</span></div>
          <div className="rounded-full border border-black/10 dark:border-white/10 px-2 py-1">Pending: <span className="font-semibold">{pending.length}</span></div>
        </div>
      </header>

      {/* Share link */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Your referral link</h2>
            <p className="text-xs text-foreground/70">Share this link. Signups via this link will show below.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              readOnly
              value={refLink}
              className="flex-1 min-w-0 sm:min-w-[520px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
            />
            <Button onClick={copyLink} size="sm">Copy</Button>
          </div>
        </div>
      </section>

      {/* Pending */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4">
          <h2 className="text-base font-semibold">Pending signups</h2>
        </div>
        {pending.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No pending signups yet.</div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10 text-sm">
            {pending.map((p) => (
              <li key={p.id} className="p-4 grid gap-1 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.fullName || "(no name)"} — {(p.email || "").toLowerCase()}</div>
                </div>
                <div className="text-xs text-foreground/60">Awaiting approval</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Approved latest */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent approvals</h2>
        </div>
        {approved.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No approvals yet.</div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10 text-sm">
            {approved.map((u) => (
              <li key={u.id} className="p-4 grid gap-1 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{u.name || "(no name)"} — {(u.contactEmail || "").toLowerCase()}</div>
                </div>
                <div className="text-xs text-foreground/60">Approved</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
