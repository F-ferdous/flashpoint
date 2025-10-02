"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users as UsersIcon, User, ShieldCheck, Send, Wallet as WalletIcon, Banknote } from "lucide-react";
import { ToastProvider, Toaster, useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { href: "/admin", k: "dash.admin.nav.dashboard", icon: LayoutDashboard, tone: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-300" } },
  { href: "/admin/agents", k: "dash.admin.nav.agents", icon: UsersIcon, tone: { bg: "bg-emerald-500/15", text: "text-emerald-600 dark:text-emerald-300" } },
  { href: "/admin/customer", k: "dash.admin.nav.customer", icon: User, tone: { bg: "bg-violet-500/15", text: "text-violet-600 dark:text-violet-300" } },
  { href: "/admin/verify", k: "dash.admin.nav.verify", icon: ShieldCheck, tone: { bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300" } },
  { href: "/admin/transfer", k: "dash.admin.nav.transfer", icon: Send, tone: { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" } },
  { href: "/admin/wallet", k: "dash.admin.nav.wallet", icon: WalletIcon, tone: { bg: "bg-rose-500/15", text: "text-rose-600 dark:text-rose-300" } },
  { href: "/admin/payouts", k: "dash.admin.nav.payouts", icon: Banknote, tone: { bg: "bg-teal-500/15", text: "text-teal-600 dark:text-teal-300" } },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const email = user?.email ?? "";
      const ADMIN = "admin@fsalbd.com";
      const AGENT = "agent@fsalbd.com";
      const USER = "user@fsalbd.com";
      if (!email) {
        router.replace("/login");
      } else if (email === ADMIN) {
        setLoading(false);
      } else if (email === AGENT) {
        router.replace("/agentDashboard");
      } else if (email === USER) {
        router.replace("/userDashboard");
      } else {
        router.replace("/login");
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
          {t("dash.common.loading_admin")}
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
    <div className="min-h-[100dvh]">
      {/* Global site header */}
      <Navbar />
      {/* Mobile top nav */}
      <header className="md:hidden sticky top-16 z-40 bg-[var(--background)]/80 backdrop-blur border-b border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-semibold tracking-tight">
            <span className="logo-flash">Flash</span>
            <span style={{ color: "var(--brand)" }}>Point</span>
            <Badge className="ml-2" variant="secondary">{t("dash.common.admin_badge")}</Badge>
          </Link>
          <Link href="/" className="text-sm hover:opacity-80">{t("dash.common.back_to_site")}</Link>
        </div>
        <nav className="mx-auto max-w-7xl px-2 pt-2 pb-3 overflow-x-auto">
          <ul className="flex gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm border transition-colors ${
                      active
                        ? "bg-[var(--brand)] text-black border-[var(--brand-25)] font-semibold"
                        : "bg-[var(--surface-2)] border-black/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className={`inline-flex items-center gap-1.5 ${active ? "" : `${item.tone.text}`}`}>
                      <span className={`grid place-items-center rounded-md p-1 ${item.tone.bg}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {t(item.k)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl grid md:grid-cols-[260px_1fr] gap-6 px-4 md:px-6 py-6">
        {/* Sidebar */}
        <aside className="hidden md:flex sticky top-20 self-start rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 h-[calc(100dvh-96px)] flex-col">
          <Link href="/admin" className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <div className="grid place-items-center rounded-md" aria-hidden>
              <svg
                width="22"
                height="22"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--brand)" />
                <g fill="#0a0a0a">
                  <circle cx="11" cy="11" r="1.6" />
                  <circle cx="16" cy="11" r="1.6" />
                  <circle cx="21" cy="11" r="1.6" />
                  <circle cx="11" cy="16" r="1.6" />
                  <circle cx="16" cy="16" r="1.6" />
                  <circle cx="21" cy="16" r="1.6" />
                  <circle cx="11" cy="21" r="1.6" />
                  <circle cx="16" cy="21" r="1.6" />
                  <circle cx="21" cy="21" r="1.6" />
                </g>
              </svg>
            </div>
            <div className="font-semibold leading-none">{t("dash.common.admin_badge")}</div>
          </Link>
          <Separator className="my-3" />
          <nav className="flex-1 overflow-auto">
            <ul className="grid gap-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                        active
                          ? "bg-[var(--brand-15)] border border-[var(--brand-25)] font-semibold"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className={`grid place-items-center rounded-md p-1.5 ${item.tone.bg} ${item.tone.text}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={active ? "font-semibold" : undefined}>{t(item.k)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Separator className="my-3" />
          <LogoutButton onDone={() => router.replace("/login")} />
        </aside>

        {/* Content */}
        <section className="min-h-[70vh] rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-4 md:p-6">
          {children}
        </section>
      </div>

      {/* Global site footer */}
      <Footer />
      <Toaster />
    </div>
    </ToastProvider>
  );
}

function LogoutButton({ onDone }: { onDone: () => void }) {
  const { toast } = useToast();
  const { t } = useI18n();
  return (
    <Button
      className="w-full bg-[var(--brand)] text-black hover:brightness-110"
      onClick={async () => {
        try {
          await signOut(auth);
          toast({ title: t("dash.common.signed_out"), variant: "success" });
          onDone();
        } catch (e) {
          toast({ title: t("dash.common.sign_out_failed"), variant: "destructive" });
        }
      }}
    >
      {t("dash.common.logout")}
    </Button>
  );
}
