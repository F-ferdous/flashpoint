"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [dashboardHref, setDashboardHref] = useState<string>("/userDashboard");
  const [langOpen, setLangOpen] = useState(false);
  const [langOpenMobile, setLangOpenMobile] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const langRefMobile = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const user = auth.currentUser;

  useEffect(() => {
    // Initialize theme based on the current <html> classes set by the early script
    try {
      const root = document.documentElement;
      const dark = root.classList.contains("dark");
      setIsDark(dark);
    } catch (_) {
      // no-op
    } finally {
      setMounted(true);
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (langRefMobile.current && !langRefMobile.current.contains(target)) {
        setLangOpenMobile(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Watch auth state for Navbar controls and compute dashboard destination
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      const em = user?.email ?? null;
      const userId = user?.uid;
      setEmail(em);

      // Admin by explicit email
      if (em && em.toLowerCase() === "admin@fsalbd.com") {
        setDashboardHref("/admin");
        return;
      }
      // Agent role from agents collection
      if (userId) {
        try {
          const aSnap = await getDoc(doc(db, "agents", userId));
          if (aSnap.exists()) {
            const role = String(
              (aSnap.data() as any)?.role ?? ""
            ).toLowerCase();
            if (role === "agent") {
              setDashboardHref("/agentDashboard");
              return;
            }
          }
        } catch {}

        try {
          const aSnap = await getDoc(doc(db, "customers", userId));
          if (aSnap.exists()) {
            const role = String(
              (aSnap.data() as any)?.role ?? ""
            ).toLowerCase();
            const status = String(
              (aSnap.data() as any)?.status ?? ""
            ).toLowerCase();
            if (role === "Customer" && status === "Active") {
              setDashboardHref("/userDashboard");
              return;
            }
          }
        } catch {}
      }
      // Default: user/customer dashboard
    });
    return () => unsub();
  }, [user]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (_) {}
    // Apply class to <html>
    const root = document.documentElement;
    if (next) {
      root.classList.add("theme-dark");
      root.classList.add("dark");
    } else {
      root.classList.remove("theme-dark");
      root.classList.remove("dark");
    }
  };

  const changeLanguage = (l: "bn" | "en") => {
    setLang(l);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isHome
          ? "bg-[color:oklch(0.96_0.03_160)]"
          : "backdrop-blur bg-[var(--background)]"
      }`}
    >
      <nav
        className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <div
          className={`${
            isHome
              ? "mt-3 flex h-16 items-center justify-between rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/60 dark:bg-white/5 px-3 sm:px-4"
              : "mt-3 flex h-16 items-center justify-between rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface-2)] px-3 sm:px-4 glow-brand"
          }`}
        >
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label={t("navbar.aria_home")}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="shrink-0"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                />
                <path
                  fill="#a21caf"
                  d="M38 14c5 0 9 0 9 0l-4 7H31c-3.5 0-6 2.5-6 6h14c4.4 0 8 3.6 8 8H18c0-12 8-21 20-21z"
                />
                <path fill="#a21caf" d="M46 35c0 3.9-3.1 7-7 7H26l4-7h16z" />
              </svg>
              <span className="text-lg font-semibold tracking-tight leading-none">
                {t("common.brand_title")}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/earning"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              {t("common.earning")}
            </Link>
            <Link
              href="/coming-soon"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              {t("common.points")}
            </Link>
            <Link
              href="/coming-soon"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              {t("common.services")}
            </Link>

            <Link
              href="/contact"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              {t("common.contact")}
            </Link>
            <Link
              href="/coming-soon"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              {t("footer.blog")}
            </Link>
            {email ? (
              <div className="flex items-center gap-3">
                <Link
                  href={dashboardHref}
                  className="text-md btn-pill px-4 py-2 btn-brand-outline hover:opacity-90"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      router.replace("/login");
                    } catch (_) {}
                  }}
                  className="text-md btn-pill px-4 py-2 btn-brand-outline hover:opacity-90"
                >
                  {t("common.logout")}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-md btn-pill px-4 py-2 btn-brand-outline hover:opacity-90"
                >
                  {t("common.login")}
                </Link>
                <Link
                  href="/signup"
                  className="text-md btn-pill px-4 py-2 font-medium shadow-sm transition hover:opacity-90 btn-brand"
                >
                  {t("common.get_started")}
                </Link>
              </>
            )}
            {/* Theme toggle (desktop) — hidden for now */}
            {false && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
                title={
                  isDark
                    ? t("common.switch_to_light")
                    : t("common.switch_to_dark")
                }
              >
                {!mounted ? (
                  <span className="block h-5 w-5" aria-hidden />
                ) : isDark ? (
                  // Sun icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  // Moon icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}
            {/* Language dropdown (desktop) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
                title={t("common.language")}
              >
                <span className="text-sm font-medium">
                  {lang === "bn" ? t("common.bn") : t("common.en")}
                </span>
                <svg
                  className="h-4 w-4 opacity-70"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {langOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 rounded-lg border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/90 backdrop-blur-md shadow-lg p-1 z-50"
                >
                  <button
                    role="menuitem"
                    onClick={() => {
                      changeLanguage("bn");
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${
                      lang === "bn" ? "text-[var(--brand)] font-medium" : ""
                    }`}
                  >
                    {t("common.bn")}
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      changeLanguage("en");
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${
                      lang === "en" ? "text-[var(--brand)] font-medium" : ""
                    }`}
                  >
                    {t("common.en")}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {/* Theme toggle (mobile) — hidden for now */}
            {false && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
                title={
                  isDark
                    ? t("common.switch_to_light")
                    : t("common.switch_to_dark")
                }
              >
                {!mounted ? (
                  <span className="block h-6 w-6" aria-hidden />
                ) : isDark ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            )}

            <button
              className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{t("navbar.open_menu")}</span>
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-y-auto transition-[max-height] duration-300 ease-in-out ${
            open ? "max-h-[70vh]" : "max-h-0"
          }`}
        >
          <div className="grid gap-2 pb-4">
            <Link
              href="/earning"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("common.earning")}
            </Link>
            <Link
              href="/coming-soon"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("common.points")}
            </Link>
            <Link
              href="/coming-soon"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("common.services")}
            </Link>
            <Link
              href="/contact"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("common.contact")}
            </Link>
            <Link
              href="/coming-soon"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("footer.blog")}
            </Link>
            {email ? (
              <>
                <Link
                  href={dashboardHref}
                  className="mx-2 px-3 py-2 btn-pill text-center btn-brand-outline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      router.replace("/login");
                    } catch (_) {}
                  }}
                  className="mx-2 px-3 py-2 btn-pill text-center btn-brand-outline"
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 py-2 btn-pill text-center btn-brand-outline"
                >
                  {t("common.login")}
                </Link>
                <Link
                  href="/signup"
                  className="px-2 py-2 btn-pill text-center font-medium btn-brand"
                >
                  {t("common.get_started")}
                </Link>
              </>
            )}

            {/* Language dropdown (mobile) */}
            <div className="px-2 pt-1" ref={langRefMobile}>
              <div className="relative">
                <button
                  onClick={() => setLangOpenMobile((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={langOpenMobile}
                  className="w-full inline-flex items-center justify-between gap-2 rounded-md px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-[var(--surface-2)]/60 hover:bg-black/5 dark:hover:bg-white/10"
                  title={t("common.language")}
                >
                  <span className="text-sm font-medium">
                    {t("common.language")}:{" "}
                    {lang === "bn" ? t("common.bn") : t("common.en")}
                  </span>
                  <svg
                    className="h-4 w-4 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {langOpenMobile && (
                  <div
                    role="menu"
                    className="absolute left-0 right-0 mt-2 rounded-lg border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/90 backdrop-blur-md shadow-lg p-1 z-50"
                  >
                    <button
                      role="menuitem"
                      onClick={() => {
                        changeLanguage("bn");
                        setLangOpenMobile(false);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${
                        lang === "bn" ? "text-[var(--brand)] font-medium" : ""
                      }`}
                    >
                      {t("common.bn")}
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        changeLanguage("en");
                        setLangOpenMobile(false);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 ${
                        lang === "en" ? "text-[var(--brand)] font-medium" : ""
                      }`}
                    >
                      {t("common.en")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
