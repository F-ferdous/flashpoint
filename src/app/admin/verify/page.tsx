"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { db, app } from "@/lib/firebase";
import districtsData from "@/lib/districts.json";
import {
  collection,
  onSnapshot,
  query,
  doc,
  runTransaction,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getApps, initializeApp, getApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

type PendingItem = {
  id: string;
  fullName?: string | null;
  email?: string | null;
  district?: string | null;
  username?: string | null;
  phone?: string | null;
  address?: string | null;
  nidNumber?: string | null;
  ReferralID?: string | null;
};

export default function VerifyPage() {
  const [pendingAgents, setPendingAgents] = useState<PendingItem[]>([]);
  const [pendingCustomers, setPendingCustomers] = useState<PendingItem[]>([]);
  const [view, setView] = useState<{
    type: "agent" | "customer";
    item: PendingItem;
  } | null>(null);
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Live subscribe to PendingUsers (customers) and PendingAgents if needed later
    const unsubCust = onSnapshot(
      query(collection(db, "PendingUsers")),
      (snap) => {
        setPendingCustomers(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        );
      }
    );
    const unsubAgents = onSnapshot(
      query(collection(db, "pendingAgents")),
      (snap) => {
        setPendingAgents(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        );
      }
    );
    return () => {
      unsubCust();
      unsubAgents();
    };
  }, []);

  // Reset password visibility whenever the modal opens/closes or switches between agent/customer
  useEffect(() => {
    setShowPassword(false);
  }, [view]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Verify
          </h1>
          <p className="text-sm text-foreground/70">
            Process and review pending registrations.
          </p>
        </div>
      </header>

      {/* Pending Agents */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pending Agents</h2>
          <div className="flex gap-2">
            <Badge variant="warning">{pendingAgents.length} awaiting</Badge>
          </div>
        </div>
        <Separator />
        {pendingAgents.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">
            No pending agents.
          </div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {pendingAgents.map((u) => (
              <li
                key={u.id}
                className="p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="font-medium">{u.fullName || "Unnamed"}</div>
                  <div className="text-sm text-foreground/70">
                    {u.email || "—"}
                    {u.district ? ` • ${u.district}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setView({ type: "agent", item: u })}
                  >
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending Customers */}
      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Pending Customers</h2>
          <div className="flex gap-2">
            <Badge variant="warning">{pendingCustomers.length} awaiting</Badge>
          </div>
        </div>
        <Separator />
        {pendingCustomers.length === 0 ? (
          <div className="p-4 text-sm text-foreground/70">
            No pending customers.
          </div>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10">
            {pendingCustomers.map((u) => (
              <li
                key={u.id}
                className="p-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="font-medium">{u.fullName || "Unnamed"}</div>
                  <div className="text-sm text-foreground/70">
                    {u.email || "—"}
                    {u.district ? ` • ${u.district}` : ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setView({ type: "customer", item: u })}
                  >
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Unified View/Approve modal */}
      {view && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setView(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="approve-title"
                  className="text-xl font-bold tracking-tight"
                >
                  {view.type === "customer"
                    ? "Approve Customer"
                    : "Approve Agent"}
                </h3>
                <p className="text-sm text-foreground/70">
                  Create username and password to activate.
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
              <div className="font-medium">
                {view.item.fullName || "Unnamed"}
              </div>
              <div className="text-foreground/70">
                District: {view.item.district || "—"}
              </div>
              <div className="text-foreground/70">
                Login email (username):{" "}
                {view.item.username || view.item.email || "—"}
              </div>
              {view.item.phone && (
                <div className="text-foreground/70">
                  Phone: {view.item.phone}
                </div>
              )}
              {view.item.address && (
                <div className="text-foreground/70">
                  Address: {view.item.address}
                </div>
              )}
              {view.item.nidNumber && (
                <div className="text-foreground/70">
                  NID: {view.item.nidNumber}
                </div>
              )}
              {(() => {
                const rid =
                  (view.item as any)?.ReferrerID ||
                  (view.item as any)?.referrerUid ||
                  (view.item as any)?.ReferralID;
                return rid ? (
                  <div className="text-foreground/70">Referrer ID: {rid}</div>
                ) : null;
              })()}
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

                  if (view.type === "customer") {
                    const pending = view.item as any;
                    const email = String(
                      pending.email || pending.username || ""
                    ).trim();
                    const fullName = String(pending.fullName || "").trim();

                    // Create or fetch user using a secondary Firebase app so admin session stays intact
                    const secondary =
                      getApps().find((a) => a.name === "secondary") ||
                      initializeApp(app.options as any, "secondary");
                    const secAuth = getAuth(secondary);
                    let uid: string | null = null;
                    try {
                      const userCred = await createUserWithEmailAndPassword(
                        secAuth,
                        email,
                        password
                      );
                      uid = userCred.user.uid;
                    } catch (e: any) {
                      const code = e?.code || "";
                      // If account likely exists or quota throttled, attempt sign-in to retrieve uid
                      if (
                        code === "auth/email-already-in-use" ||
                        code === "auth/quota-exceeded" ||
                        /quota|exceed/i.test(String(e?.message || ""))
                      ) {
                        // brief backoff for quota
                        if (code === "auth/quota-exceeded") {
                          await new Promise((r) => setTimeout(r, 1500));
                        }
                        const cred = await signInWithEmailAndPassword(
                          secAuth,
                          email,
                          password
                        );
                        uid = cred.user.uid;
                      } else {
                        throw e;
                      }
                    }
                    if (!uid)
                      throw new Error("Unable to get user id for approval");

                    // Prepare global counter ref for CustomerID
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

                    // Create Customers doc with Approved true and include password and CustomerID
                    const referrerId = String(
                      pending?.ReferrerID ||
                        pending?.referrerUid ||
                        pending?.ReferralID ||
                        ""
                    ).trim();
                    const customerDoc = {
                      ...pending,
                      uid,
                      Approved: true,
                      Role: "Customer",
                      password,
                      CustomerID: customerId,
                      // Preserve who referred this customer
                      ReferrerID: referrerId,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    };
                    await setDoc(
                      doc(collection(db, "Customers"), uid),
                      customerDoc,
                      { merge: true }
                    );

                    // Remove from PendingUsers
                    await deleteDoc(
                      doc(collection(db, "PendingUsers"), pending.id)
                    );

                    // Sign out secondary auth to clean up
                    await signOut(secAuth).catch(() => {});
                    if (secondary.name === "secondary") {
                      // optional clean-up; ignore any errors
                      deleteApp(secondary as any).catch(() => {});
                    }

                    toast({ title: "Customer approved", variant: "success" });
                    setView(null);
                  } else {
                    toast({
                      title: "Agent approval via UI is not implemented yet",
                      variant: "warning",
                    });
                  }
                } catch (err: any) {
                  toast({
                    title:
                      err?.message || `Failed to approve ${view?.type || ""}`,
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
                  value={view.item.username || view.item.email || ""}
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
              {view.type === "customer" && (
                <label className="mt-1 inline-flex items-center gap-2 text-sm text-foreground/80">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    disabled={approving}
                  />
                  Show password
                </label>
              )}
              <div className="mt-2 flex items-center justify-end gap-2">
                {view.type === "customer" && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={async () => {
                      try {
                        if (!view) return;
                        const ok = window.confirm(
                          "Delete this pending customer? This cannot be undone."
                        );
                        if (!ok) return;
                        setDeleting(true);
                        await deleteDoc(
                          doc(collection(db, "PendingUsers"), view.item.id)
                        );
                        setPendingCustomers((prev) =>
                          prev.filter((p) => p.id !== view.item.id)
                        );
                        toast({
                          title: "Pending customer deleted",
                          variant: "success",
                        });
                        setView(null);
                      } catch (err: any) {
                        toast({
                          title:
                            err?.message || "Failed to delete pending customer",
                          variant: "destructive",
                        });
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={approving || deleting}
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </Button>
                )}
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
