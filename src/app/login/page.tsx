"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useI18n } from "@/lib/i18n";

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useI18n();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError(t("login.err_missing"));
      setSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect after successful login based on role/email
      const u = auth.currentUser;
      const em = u?.email?.toLowerCase();
      // Admin/Agent by explicit email
      if (em === "admin@fsalbd.com") {
        router.push("/admin");
        return;
      }
      if (em === "agent@fsalbd.com") {
        router.push("/agentDashboard");
        return;
      }
      // Otherwise, check Firestore role for this uid
      const uid = u?.uid;
      if (uid) {
        try {
          const snap = await getDoc(doc(db, "users", uid));
          const role = (snap.exists() ? (snap.data() as any)?.role : undefined) as string | undefined;
          if (role === "user") {
            router.push("/userDashboard");
            return;
          }
        } catch {}
      }
      // Fallback
      router.push("/");
    } catch (err: any) {
      let message = t("login.err_default");
      const code = err?.code as string | undefined;
      switch (code) {
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
        case "auth/wrong-password":
        case "auth/user-not-found":
          message = t("login.err_invalid");
          break;
        case "auth/too-many-requests":
          message = t("login.err_rate_limited");
          break;
        case "auth/network-request-failed":
          message = t("login.err_network");
          break;
        case "auth/invalid-email":
          message = t("login.err_invalid_email");
          break;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-[calc(100dvh-140px)] overflow-hidden bg-[var(--background)]">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[48rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <p className="inline-flex w-fit items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/90">
              <span className="size-2 rounded-full bg-[var(--brand)]" />
              {t("login.badge")}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("login.heading")}<span className="logo-flash">Flash</span>
              <span style={{ color: "var(--brand)" }}>Point</span>
            </h1>
            <p className="mt-2 text-sm text-foreground/70">{t("login.sub")}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 sm:p-6 glow-brand">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-foreground/80">{t("login.email_label")}</label>
              <input id="email" name="email" type="email" required placeholder={t("login.email_placeholder")} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm text-foreground/80">{t("login.pass_label")}</label>
                <Link href="#" className="text-xs text-foreground/70 hover:text-[var(--brand)] underline">{t("login.forgot")}</Link>
              </div>
              <input id="password" name="password" type="password" required placeholder={t("login.pass_placeholder")} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                {error}
              </div>
            )}

            <button disabled={submitting} type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-black px-4 py-2.5 text-sm font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)] focus:ring-offset-[var(--background-solid)] disabled:opacity-70">
              {submitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  {t("login.submitting")}
                </>
              ) : (
                <>{t("login.submit")}</>
              )}
            </button>

            <p className="text-center text-sm text-foreground/70">
              {t("login.new_here")} <Link href="/signup" className="underline hover:text-[var(--brand)]">{t("login.create_account")}</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
