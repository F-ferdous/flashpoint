"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/toast";

type Agent = {
  uid: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  status?: string | null;
  age?: number | null;
  nid?: string | null;
  trade?: string | null;
  address?: string | null;
  district?: string | null;
  bank?: string | null;
  points?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export default function AgentProfilePage() {
  const { toast } = useToast();
  const [uid, setUid] = useState<string | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Agent>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUid(user?.uid || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "agents", uid), (snap) => {
      const data = snap.data() as any;
      const a: Agent = { uid, ...(data || {}) };
      setAgent(a);
      if (!editing) setForm(a);
    });
    return () => unsub();
  }, [uid, editing]);

  async function onSave() {
    if (!uid) return;
    try {
      setSaving(true);
      const payload: any = {
        name: form.name ?? null,
        username: form.username ?? null,
        age: form.age ?? null,
        nid: form.nid ?? null,
        trade: form.trade ?? null,
        address: form.address ?? null,
        district: form.district ?? null,
        bank: form.bank ?? null,
        updatedAt: Date.now(),
      };
      await updateDoc(doc(db, "agents", uid), payload);
      toast({ title: "Profile updated", variant: "success" });
      setEditing(false);
    } catch (e: any) {
      toast({ title: e?.message || "Update failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-foreground/70">Your agent account details</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button size="sm" variant="secondary" onClick={() => { setEditing(false); setForm(agent || {}); }}>Cancel</Button>
              <Button size="sm" onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </>
          )}
        </div>
      </header>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 grid gap-4 sm:grid-cols-2">
          {/* Left: Identity */}
          <div className="rounded-lg bg-[var(--surface-2)] p-4 border border-black/10 dark:border-white/10">
            <div className="text-base font-semibold">Identity</div>
            <Separator className="my-3" />
            <Field label="Name" editing={editing} value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} />
            <Field label="Email" value={agent?.email} readOnly />
            <Field label="Username" editing={editing} value={form.username} onChange={(v) => setForm((s) => ({ ...s, username: v }))} />
            <Field label="Status" value={agent?.status} readOnly />
          </div>

          {/* Right: Personal & Banking */}
          <div className="rounded-lg bg-[var(--surface-2)] p-4 border border-black/10 dark:border-white/10">
            <div className="text-base font-semibold">Personal & Banking</div>
            <Separator className="my-3" />
            <Field label="Age" editing={editing} value={form.age?.toString()} onChange={(v) => setForm((s) => ({ ...s, age: v ? Number(v) : null }))} type="number" />
            <Field label="NID" editing={editing} value={form.nid} onChange={(v) => setForm((s) => ({ ...s, nid: v }))} />
            <Field label="Trade" editing={editing} value={form.trade} onChange={(v) => setForm((s) => ({ ...s, trade: v }))} />
            <Field label="District" editing={editing} value={form.district} onChange={(v) => setForm((s) => ({ ...s, district: v }))} />
            <Field label="Address" editing={editing} value={form.address} onChange={(v) => setForm((s) => ({ ...s, address: v }))} />
            <Field label="Bank" editing={editing} value={form.bank} onChange={(v) => setForm((s) => ({ ...s, bank: v }))} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 dark:bg-white/5">
        <div className="p-4 grid gap-3 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold">Account Summary</div>
            <div className="text-xs text-foreground/70">Created {agent?.createdAt ? new Date(Number(agent.createdAt)).toLocaleString() : "—"}</div>
          </div>
          <div className="text-sm"><span className="text-foreground/70">Points: </span><span className="font-semibold">{(agent?.points ?? 0).toLocaleString()}</span></div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, editing, readOnly, type = "text" }: { label: string; value: any; onChange?: (v: string) => void; editing?: boolean; readOnly?: boolean; type?: string }) {
  return (
    <div className="grid gap-1 mb-3">
      <div className="text-xs text-foreground/70">{label}</div>
      {editing && !readOnly ? (
        <input
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          type={type}
          className="rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
        />
      ) : (
        <div className="px-3 py-2 rounded-lg bg-[var(--surface)]/60 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium">
          {value ?? "—"}
        </div>
      )}
    </div>
  );
}
