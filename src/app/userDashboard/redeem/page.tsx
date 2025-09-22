"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function RedeemPage() {
  const [method, setMethod] = useState("Bkash");
  const [amount, setAmount] = useState<number>(0);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(null);
  }, [method, amount, details]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      if (!amount || amount <= 0) throw new Error("Enter a valid amount of points");

      await addDoc(collection(db, "payout_requests"), {
        uid: user.uid,
        email: user.email || null,
        method,
        amountPoints: Number(amount),
        details: details || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setMessage("Request submitted. Admin will review shortly.");
      setAmount(0);
      setDetails("");
    } catch (err: any) {
      setMessage(err?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Redeem Points</h1>
        <p className="text-sm text-foreground/70">Request payout via Bkash, PayPal, or Gift Card.</p>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 md:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">Method</label>
              <select
                className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>Bkash</option>
                <option>PayPal</option>
                <option>Gift Card</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">Amount (points)</label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                placeholder="e.g., 1000"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-foreground/80">Details (number/email/code)</label>
            <input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
              placeholder="Bkash number / PayPal email / Gift card type"
            />
          </div>

          <Separator />
          {message && (
            <div className="rounded-lg border border-black/10 dark:border-white/10 bg-[var(--surface)] p-3 text-sm">
              {message}
            </div>
          )}

          <Button disabled={submitting} type="submit" className="bg-[var(--brand)] text-black hover:brightness-110">
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </section>
    </div>
  );
}
