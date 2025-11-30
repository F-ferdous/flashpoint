"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db, app } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  runTransaction,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getApps, initializeApp, deleteApp } from "firebase/app";

type PendingRecord = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  nidNumber?: string;
  address?: string;
  district?: string;
  createdAt?: any;
};

export default function ReferalsPage() {
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [refLink, setRefLink] = useState<string>("");
  const [pending, setPending] = useState<PendingRecord[]>([]);
  const [view, setView] = useState<PendingRecord | null>(null);
  const [approving, setApproving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const id = user?.uid || null;
      setUid(id);
      if (!id) return;
      // Fetch AgentID once; fall back to uid if missing
      try {
        const aSnap = await getDoc(doc(db, "Agents", id));
        const aid = (aSnap.exists() ? (aSnap.data() as any)?.AgentID : null) as
          | string
          | null;
        setAgentId(aid || null);
        const linkId = aid && aid.length > 0 ? aid : id;
        setRefLink(
          `${window.location.origin}/signup?ref=agent_${encodeURIComponent(
            linkId
          )}`
        );
      } catch {
        setRefLink(
          `${window.location.origin}/signup?ref=agent_${encodeURIComponent(id)}`
        );
      }
      // Subscribe to pending signups via this agent's referral
      const qPend = query(
        collection(db, "PendingUsers"),
        where("referrerUid", "==", id)
      );
      const unsubPending = onSnapshot(qPend, (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setPending(rows as any);
      });

      return () => {
        unsubPending();
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Referals
          </h1>
          <p className="text-sm text-foreground/70">
            Share your referral link. Signups require a valid referral link.
          </p>
        </div>
      </header>

      {/* Share link */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Your referral link</h2>
            <p className="text-xs text-foreground/70">
              Share this link. Signups via this link will appear below for your
              approval.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              readOnly
              value={refLink}
              className="flex-1 min-w-0 sm:min-w-[520px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
            />
            <Button onClick={onCopy} size="sm">
              Copy
            </Button>
          </div>
        </div>
      </section>

      {/* Pending signups via your referral */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Pending customers via your referral
          </h2>
          <div className="text-sm text-foreground/70">
            {pending.length} total
          </div>
        </div>
        {pending.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">
            No pending customers yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-foreground/70">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">District</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-medium">{p.fullName || "—"}</td>
                    <td className="p-3">{(p.email || "").toLowerCase()}</td>
                    <td className="p-3">{p.phone || "—"}</td>
                    <td className="p-3">{p.district || "—"}</td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setView(p)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {view && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pending-view-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setView(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="pending-view-title"
                  className="text-xl font-bold tracking-tight"
                >
                  Pending Customer
                </h3>
                <p className="text-sm text-foreground/70">
                  Submitted via your referral link.
                </p>
              </div>
              <button
                onClick={() => setView(null)}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Separator />
            <div className="px-4 pt-4 text-sm grid gap-2">
              <div className="font-medium">{view.fullName || "Unnamed"}</div>
              <div className="text-foreground/70">
                District: {view.district || "—"}
              </div>
              <div className="text-foreground/70">
                Login email (username): {view.email || "—"}
              </div>
              {view.phone && (
                <div className="text-foreground/70">Phone: {view.phone}</div>
              )}
              {view.address && (
                <div className="text-foreground/70">
                  Address: {view.address}
                </div>
              )}
              {view.nidNumber && (
                <div className="text-foreground/70">NID: {view.nidNumber}</div>
              )}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const password = String(fd.get("password") || "");
                try {
                  setApproving(true);
                  if (!password || password.length < 6) {
                    throw new Error("Password must be at least 6 characters");
                  }

                  const pending = view as any;
                  const email = String(
                    pending.email || pending.username || ""
                  ).trim();
                  const fullName = String(pending.fullName || "").trim();
                  const districtName = String(pending.district || "").trim();
                  if (!email || !fullName || !districtName) {
                    throw new Error("Pending record missing required fields");
                  }

                  // Create user with secondary app to keep agent session
                  const secondary =
                    getApps().find((a) => a.name === "secondary") ||
                    initializeApp(app.options as any, "secondary");
                  const secAuth = getAuth(secondary as any);
                  const userCred = await createUserWithEmailAndPassword(
                    secAuth,
                    email,
                    password
                  );
                  const newUid = userCred.user.uid;

                  // Generate CustomerID serial
                  const counterRef = doc(
                    collection(db, "counters"),
                    "customer_serial"
                  );
                  const customerId = await runTransaction(db, async (tx) => {
                    const snap = await tx.get(counterRef);
                    const current =
                      (snap.exists() ? (snap.data() as any)?.seq : 0) || 0;
                    const next = current + 1;
                    tx.set(
                      counterRef,
                      { seq: next, type: "customer", updatedAt: Date.now() },
                      { merge: true }
                    );
                    return `C${String(next).padStart(6, "0")}`;
                  });

                  // Create Customers doc
                  const customerDoc = {
                    ...pending,
                    uid: newUid,
                    Approved: true,
                    Role: "Customer",
                    password,
                    CustomerID: customerId,
                    ReferrerID: pending.referrerUid || uid,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  };
                  await setDoc(
                    doc(collection(db, "Customers"), newUid),
                    customerDoc,
                    { merge: true }
                  );

                  // Remove from PendingUsers
                  await deleteDoc(
                    doc(collection(db, "PendingUsers"), pending.id)
                  );

                  // Cleanup secondary auth
                  await signOut(secAuth).catch(() => {});
                  if ((secondary as any).name === "secondary") {
                    deleteApp(secondary as any).catch(() => {});
                  }

                  toast({ title: "Customer approved", variant: "success" });
                  setView(null);
                } catch (err: any) {
                  toast({
                    title: err?.message || "Failed to approve customer",
                    variant: "destructive",
                  });
                } finally {
                  setApproving(false);
                }
              }}
              className="p-4 md:p-5 grid gap-3"
            >
              <div className="grid gap-1.5">
                <Label>Login email (from signup)</Label>
                <input
                  value={view.email || ""}
                  readOnly
                  className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Temporary password"
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  disabled={approving}
                />
              </div>
              <label className="mt-1 inline-flex items-center gap-2 text-sm text-foreground/80">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  disabled={approving}
                />
                Show password
              </label>
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setView(null)}
                  disabled={approving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={approving}>
                  {approving ? "Approving…" : "Approve"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
