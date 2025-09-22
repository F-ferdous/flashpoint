"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";

export default function UserProfilePage() {
  const { t } = useI18n();
  const { toast } = useToast();

  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const uploading = uploadPct > 0 && uploadPct < 100;
  const canSave = useMemo(() => !!uid && !saving && !uploading, [uid, saving, uploading]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setUid(user.uid);
      setEmail(user.email ?? "");
      setDisplayName(user.displayName ?? "");
      setPhotoURL(user.photoURL ?? "");
      // load extended profile from Firestore
      (async () => {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const d = snap.data() as any;
            setPhone(d.phone ?? "");
            setDistrict(d.district ?? "");
            setAddress(d.address ?? "");
            if (d.displayName && !user.displayName) setDisplayName(d.displayName);
            if (d.photoURL && !user.photoURL) setPhotoURL(d.photoURL);
          }
        } catch {}
        setLoading(false);
      })();
    });
    return () => unsub();
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("dash.user.profile.title")}</h1>
        <p className="text-sm text-foreground/70">{t("dash.user.profile.subtitle")}</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading...
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!uid) return;
            setSaving(true);
            try {
              // Update auth profile
              await updateProfile(auth.currentUser!, {
                displayName: displayName || undefined,
                photoURL: photoURL || undefined,
              });
              // Merge user doc
              await setDoc(
                doc(db, "users", uid),
                {
                  email,
                  displayName,
                  phone: phone || null,
                  district: district || null,
                  address: address || null,
                  photoURL: photoURL || null,
                  updatedAt: new Date(),
                },
                { merge: true }
              );
              toast({ title: t("dash.user.profile.updated"), variant: "success" });
            } catch (e) {
              toast({ title: t("dash.user.profile.update_failed"), variant: "destructive" });
            } finally {
              setSaving(false);
            }
          }}
          className="grid gap-6 rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 sm:p-6"
        >
          {/* Photo */}
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-[var(--surface)]">
              {photoURL ? (
                <Image src={photoURL} alt="profile" fill className="object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-foreground/60">{t("dash.user.profile.photo")}</div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] text-black px-3 py-2 text-xs font-semibold shadow-sm hover:brightness-110 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !uid) return;
                    const r = ref(storage, `users/${uid}/profile.jpg`);
                    const task = uploadBytesResumable(r, file);
                    setUploadPct(1);
                    task.on(
                      "state_changed",
                      (snap) => {
                        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                        setUploadPct(pct);
                      },
                      () => {
                        setUploadPct(0);
                        toast({ title: t("dash.user.profile.update_failed"), variant: "destructive" });
                      },
                      async () => {
                        const url = await getDownloadURL(task.snapshot.ref);
                        setPhotoURL(url);
                        setUploadPct(0);
                      }
                    );
                  }}
                />
                {uploading ? t("dash.user.profile.uploading", { pct: uploadPct }) : t("dash.user.profile.change_photo")}
              </label>
              {photoURL && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={async () => {
                    if (!uid) return;
                    try {
                      await deleteObject(ref(storage, `users/${uid}/profile.jpg`));
                    } catch {}
                    setPhotoURL("");
                  }}
                >
                  {t("dash.user.profile.remove_photo")}
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">{t("dash.user.profile.email")}</label>
              <input value={email} disabled className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">{t("dash.user.profile.name")}</label>
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">{t("dash.user.profile.phone")}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+8801XXXXXXXXX" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">{t("dash.user.profile.district")}</label>
              <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Dhaka" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm text-foreground/80">{t("dash.user.profile.address")}</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="House, Road, City, ZIP" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] text-black px-4 py-2.5 text-sm font-semibold shadow-sm hover:brightness-110 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t("dash.user.profile.saving")}
                </>
              ) : (
                <>{t("dash.user.profile.save")}</>
              )}
            </button>
            <Link href="/userDashboard" className="text-sm underline hover:opacity-80">Back</Link>
          </div>
        </form>
      )}
    </section>
  );
}
