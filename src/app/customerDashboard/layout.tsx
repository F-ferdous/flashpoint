"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

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
            <span className="logo-flash">Flash</span>
            <span style={{ color: "var(--brand)" }}>Point</span>
            <Badge className="ml-2" variant="secondary">{t("dash.common.customer_badge")}</Badge>
          </Link>
          <Link href="/" className="text-sm hover:opacity-80">{t("dash.common.back_to_site")}</Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <section className="min-h-[60vh] rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 md:p-6">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}
