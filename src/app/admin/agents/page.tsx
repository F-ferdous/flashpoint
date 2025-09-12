"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function AgentsPage() {
  type Agent = {
    id: string;
    name: string;
    email: string;
    status: "Active" | "Pending";
    age?: number;
    nid?: string;
    trade?: string;
    address?: string;
    district?: string;
    bank?: string;
  };

  const initialAgents: Agent[] = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: String(1000 + i),
        name: `Agent #${1000 + i}`,
        email: `agent${i}@flashpoint.io`,
        status: i % 3 === 0 ? "Pending" : "Active",
        age: 25 + (i % 7),
        nid: `1989${i}00112233`,
        trade: `TL-${i}${i}${i}${i}`,
        address: `${10 + i} Example Street`,
        district: DISTRICTS[i % DISTRICTS.length],
        bank: `Acct ${i}${i}${i}${i} — Flash Bank, Main Branch`,
      })),
    []
  );

  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [view, setView] = useState<Agent | null>(null);
  const { toast } = useToast();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Create a new agent entry locally (Pending by default)
    const name = String(form.get("name") || "");
    const age = Number(form.get("age") || 0);
    const nid = String(form.get("nid") || "");
    const trade = String(form.get("trade") || "");
    const address = String(form.get("address") || "");
    const district = String(form.get("district") || "");
    const bank = String(form.get("bank") || "");
    const id = String(Date.now());
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@flashpoint.io`;

    setAgents((prev) => [
      { id, name, email, status: "Pending", age, nid, trade, address, district, bank },
      ...prev,
    ]);

    setOpen(false);
    toast({ title: "Agent saved", variant: "success" });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-foreground/70">Manage agent accounts and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setOpen(true)}>Add Agent</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">All Agents</h2>
          <div className="flex gap-2">
            <Badge variant="outline">128 total</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Agent</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {agents.map((ag) => (
                <tr key={ag.id}>
                  <td className="p-3 font-medium">{ag.name}</td>
                  <td className="p-3">{ag.email}</td>
                  <td className="p-3">
                    <Badge variant={ag.status === "Pending" ? "warning" : "success"}>{ag.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" className="transition-transform hover:translate-x-0.5" onClick={() => setView(ag)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Agent Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-agent-title"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="add-agent-title" className="text-xl font-bold tracking-tight">Add Agent</h3>
                <p className="text-sm text-foreground/70">Provide agent details to create a new account.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <form onSubmit={onSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input id="name" name="name" required placeholder="Full name" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input id="age" name="age" type="number" min={18} max={100} required placeholder="e.g. 28" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number</Label>
                  <input id="nid" name="nid" required placeholder="National ID number" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="trade">Trade Licence Number</Label>
                  <input id="trade" name="trade" required placeholder="Trade licence number" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input id="address" name="address" required placeholder="Street, area" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select id="district" name="district" required className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]">
                    <option value="" disabled>Select district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Photo of NID</Label>
                  <input id="nidPhoto" name="nidPhoto" type="file" accept="image/*" required className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tradePhoto">Photo of Trade Licence</Label>
                  <input id="tradePhoto" name="tradePhoto" type="file" accept="image/*" required className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea id="bank" name="bank" rows={3} required placeholder="Account name, number, bank, branch" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save Agent</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {view && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-agent-title"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setView(null)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="view-agent-title" className="text-xl font-bold tracking-tight">{view.name}</h3>
                <p className="text-sm text-foreground/70">{view.email}</p>
              </div>
              <button
                onClick={() => setView(null)}
                aria-label="Close"
                className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <div className="p-4 md:p-5 grid gap-3 text-sm">
              <Row label="Status" value={<Badge variant={view.status === "Pending" ? "warning" : "success"}>{view.status}</Badge>} />
              <Row label="Age" value={view.age ?? "—"} />
              <Row label="NID" value={view.nid ?? "—"} />
              <Row label="Trade Licence" value={view.trade ?? "—"} />
              <Row label="Address" value={view.address ?? "—"} />
              <Row label="District" value={view.district ?? "—"} />
              <Row label="Bank" value={view.bank ?? "—"} />
            </div>
            <div className="px-4 md:px-5 pb-4 md:pb-5 flex items-center justify-end gap-2">
              {view.status === "Pending" && (
                <Button
                  onClick={() => {
                    setAgents((prev) => prev.map((a) => (a.id === view.id ? { ...a, status: "Active" } : a)));
                    setView((v) => (v ? { ...v, status: "Active" } : v));
                    toast({ title: "Agent approved", variant: "success" });
                  }}
                >
                  Approve
                </Button>
              )}
              <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2">
      <div className="text-foreground/70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
