"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, Gift, Wallet, User, ArrowLeftRight } from "lucide-react";
import { ToastProvider, Toaster, useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n";

const navItems = [
  {
    href: "/agentDashboard/customers",
    k: "dash.agent.nav.customers",
    icon: Users,
    tone: { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-300" },
  },
  {
    href: "/agentDashboard/referals",
    k: "dash.agent.nav.referals",
    icon: Gift,
    tone: {
      bg: "bg-violet-500/15",
      text: "text-violet-600 dark:text-violet-300",
    },
  },
  {
    href: "/agentDashboard/earnings",
    k: "dash.agent.nav.earnings",
    icon: Wallet,
    tone: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-300",
    },
  },
  {
    href: "/agentDashboard/transfer",
    k: "dash.agent.nav.transfer",
    icon: ArrowLeftRight,
    tone: { bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300" },
  },
  {
    href: "/agentDashboard/profile",
    k: "dash.agent.nav.profile",
    icon: User,
    tone: { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-300" },
  },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentCode, setAgentCode] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      // Admin accounts should not access agent dashboard
      if ((user.email || "").toLowerCase() === "admin@gesaflash.com") {
        router.replace("/admin");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "Agents", user.uid));
        const data = (snap.exists() ? (snap.data() as any) : undefined) as any;
        const role = String(data?.Role || data?.role || "").toLowerCase();
        if (role === "agent") {
          setEmail(user.email ?? null);
          setAgentName((data?.fullName as string | undefined) ?? (data?.name as string | undefined) ?? null);
          setAgentCode((data?.AgentID as string | undefined) ?? (data?.agentId as string | undefined) ?? null);
          setLoading(false);
          return;
        }
        // If this is actually a customer, redirect them
        const cSnap = await getDoc(doc(db, "Customers", user.uid));
        if (cSnap.exists()) {
          router.replace("/userDashboard");
          return;
        }
      } catch {}
      router.replace("/login");
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-0px)] grid place-items-center">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {t("dash.common.loading_dashboard")}
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-[100dvh] relative overflow-hidden">
        <Navbar />
        {/* ambient brand glow */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(80%_80%_at_50%_0%,black,transparent)]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
        </div>

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur border-b border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link
              href="/agentDashboard"
              className="font-semibold tracking-tight"
            >
              {t("common.brand_title")}
              <Badge className="ml-2" variant="secondary">
                {t("dash.common.agent_badge")}
              </Badge>
            </Link>
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              {agentCode && (
                <span
                  className="text-foreground/80 truncate max-w-[10rem]"
                  title={agentCode}
                >
                  {agentCode}
                </span>
              )}
              <Link href="/" className="hover:opacity-80">
                {t("dash.common.back_to_site")}
              </Link>
            </div>
          </div>
          <nav className="mx-auto max-w-7xl px-2 pb-2 overflow-x-auto">
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
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          active ? "" : `${item.tone.text}`
                        }`}
                      >
                        <span
                          className={`grid place-items-center rounded-md p-1 ${item.tone.bg}`}
                        >
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
            <Link
              href="/agentDashboard"
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="grid place-items-center rounded-md" aria-hidden>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <rect
                    x="2"
                    y="2"
                    width="28"
                    height="28"
                    rx="6"
                    fill="var(--brand)"
                  />
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
              <div className="font-semibold leading-none">
                {t("dash.common.agent_badge")}
              </div>
            </Link>
            <div className="mt-2 px-2 text-xs text-foreground/70 truncate">
              <div
                title={agentName ?? undefined}
                className="font-medium text-foreground/90"
              >
                {agentName ?? "—"}
              </div>
              <div className="mt-0.5">
                <span className="text-foreground/60">ID: </span>
                <span className="font-semibold">{agentCode ?? "—"}</span>
              </div>
            </div>
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
                        <span
                          className={`grid place-items-center rounded-md p-1.5 ${item.tone.bg} ${item.tone.text}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className={active ? "font-semibold" : undefined}>
                          {t(item.k)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <Separator className="my-3" />
            <SidebarLogout />
          </aside>

          {/* Content */}
          <section className="min-h-[70vh] rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/80 dark:bg-white/5 p-4 md:p-6 glow-brand backdrop-blur-sm">
            {children}
          </section>
        </div>

        <Footer />
        <Toaster />
      </div>
    </ToastProvider>
  );
}

function SidebarLogout() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useI18n();
  return (
    <Button
      className="w-full bg-[var(--brand)] text-black hover:brightness-110"
      onClick={async () => {
        try {
          await signOut(auth);
          toast({ title: t("dash.common.signed_out"), variant: "success" });
          router.replace("/login");
        } catch (e) {
          toast({
            title: t("dash.common.sign_out_failed"),
            variant: "destructive",
          });
        }
      }}
    >
      {t("dash.common.logout")}
    </Button>
  );
}
