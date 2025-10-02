"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-foreground bg-[var(--background)]">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
      </div>

      <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/50 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]">
        <div className="p-8 sm:p-12">
          <header className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-15)] px-3 py-1 text-xs font-medium text-foreground ring-1 ring-[var(--brand-25)]">
              {t("footer.contact")}
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              <span>{t("contact.heading_p1")}</span>
              <span className="text-[var(--brand)]">
                {t("contact.heading_highlight")}
              </span>
              <span>{t("contact.heading_p2")}</span>
            </h1>
          </header>

          {/* Simple, elegant contact form (UI only) */}
          <form className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
            </div>
            <textarea
              placeholder="Message"
              rows={5}
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                className="btn-pill px-5 py-2.5 text-sm font-semibold btn-brand"
              >
                {t("contact.cta")}
              </button>
              <Link
                href="/"
                className="text-sm text-foreground/70 hover:text-[var(--brand)]"
              >
                ← {t("coming.cta_home")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
