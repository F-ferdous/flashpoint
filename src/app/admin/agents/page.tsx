"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import districtsData from "@/lib/districts.json";
import { db, storage, auth, app } from "@/lib/firebase";
import { collection, onSnapshot, doc, runTransaction, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Search } from "lucide-react";
import { getApps, initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const DISTRICTS =
  (districtsData as any).districts?.map((d: any) => d.name) ?? [];

export default function AgentsPage() {
  type Agent = {
    id: string;
    agentId?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    status: "Active" | "Pending" | "Blocked" | "Frozen";
    age?: number;
    nid?: string;
    trade?: string;
    address?: string;
    district?: string;
    bank?: string;
    statusReason?: string | null;
    nidPhotoUrl?: string | null;
    tradePhotoUrl?: string | null;
    password?: string | null;
  };

  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "phone" | "agentId">("name");
  const [view, setView] = useState<Agent | null>(null);
  const [savingView, setSavingView] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { toast } = useToast();

  // Live list from Firestore Agents
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Agents"), (snap) => {
      setAgents(
        snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            agentId: x.AgentID ?? null,
            name: String(x.fullName || x.name || "Unnamed"),
            email: String(x.email || ""),
            phone: x.phone || x.phoneNumber || null,
            status: (x.status as Agent["status"]) || "Active",
            age: x.age ?? undefined,
            nid: x.nidNumber ?? x.nid ?? undefined,
            trade: x.trade ?? undefined,
            address: x.address ?? undefined,
            district: x.district ?? undefined,
            bank: x.bank ?? undefined,
            statusReason: x.statusReason ?? undefined,
            nidPhotoUrl: x.nidPhotoUrl ?? undefined,
            tradePhotoUrl: x.tradePhotoUrl ?? undefined,
            password: x.password ?? undefined,
          };
        })
      );
    });
    return () => unsub();
  }, []);

  const filteredAgents = useMemo(() => {
    const q = searchText.trim();
    if (!q) return agents;
    const qLower = q.toLowerCase();
    const qDigits = q.replace(/\D+/g, "");
    return agents.filter((a) => {
      if (searchBy === "name") {
        return (a.name || "").toLowerCase().includes(qLower);
      }
      if (searchBy === "agentId") {
        return (a.agentId || "").toUpperCase().includes(q.toUpperCase());
      }
      // phone
      const phone = (a.phone || "").replace(/\D+/g, "");
      return qDigits.length > 0 && phone.includes(qDigits);
    });
  }, [agents, searchText, searchBy]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const age = Number(form.get("age") || 0);
    const nid = String(form.get("nid") || "");
    const trade = String(form.get("trade") || "");
    const address = String(form.get("address") || "");
    const district = String(form.get("district") || "");
    const bank = String(form.get("bank") || "");

    try {
      // 1) Create Auth user with secondary app to preserve admin session
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const secondary = getApps().find(a => a.name === 'secondary') || initializeApp((app.options as any), 'secondary');
      const secAuth = getAuth(secondary);
      const cred = await createUserWithEmailAndPassword(secAuth, email, password);
      const uid = cred.user.uid;

      // 2) Compute AgentID as A + 6-digit global sequence (A000001, A000002, ...)
      const counterRef = doc(collection(db, 'counters'), 'agent_serial');
      const AgentID = await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        const current = (snap.exists() ? (snap.data() as any)?.seq : 0) || 0;
        const next = current + 1;
        tx.set(
          counterRef,
          { seq: next, type: 'agent', updatedAt: Date.now() },
          { merge: true }
        );
        return `A${String(next).padStart(6, '0')}`;
      });

      // Pre-create doc id (use uid to align record with auth user)
      const agentDocRef = doc(collection(db, 'Agents'), uid);
      const docId = agentDocRef.id;

      // Optional uploads
      let nidPhotoUrl: string | null = null;
      const nidFile = form.get('nidPhoto') as File | null;
      if (nidFile && nidFile.size > 0) {
        const r = ref(storage, `agents/${docId}/nid-${Date.now()}-${nidFile.name}`);
        await uploadBytes(r, nidFile);
        nidPhotoUrl = await getDownloadURL(r);
      }
      let tradePhotoUrl: string | null = null;
      const tradeFile = form.get('tradePhoto') as File | null;
      if (tradeFile && tradeFile.size > 0) {
        const r2 = ref(storage, `agents/${docId}/trade-${Date.now()}-${tradeFile.name}`);
        await uploadBytes(r2, tradeFile);
        tradePhotoUrl = await getDownloadURL(r2);
      }

      const adminEmail = auth.currentUser?.email || "Admin Email";

      const agentDoc = {
        uid,
        fullName: name,
        email,
        age: age || null,
        nidNumber: nid || null,
        trade: trade || null,
        address: address || null,
        district: district || null,
        bank: bank || null,
        password: password || null,
        AgentID,
        Role: "Agent",
        status: "Active",
        adminEmail: adminEmail,
        nidPhotoUrl,
        tradePhotoUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(agentDocRef, agentDoc, { merge: true });

      // Cleanup secondary auth session
      await signOut(secAuth).catch(() => {});
      if (secondary.name === 'secondary') {
        deleteApp(secondary as any).catch(() => {});
      }

      setOpen(false);
      toast({ title: "Agent created", variant: "success" });
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      toast({
        title: err?.message || "Failed to create agent",
        variant: "destructive",
      });
    }
  }

  async function onSaveView(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!view) return;
    setSavingView(true);
    try {
      const form = new FormData(e.currentTarget);
      const updates: any = {
        name: String(form.get("name") || view.name),
        email: String(form.get("email") || view.email),
        age: form.get("age") ? Number(form.get("age")) : view.age ?? null,
        nid: String(form.get("nid") || "") || null,
        trade: String(form.get("trade") || "") || null,
        address: String(form.get("address") || "") || null,
        district: String(form.get("district") || "") || null,
        bank: String(form.get("bank") || "") || null,
        status: String(form.get("status") || view.status),
        statusReason: String(form.get("statusReason") || "") || null,
      };

      const newPwd = String(form.get("password") || "").trim();
      if (newPwd.length > 0) {
        updates.password = newPwd;
      }

      // Persist updates and refresh local state
      await setDoc(doc(collection(db, 'Agents'), view.id), { ...updates, updatedAt: Date.now() }, { merge: true });
      setAgents((prev) => prev.map((a) => (a.id === view.id ? { ...a, ...updates } : a)));
      setView((v) => (v ? { ...v, ...updates } : v));
      toast({ title: "Agent updated", variant: "success" });
    } catch (err: any) {
      toast({
        title: err?.message || "Failed to update agent",
        variant: "destructive",
      });
    } finally {
      setSavingView(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Agents
          </h1>
          <p className="text-sm text-foreground/70">
            Manage agent accounts and performance.
          </p>
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
              <option value="agentId">Agent ID</option>
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
          <Button size="sm" onClick={() => setOpen(true)}>
            Add Agent
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">All Agents</h2>
          <div className="flex gap-2 items-center">
            <div className="sm:hidden flex items-center gap-2">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as any)}
                className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-2 text-xs"
              >
                <option value="name">Name</option>
                <option value="phone">Mobile</option>
                <option value="agentId">Agent ID</option>
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
            <Badge variant="outline">{filteredAgents.length}/{agents.length}</Badge>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-foreground/70">
              <tr>
                <th className="p-3">Agent</th>
                <th className="p-3">Agent ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {filteredAgents.map((ag) => (
                <tr key={ag.id}>
                  <td className="p-3 font-medium">{ag.name}</td>
                  <td className="p-3">{ag.agentId || "—"}</td>
                  <td className="p-3">{ag.email}</td>
                  <td className="p-3">
                    {ag.status === "Active" && (
                      <Badge variant="success">Active</Badge>
                    )}
                    {ag.status === "Pending" && (
                      <Badge variant="warning">Pending</Badge>
                    )}
                    {ag.status === "Blocked" && (
                      <Badge variant="destructive">Blocked</Badge>
                    )}
                    {ag.status === "Frozen" && (
                      <Badge variant="secondary">Frozen</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-transform hover:translate-x-0.5"
                      onClick={() => setView(ag)}
                    >
                      View
                    </Button>
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
          className="fixed inset-0 z-[100] grid place-items-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-agent-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="add-agent-title"
                  className="text-xl font-bold tracking-tight"
                >
                  Add Agent
                </h3>
                <p className="text-sm text-foreground/70">
                  Provide agent details to create a new account.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
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
            <form onSubmit={onSubmit} className="p-4 md:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    name="name"
                    required
                    placeholder="Full name"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={18}
                    max={100}
                    required
                    placeholder="e.g. 28"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number (optional)</Label>
                  <input
                    id="nid"
                    name="nid"
                    placeholder="National ID number"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="trade">Trade Licence Number (optional)</Label>
                  <input
                    id="trade"
                    name="trade"
                    placeholder="Trade licence number"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input
                    id="address"
                    name="address"
                    required
                    placeholder="Street, area"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    name="district"
                    required
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="" disabled>
                      Select district
                    </option>
                    {DISTRICTS.map((d: string) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Username field removed as per request */}
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Photo of NID (optional)</Label>
                  <input
                    id="nidPhoto"
                    name="nidPhoto"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tradePhoto">
                    Photo of Trade Licence (optional)
                  </Label>
                  <input
                    id="tradePhoto"
                    name="tradePhoto"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea
                    id="bank"
                    name="bank"
                    rows={3}
                    required
                    placeholder="Account name, number, bank, branch"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5 md:col-span-1">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Temporary password"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
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
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setView(null)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-4 md:p-5">
              <div>
                <h3
                  id="view-agent-title"
                  className="text-xl font-bold tracking-tight"
                >
                  Edit Agent
                </h3>
                <p className="text-sm text-foreground/70">
                  Update details, upload documents and change status.
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
            <form onSubmit={onSaveView} className="p-4 md:p-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="agentId">Agent ID</Label>
                  <input
                    id="agentId"
                    name="agentId"
                    value={view.agentId ?? ""}
                    readOnly
                    disabled
                    className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <input
                    id="name"
                    name="name"
                    defaultValue={view.name}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={view.email}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="password">
                    Password (leave blank to keep unchanged)
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      defaultValue={view.password ?? ""}
                      placeholder="New password"
                      className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="text-xs px-3 py-2 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="age">Age</Label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={18}
                    max={100}
                    defaultValue={view.age}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nid">NID Number</Label>
                  <input
                    id="nid"
                    name="nid"
                    defaultValue={view.nid ?? ""}
                    placeholder="National ID number"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="trade">Trade Licence Number</Label>
                  <input
                    id="trade"
                    name="trade"
                    defaultValue={view.trade ?? ""}
                    placeholder="Trade licence number"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="address">Address</Label>
                  <input
                    id="address"
                    name="address"
                    defaultValue={view.address ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="district">District</Label>
                  <select
                    id="district"
                    name="district"
                    defaultValue={view.district ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="">Select district</option>
                    {DISTRICTS.map((d: string) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="bank">Bank Account Details</Label>
                  <textarea
                    id="bank"
                    name="bank"
                    rows={3}
                    defaultValue={view.bank ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="nidPhoto">Upload NID (optional)</Label>
                  <input
                    id="nidPhoto"
                    name="nidPhoto"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  {view.nidPhotoUrl && (
                    <a
                      href={view.nidPhotoUrl}
                      target="_blank"
                      className="text-xs underline text-foreground/70"
                    >
                      View current
                    </a>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tradePhoto">
                    Upload Trade Licence (optional)
                  </Label>
                  <input
                    id="tradePhoto"
                    name="tradePhoto"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:text-black file:px-3 file:py-2.5 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                  {view.tradePhotoUrl && (
                    <a
                      href={view.tradePhotoUrl}
                      target="_blank"
                      className="text-xs underline text-foreground/70"
                    >
                      View current
                    </a>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={view.status}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option>Active</option>
                    <option>Blocked</option>
                    <option>Frozen</option>
                  </select>
                </div>
                <div className="md:col-span-2 grid gap-1.5">
                  <Label htmlFor="statusReason">
                    Reason (for Block/Frozen)
                  </Label>
                  <textarea
                    id="statusReason"
                    name="statusReason"
                    rows={2}
                    defaultValue={view.statusReason ?? ""}
                    className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setView(null)}
                >
                  Close
                </Button>
                <Button type="submit" disabled={savingView}>
                  {savingView ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
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
