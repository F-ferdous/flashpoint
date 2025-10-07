"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { doc, onSnapshot } from "firebase/firestore";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUid(user.uid);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!uid) return;
    const ref = doc(db, "customers", uid);
    const unsub = onSnapshot(ref, (snap) => setCustomer(snap.exists() ? snap.data() : null));
    return () => unsub();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-0px)] grid place-items-center">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {t("dash.common.loading_dashboard")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      <Navbar />
      <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/customerDashboard" className="font-semibold tracking-tight">
            {t("common.brand_title")}
            <Badge className="ml-2" variant="secondary">{t("dash.common.customer_badge")}</Badge>
          </Link>
          <Link href="/" className="text-sm hover:opacity-80">{t("dash.common.back_to_site")}</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
          {/* Sidebar */}
          <aside className="rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 h-fit sticky top-[84px]">
            <div className="mb-4">
              <div className="text-sm text-foreground/70">Customer</div>
              <div className="font-semibold leading-tight">{customer?.name || customer?.fullName || "Unnamed"}</div>
              {customer?.customerId && (
                <div className="text-xs text-foreground/60">ID: {customer.customerId}</div>
              )}
            </div>
            <nav className="grid gap-1">
              <Link href="/customerDashboard" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm">Home</Link>
              <Link href="/customerDashboard/profile" className="px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sm">Profile</Link>
              {/* Telemedicine removed as requested */}
            </nav>
          </aside>

          {/* Content */}
          <section className="min-h-[60vh] rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 md:p-6">
            {children}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
