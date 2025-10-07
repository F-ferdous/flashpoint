"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { db, storage } from "@/lib/firebase";
import districtsData from "@/lib/districts.json";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type Customer = {
  id: string;
  customerId?: string | null;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  age?: number | null;
  nid?: string | null;
  address?: string | null;
  district?: string | null;
  bank?: string | null;
  nidPhotoUrl?: string | null;
  password?: string | null;
  status?: "Active" | "Blocked" | "Frozen";
  statusReason?: string | null;
};

const DISTRICTS: string[] = ((districtsData as any).districts || []).map((d: { name: string }) => d.name);

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Customer | null>(null);
  const [savingView, setSavingView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(
        snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            customerId: x.customerId ?? null,
            name: x.name ?? null,
            email: x.email ?? null,
            username: x.username ?? null,
            age: x.age ?? null,
            nid: x.nid ?? null,
            address: x.address ?? null,
            district: x.district ?? null,
            bank: x.bank ?? null,
            nidPhotoUrl: x.nidPhotoUrl ?? null,
            password: x.password ?? null,
            status: (x.status as Customer["status"]) ?? "Active",
            statusReason: x.statusReason ?? null,
          };
        })
      );
    });
    return () => unsub();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const name = String(form.get("name") || "");
      const email = String(form.get("email") || "");
      const username = String(form.get("username") || "");
      const password = String(form.get("password") || "");
      const age = form.get("age") ? Number(form.get("age")) : null;
      const nid = String(form.get("nid") || "") || null;
      const address = String(form.get("address") || "") || null;
      const district = String(form.get("district") || "") || null;
      const bank = String(form.get("bank") || "") || null;

      let nidPhotoUrl: string | null = null;
      const nidFile = form.get("nidPhoto") as File | null;
      if (nidFile && nidFile.size > 0) {
        const r = ref(storage, `customers/tmp/${Date.now()}-${nidFile.name}`);
        await uploadBytes(r, nidFile);
        nidPhotoUrl = await getDownloadURL(r);
      }

      const res = await fetch("/api/admin/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, age, nid, address, district, bank, nidPhotoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create customer");

      toast({ title: "Customer created", variant: "success" });
      setOpen(false);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      toast({ title: err?.message || "Failed to create customer", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer</h1>
          <p className="text-sm text-foreground/70">Lookup and manage customer accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setOpen(true)}>Add Customer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Customers</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{customers.length} total</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">District</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium">{c.name || "—"}</td>
                  <td className="p-3">{c.email || "—"}</td>
                  <td className="p-3">{c.district || "—"}</td>
                  <td className="p-3"><Button variant="ghost" size="sm" onClick={() => setView(c)}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Customer Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="add-customer-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="add-customer-title" className="text-xl font-bold tracking-tight">Add Customer</h3>
                <p className="text-sm text-foreground/70">Provide customer details to create a new account.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10">
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
                  <Label htmlFor="email">Email</Label>
                  <input id="email" name="email" type="email" required placeholder="email@example.com" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input id="age" name="age" type="number" min={18} max={100} placeholder="e.g. 28" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number (optional)</Label>
                  <input id="nid" name="nid" placeholder="National ID number" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input id="address" name="address" required placeholder="Street, area" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select id="district" name="district" required className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]">
                    <option value="" disabled>Select district</option>
                    {DISTRICTS.map((d: string) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <input id="username" name="username" required placeholder="Choose a username" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Photo of NID (optional)</Label>
                  <input id="nidPhoto" name="nidPhoto" type="file" accept="image/*" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea id="bank" name="bank" rows={3} required placeholder="Account name, number, bank, branch" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5 md:col-span-1">
                  <Label htmlFor="password">Password</Label>
                  <input id="password" name="password" type="password" required minLength={6} placeholder="Temporary password" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View/Edit Customer Modal */}
      {view && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="view-customer-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setView(null)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3 id="view-customer-title" className="text-xl font-bold tracking-tight">Edit Customer</h3>
                <p className="text-sm text-foreground/70">Update customer details and credentials.</p>
              </div>
              <button onClick={() => setView(null)} aria-label="Close" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator />
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!view) return;
                setSavingView(true);
                try {
                  const form = new FormData(e.currentTarget as HTMLFormElement);
                  const updates: any = {
                    name: String(form.get("name") || view.name || ""),
                    email: String(form.get("email") || view.email || ""),
                    username: String(form.get("username") || view.username || ""),
                    age: form.get("age") ? Number(form.get("age")) : view.age ?? null,
                    nid: String(form.get("nid") || "") || null,
                    address: String(form.get("address") || "") || null,
                    district: String(form.get("district") || "") || null,
                    bank: String(form.get("bank") || "") || null,
                    status: String(form.get("status") || view.status || "Active"),
                    statusReason: String(form.get("statusReason") || "") || null,
                  };
                  const pwd = String(form.get("password") || "").trim();
                  if (pwd) updates.password = pwd;

                  // Optional NID upload replace
                  const nidFile = form.get("nidPhoto") as File | null;
                  if (nidFile && nidFile.size > 0) {
                    const r = ref(storage, `customers/${view.id}/nid-${Date.now()}-${nidFile.name}`);
                    await uploadBytes(r, nidFile);
                    updates.nidPhotoUrl = await getDownloadURL(r);
                  }

                  // Require reason if status is Blocked/Frozen
                  const st = String(updates.status || "Active");
                  const rs = String(updates.statusReason || "").trim();
                  if ((st === "Blocked" || st === "Frozen") && !rs) {
                    toast({ title: "Reason is required when blocking or freezing a customer.", variant: "destructive" });
                    setSavingView(false);
                    return;
                  }

                  const resp = await fetch("/api/admin/update-customer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: view.id, updates }),
                  });
                  const data = await resp.json();
                  if (!resp.ok) throw new Error(data?.error || "Failed to update customer");
                  // Update local list
                  setCustomers((prev) => prev.map((c) => (c.id === view.id ? { ...c, ...updates } : c)));
                  setView((v) => (v ? { ...v, ...updates } : v));
                  toast({ title: "Customer updated", variant: "success" });
                } catch (err: any) {
                  toast({ title: err?.message || "Failed to update customer", variant: "destructive" });
                } finally {
                  setSavingView(false);
                }
              }}
              className="p-4 md:p-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <input id="customerId" name="customerId" value={view.customerId ?? ""} readOnly disabled className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input id="name" name="name" defaultValue={view.name ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input id="email" name="email" type="email" defaultValue={view.email ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <input id="username" name="username" defaultValue={view.username ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input id="age" name="age" type="number" min={18} max={100} defaultValue={view.age ?? undefined ?? undefined} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="password">Password (leave blank to keep unchanged)</Label>
                  <input id="password" name="password" type="password" defaultValue={view.password ?? ""} placeholder="New password" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number</Label>
                  <input id="nid" name="nid" defaultValue={view.nid ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input id="address" name="address" defaultValue={view.address ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select id="district" name="district" defaultValue={view.district ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]">
                    <option value="">Select district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" name="status" defaultValue={view.status ?? "Active"} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]">
                    <option>Active</option>
                    <option>Blocked</option>
                    <option>Frozen</option>
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="statusReason">Reason (for Block/Frozen)</Label>
                  <textarea id="statusReason" name="statusReason" rows={2} defaultValue={view.statusReason ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea id="bank" name="bank" rows={3} defaultValue={view.bank ?? ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Upload NID (optional)</Label>
                  <input id="nidPhoto" name="nidPhoto" type="file" accept="image/*" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                  {view.nidPhotoUrl && <a href={view.nidPhotoUrl} target="_blank" className="text-xs underline text-foreground/70">View current</a>}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setView(null)}>Close</Button>
                <Button type="submit" disabled={savingView}>{savingView ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
