"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

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

  // Watch auth state for Navbar controls
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

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

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-[var(--background)]">
      <nav
        className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <div className="mt-3 flex h-16 items-center justify-between rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface-2)] px-3 sm:px-4 glow-brand">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Flash Point Home"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
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
                {/** 3x3 dot matrix to echo the reference logo vibe */}
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
              <span className="text-lg font-semibold tracking-tight leading-none">
                <span className="logo-flash">Flash</span>
                <span style={{ color: "var(--brand)" }}>Point</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#third-party-earning"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              Earning
            </Link>
            <Link
              href="#points-and-conversion"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              Points
            </Link>
            <Link
              href="#telemedicine"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              Telemedicine
            </Link>
            <Link
              href="#pricing"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-md hover:opacity-80 hover:text-[var(--brand)] transition-opacity"
            >
              Contact
            </Link>
            {email ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/80 truncate max-w-[14rem]" title={email}>{email}</span>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      router.replace("/login");
                    } catch (_) {}
                  }}
                  className="text-md btn-pill px-4 py-2 btn-brand-outline hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-md btn-pill px-4 py-2 btn-brand-outline hover:opacity-90"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-md btn-pill px-4 py-2 font-medium shadow-sm transition hover:opacity-90 btn-brand"
                >
                  Get Started
                </Link>
              </>
            )}
            {/* Theme toggle (desktop) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {!mounted ? (
                <span className="block h-5 w-5" aria-hidden />
              ) : isDark ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {/* Theme toggle (mobile) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {!mounted ? (
                <span className="block h-6 w-6" aria-hidden />
              ) : isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <button
              className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Open main menu</span>
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
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            open ? "max-h-64" : "max-h-0"
          }`}
        >
          <div className="grid gap-2 pb-4">
            <Link
              href="#third-party-earning"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              Earning
            </Link>
            <Link
              href="#points-and-conversion"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              Points
            </Link>
            <Link
              href="#telemedicine"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              Telemedicine
            </Link>
            <Link
              href="#pricing"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              Contact
            </Link>
            {email ? (
              <button
                onClick={async () => {
                  try {
                    await signOut(auth);
                    router.replace("/login");
                  } catch (_) {}
                }}
                className="px-2 py-2 btn-pill text-center btn-brand-outline"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 py-2 btn-pill text-center btn-brand-outline"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-2 py-2 btn-pill text-center font-medium btn-brand"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
