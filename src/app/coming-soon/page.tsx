"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function ComingSoonPage() {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-foreground">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
      </div>

      <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/50 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]">
        <div className="p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-15)] px-3 py-1 text-xs font-medium text-foreground ring-1 ring-[var(--brand-25)]">
            {t("coming.badge")}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            {t("coming.title")}
          </h1>
          <p className="mt-3 text-sm text-foreground/70 max-w-2xl mx-auto">
            {t("coming.desc")}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/" className="btn-pill px-5 py-2.5 text-sm font-semibold btn-brand">
              {t("coming.cta_home")}
            </Link>
            <Link href="/contact" className="btn-pill px-5 py-2.5 text-sm font-semibold btn-brand-outline">
              {t("coming.cta_contact")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
