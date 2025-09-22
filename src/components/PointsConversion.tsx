"use client";
import { useI18n } from "@/lib/i18n";

export default function PointsConversion() {
  const { t } = useI18n();
  return (
    <section id="points-and-conversion" className="relative overflow-hidden bg-[var(--background)]">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-72 w-[48rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-end text-right gap-3 mb-6 sm:mb-8">
          <p className="inline-flex w-fit items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/90">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            {t("points.badge")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("points.title")}</h2>
          <p className="text-sm text-foreground/80 max-w-2xl">{t("points.desc")}</p>
          {/* small CTA */}
          <div className="mt-2 self-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] text-black px-3.5 py-2 text-xs font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)] focus:ring-offset-[var(--surface)]"
            >
              {t("points.link")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Collect & Transfer */}
          <div
            className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)] animate-rise"
            style={{ animationDelay: '80ms' }}
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* points icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12h8" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{t("points.c1_title")}</h3>
                <p className="text-sm/6 text-foreground/70">{t("points.c1_desc")}</p>
              </div>
            </div>
          </div>

          {/* Convert to Currency */}
          <div
            className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)] animate-rise"
            style={{ animationDelay: '160ms' }}
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* exchange icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 7h13l-3-3" />
                  <path d="M21 17H8l3 3" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{t("points.c2_title")}</h3>
                <p className="text-sm/6 text-foreground/70">{t("points.c2_desc")}</p>
              </div>
            </div>
          </div>

          {/* Buy Points */}
          <div
            className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)] animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* cart/plus icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M2 2h3l3.6 7.59a2 2 0 0 0 1.8 1.16H19a2 2 0 0 0 2-1.5l1-4H6" />
                  <path d="M12 7v6" />
                  <path d="M9 10h6" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{t("points.c3_title")}</h3>
                <p className="text-sm/6 text-foreground/70">{t("points.c3_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
