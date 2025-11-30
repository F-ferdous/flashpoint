"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Label } from "@/components/ui/label";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, app } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, runTransaction, setDoc, getDocs, limit, deleteDoc } from "firebase/firestore";
import { getApps, initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import districtsData from "@/lib/districts.json";
import { Search } from "lucide-react";

type Customer = {
  id: string;
  name?: string | null;
  email?: string | null;
  customerId?: string | null;
  phone?: string | null;
  district?: string | null;
  address?: string | null;
  nid?: string | null;
  bank?: string | null;
  password?: string | null;
  createdAt?: number | null;
};

export default function CustomersPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "customerId">("name");
  const { toast } = useToast();
  const [savingEdit, setSavingEdit] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  // Resolve business AgentID from profile
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, 'Agents', uid), (snap) => {
      const x = (snap.data() as any) || {};
      const aid = String(x.AgentID || x.agentId || x.AgentId || '').trim() || null;
      setAgentId(aid);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    const qRef = query(collection(db, "Customers"), where("ReferrerID", "==", agentId));
    const unsub = onSnapshot(qRef, (snap) => {
      const items: Customer[] = snap.docs
        .map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            name: x.fullName ?? x.name ?? null,
            email: x.email ?? null,
            customerId: x.CustomerID ?? null,
            phone: x.phone ?? x.phoneNumber ?? null,
            district: x.district ?? null,
            address: x.address ?? null,
            nid: x.nidNumber ?? x.nid ?? null,
            bank: x.bank ?? null,
            password: x.password ?? null,
            createdAt: x.createdAt ?? null,
          } as Customer;
        })
        .filter((c, idx) => {
          const raw = snap.docs[idx]?.data() as any;
          return raw?.Approved === true;
        })
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      setCustomers(items);
      setLoading(false);
    });
    return () => unsub();
  }, [agentId]);

  const total = useMemo(() => customers.length, [customers]);
  const filtered = useMemo(() => {
    const q = searchText.trim();
    if (!q) return customers;
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D+/g, "");
    return customers.filter((c) => {
      if (searchBy === "name") return (c.name || "").toLowerCase().includes(qLower);
      if (searchBy === "customerId") return (c.customerId || "").toUpperCase().includes(q.toUpperCase());
      const digits = (c.phone || "").replace(/\D+/g, "");
      return qDigits.length > 0 && digits.includes(qDigits);
    });
  }, [customers, searchText, searchBy]);

  const exportCsv = () => {
    const rows = filtered.map((c) => ({
      Name: c.name || "",
      CustomerID: c.customerId || "",
      Email: (c.email || "").toString().toLowerCase(),
      Phone: c.phone || "",
      District: c.district || "",
      Address: c.address || "",
      NID: c.nid || "",
      CreatedAt: c.createdAt ? new Date(Number(c.createdAt)).toISOString() : "",
    }));

    const headers = Object.keys(rows[0] || {
      Name: "",
      CustomerID: "",
      Email: "",
      Phone: "",
      District: "",
      Address: "",
      NID: "",
      CreatedAt: "",
    });

    const escapeCsv = (val: any) => {
      const s = String(val ?? "");
      if (/[",\n]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const csv = [headers.join(",")]
      .concat(rows.map((r) => headers.map((h) => escapeCsv((r as any)[h])).join(",")))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `CustomersList - ${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-foreground/70">Approved users who registered via your referral link.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as any)}
              className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="phone">Mobile</option>
              <option value="customerId">Customer ID</option>
            </select>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/60" aria-hidden />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Search by ${searchBy === 'phone' ? 'mobile' : searchBy}`}
                className="w-[320px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <Button size="sm" variant="secondary" onClick={exportCsv}>Export</Button>
          <Badge variant="outline">{filtered.length}/{total}</Badge>
          <Button size="sm" onClick={() => setOpen(true)}>Add Customer</Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Customers</h2>
          <div className="flex gap-2 items-center sm:hidden">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as any)}
              className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-xs"
            >
              <option value="name">Name</option>
              <option value="phone">Mobile</option>
              <option value="customerId">Customer ID</option>
            </select>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-foreground/60" aria-hidden />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={`Search ${searchBy}`}
                className="w-[200px] rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 pl-8 pr-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Customer ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="p-3" colSpan={4}>Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan={4}>No customers yet.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-medium">{c.name || "—"}</td>
                    <td className="p-3">{c.customerId || "—"}</td>
                    <td className="p-3">{(c.email || "").toString().toLowerCase()}</td>
                    <td className="p-3 flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setView(c)}>View Details</Button>
                    </td>
                  </tr>
                ))
              )}
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
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget as HTMLFormElement;
                if (!uid) return;
                const form = new FormData(formEl);
                const name = String(form.get("name") || "").trim();
                const email = String(form.get("email") || "").trim();
                const password = String(form.get("password") || "").trim();
                const referrerId = String(form.get("referrerId") || "").trim();
                const age = form.get("age") ? Number(form.get("age")) : undefined;
                const nid = String(form.get("nid") || "").trim();
                const address = String(form.get("address") || "").trim();
                const district = String(form.get("district") || "").trim();
                const bank = String(form.get("bank") || "").trim();
                try {
                  setSaving(true);
                  if (!name || !email || !password || !district || !referrerId) {
                    throw new Error("Name, email, password, district and Referrer ID are required");
                  }
                  const phone = String(form.get('phone') || '').trim();
                  const [cEmailSnap, cPhoneSnap, pEmailSnap, pPhoneSnap] = await Promise.all([
                    getDocs(
                      query(
                        collection(db, "Customers"),
                        where("email", "==", email),
                        limit(1)
                      )
                    ),
                    getDocs(
                      query(
                        collection(db, "Customers"),
                        where("phone", "==", phone),
                        limit(1)
                      )
                    ),
                    getDocs(
                      query(
                        collection(db, "PendingUsers"),
                        where("email", "==", email),
                        limit(1)
                      )
                    ),
                    getDocs(
                      query(
                        collection(db, "PendingUsers"),
                        where("phone", "==", phone),
                        limit(1)
                      )
                    ),
                  ]);
                  const emailDuplicate = !cEmailSnap.empty || !pEmailSnap.empty;
                  const phoneDuplicate = !cPhoneSnap.empty || !pPhoneSnap.empty;
                  if (emailDuplicate || phoneDuplicate) {
                    if (emailDuplicate && phoneDuplicate) {
                      throw new Error("This email and phone number are already in use.");
                    } else if (emailDuplicate) {
                      throw new Error("This email is already in use.");
                    } else {
                      throw new Error("This phone number is already in use.");
                    }
                  }
                  // Create auth user with secondary app to preserve agent session
                  const secondary = getApps().find(a => a.name === 'secondary') || initializeApp((app.options as any), 'secondary');
                  const secAuth = getAuth(secondary);
                  const cred = await createUserWithEmailAndPassword(secAuth, email, password);
                  const newUid = cred.user.uid;

                  // Generate CustomerID using global counter: C + 6 digits (C000001, C000002, ...)
                  const counterRef = doc(collection(db, 'counters'), 'customer_serial');
                  const CustomerID = await runTransaction(db, async (tx) => {
                    const snap = await tx.get(counterRef);
                    const current = (snap.exists() ? (snap.data() as any)?.seq : 0) || 0;
                    const next = current + 1;
                    tx.set(counterRef, { seq: next, type: 'customer', updatedAt: Date.now() }, { merge: true });
                    return `C${String(next).padStart(6, '0')}`;
                  });

                  // Persist Customers/{newUid}. ReferrerID comes from input
                  const customerDoc = {
                    uid: newUid,
                    fullName: name,
                    email,
                    phone: phone || null,
                    age: age ?? null,
                    nidNumber: nid || null,
                    address: address || null,
                    district: district || null,
                    bank: bank || null,
                    password: password || null,
                    Role: 'Customer',
                    Approved: true,
                    CustomerID,
                    ReferrerID: referrerId,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  } as const;
                  await setDoc(doc(collection(db, 'Customers'), newUid), customerDoc, { merge: true });

                  // Cleanup secondary
                  await signOut(secAuth).catch(() => {});
                  if (secondary.name === 'secondary') deleteApp(secondary as any).catch(() => {});

                  formEl.reset();
                  setOpen(false);
                  toast({ title: 'Customer created', variant: 'success' });
                } catch (err: any) {
                  toast({ title: err?.message || 'Failed to create customer', variant: 'destructive' });
                } finally {
                  setSaving(false);
                }
              }}
              className="p-4 md:p-5"
            >
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
                  <Label htmlFor="phone">Mobile Number</Label>
                  <input id="phone" name="phone" required placeholder="01XXXXXXXXX" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age (optional)</Label>
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
                    {(districtsData as any).districts?.map((d: any) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details (optional)</Label>
                  <textarea id="bank" name="bank" rows={3} placeholder="Account name, number, bank, branch" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
                <div className="grid gap-1.5 md:col-span-1">
                  <Label htmlFor="password">Password</Label>
                  <input id="password" name="password" type="password" required minLength={6} placeholder="Temporary password" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Customer'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {view && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setView(null)} />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 md:p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Customer details</h3>
              <button onClick={() => setView(null)} className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <Separator className="my-3" />
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="customerId">Customer ID</Label>
                  <input id="customerId" readOnly disabled value={view.customerId ?? ''} className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      readOnly
                      value={view.password ?? ''}
                      className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm"
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={() => setShowCurrentPassword(v => !v)}>
                      {showCurrentPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input id="name" readOnly disabled defaultValue={view.name ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input id="email" readOnly disabled type="email" defaultValue={view.email ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <input id="phone" readOnly disabled defaultValue={view.phone ?? ''} placeholder="01XXXXXXXXX" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number</Label>
                  <input id="nid" readOnly disabled defaultValue={view.nid ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input id="address" readOnly disabled defaultValue={view.address ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select id="district" disabled defaultValue={view.district ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm">
                    <option value="">Select district</option>
                    {(districtsData as any).districts?.map((d: any) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea id="bank" readOnly disabled rows={2} defaultValue={view.bank ?? ''} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setView(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
