"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

type PendingRecord = { id: string; fullName?: string; email?: string; phone?: string; nidNumber?: string; address?: string; district?: string; createdAt?: any };

export default function ReferalsPage() {
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [refLink, setRefLink] = useState<string>("");
  const [pending, setPending] = useState<Array<PendingRecord>>([]);
  const [approving, setApproving] = useState<string | null>(null);
  const [view, setView] = useState<PendingRecord | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const id = user?.uid || null;
      setUid(id);
      if (!id) return;
      // Build referral link using agentId similar to userDashboard (customerId)
      const unsubAgent = onSnapshot(doc(db, "agents", id), (snap: any) => {
        const agentId = (snap.exists() ? (snap.data() as any)?.agentId : null) as string | null;
        const shortId = agentId && agentId.length > 0 ? agentId : id;
        setRefLink(`${window.location.origin}/r/${shortId}`);
      });

      // Subscribe to pending signups for this agent
      const q = query(
        collection(db, "pendingUsers"),
        where("referrerUid", "==", id),
        where("status", "==", "Pending")
      );
      const unsubPending = onSnapshot(q, (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setPending(items);
      });
      return () => {
        unsubPending();
        unsubAgent();
      };
    });
    return () => unsub();
  }, []);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(refLink);
      toast({ title: "Referral link copied", variant: "success" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  }

  async function approvePending(p: PendingRecord) {
    if (!uid) return;
    try {
      setApproving(p.id);
      const res = await fetch("/api/referrals/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingId: p.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Approval failed");
      toast({ title: `Approved: ${data.username}`, variant: "success" });
      setView(null);
    } catch (e: any) {
      toast({ title: e?.message || "Approval failed", variant: "destructive" });
    } finally {
      setApproving(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referals</h1>
          <p className="text-sm text-foreground/70">Share your referral link. Signups require a valid referral link.</p>
        </div>
      </header>

      {/* Share link */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Your referral link</h2>
            <p className="text-xs text-foreground/70">Share this link. Signups via this link will appear below for your approval.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              readOnly
              value={refLink}
              className="flex-1 min-w-0 sm:min-w-[520px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
            />
            <Button onClick={onCopy} size="sm">Copy</Button>
          </div>
        </div>
      </section>

      {/* Pending approvals */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4">
          <h2 className="text-base font-semibold">Pending approvals</h2>
        </div>
        {pending.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">No pending signups yet.</div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10 text-sm">
            {pending.map((p) => (
              <li key={p.id} className="p-4 grid gap-2 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.fullName || "(no name)"} — {(p.email || "").toLowerCase()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setView(p)}>View</Button>
                  <Button size="sm" disabled={approving === p.id} onClick={() => approvePending(p)}>
                    {approving === p.id ? "Approving..." : "Approve"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Details Modal */}
      {view && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setView(null)} />
          <div className="relative w-full max-w-lg rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Referral details</h3>
              <button onClick={() => setView(null)} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              <div><span className="text-foreground/70">Name: </span><span className="font-medium">{view.fullName || "—"}</span></div>
              <div><span className="text-foreground/70">Email: </span><span className="font-medium">{(view.email || "").toLowerCase()}</span></div>
              <div><span className="text-foreground/70">Phone: </span><span className="font-medium">{view.phone || "—"}</span></div>
              <div><span className="text-foreground/70">District: </span><span className="font-medium">{view.district || "—"}</span></div>
              <div><span className="text-foreground/70">NID: </span><span className="font-medium">{view.nidNumber || "—"}</span></div>
              <div><span className="text-foreground/70">Address: </span><span className="font-medium">{view.address || "—"}</span></div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
              <Button disabled={approving === view.id} onClick={() => approvePending(view)}>
                {approving === view.id ? "Approving..." : "Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
