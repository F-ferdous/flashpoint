"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function CustomerProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const r = doc(db, "customers", uid);
    const unsub = onSnapshot(r, (snap) => setData(snap.exists() ? snap.data() : null));
    return () => unsub();
  }, [uid]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uid) return;
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const phone = String(form.get("phone") || "");
      const address = String(form.get("address") || "");
      let profilePhotoUrl: string | undefined;
      const file = form.get("profilePhoto") as File | null;
      if (file && file.size > 0) {
        const r = ref(storage, `customers/${uid}/profile-${Date.now()}-${file.name}`);
        await uploadBytes(r, file);
        profilePhotoUrl = await getDownloadURL(r);
      }
      const resp = await fetch("/api/customer/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, phone, address, profilePhotoUrl }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to update profile");
      toast({ title: "Profile updated", variant: "success" });
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      toast({ title: err?.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return <div className="text-sm text-foreground/70">Loading profile…</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-sm text-foreground/70">View your information. You can update your phone, address and profile picture.</p>
      </header>
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-3">
          <Label>Full Name</Label>
          <input value={data.name || data.fullName || ""} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
          <Label className="mt-2">Customer ID</Label>
          <input value={data.customerId || ""} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
          <Label className="mt-2">Login Email</Label>
          <input value={data.username || data.email || ""} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
          <Label className="mt-2">District</Label>
          <input value={data.district || ""} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
          <Label className="mt-2">NID Number</Label>
          <input value={data.nid || data.nidNumber || ""} readOnly className="w-full rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
        </div>

        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="profilePhoto">Profile Picture</Label>
            <input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" className="w-full text-sm" />
            {data.profilePhotoUrl && (
              <img src={data.profilePhotoUrl} alt="Profile" className="mt-2 h-20 w-20 rounded-full object-cover" />
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <input id="phone" name="phone" defaultValue={data.phone || ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Address</Label>
            <textarea id="address" name="address" rows={3} defaultValue={data.address || ""} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
