"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";

export default function TransferPage() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      // TODO: Wire this to backend transfer endpoint once defined
      await new Promise((r) => setTimeout(r, 600));
      toast({ title: "Transfer submitted", variant: "success" });
      setRecipient("");
      setAccount("");
      setAmount("");
      setNote("");
    } catch (e: any) {
      toast({ title: e?.message || "Transfer failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transfer</h1>
          <p className="text-sm text-foreground/70">Initiate a transfer request</p>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <form onSubmit={onSubmit} className="p-4 grid gap-4 max-w-xl">
          <div>
            <div className="text-xs text-foreground/70 mb-1">Recipient name</div>
            <input
              className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., Your bank account name"
              required
            />
          </div>
          <div>
            <div className="text-xs text-foreground/70 mb-1">Account number / ID</div>
            <input
              className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="e.g., Bank A/C or Mobile wallet number"
              required
            />
          </div>
          <div>
            <div className="text-xs text-foreground/70 mb-1">Amount</div>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500"
              required
            />
          </div>
          <div>
            <div className="text-xs text-foreground/70 mb-1">Note (optional)</div>
            <textarea
              className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Any additional information"
            />
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Submit"}</Button>
            <Button type="button" variant="secondary" onClick={() => { setRecipient(""); setAccount(""); setAmount(""); setNote(""); }}>
              Reset
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
