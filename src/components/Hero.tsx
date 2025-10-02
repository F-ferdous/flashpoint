"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0 pointer-events-none opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute -top-40 -left-20 size-[480px] rounded-full bg-gradient-to-br from-indigo-500/40 to-cyan-400/40 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-20 size-[520px] rounded-full bg-gradient-to-tr from-fuchsia-500/40 to-amber-400/40 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6 animate-fade-in">
          <p className="inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full chip-brand backdrop-blur">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("hero.badge")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t("hero.h1_p1")}
            <span style={{ color: "var(--brand)" }}>{t("hero.h1_highlight")}</span>
            {t("hero.h1_p2")}
          </h1>
          <p className="text-sm sm:text-sm text-foreground/70 mx-auto max-w-2xl">
            {t("hero.desc")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center btn-pill px-6 py-3 text-sm font-semibold shadow-sm transition active:translate-y-[1px] btn-brand"
            >
              {t("hero.cta_get_started")}
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center btn-pill px-6 py-3 text-sm font-semibold transition btn-brand-outline"
            >
              {t("hero.cta_view_pricing")}
            </Link>
          </div>
        </div>

        <div className="mt-10 sm:mt-14">
          <div className="relative mx-auto max-w-6xl h-[260px] sm:h-[360px] lg:h-[440px] rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/90 overflow-hidden glow-brand animate-rise">
            {/* decorative brand glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[480px] rounded-full bg-[var(--brand)]/20 blur-3xl" />

            {/* placeholder hero visual */}
            <div className="absolute inset-0 p-5 sm:p-8 grid grid-rows-[auto_1fr]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-fuchsia-500/80" />
                </div>
                <div className="h-6 w-28 rounded-full bg-black/10 dark:bg-white/10" />
              </div>
              <div className="mt-4 grid grid-cols-12 gap-3 sm:gap-4">
                <div className="col-span-12 md:col-span-8 rounded-xl border p-4 sm:p-6" style={{ background: 'var(--card-sky)', borderColor: 'var(--card-sky-border)' }}>
                  <div className="h-24 sm:h-36 rounded-md bg-gradient-to-tr from-amber-400/15 via-yellow-300/10 to-transparent" />
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="h-16 rounded-md border" style={{ background: 'var(--card-mint)', borderColor: 'var(--card-mint-border)' }} />
                    <div className="h-16 rounded-md border" style={{ background: 'var(--card-rose)', borderColor: 'var(--card-rose-border)' }} />
                    <div className="h-16 rounded-md border" style={{ background: 'var(--card-lime)', borderColor: 'var(--card-lime-border)' }} />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 grid gap-3 sm:gap-4">
                  <div className="h-24 rounded-xl border" style={{ background: 'var(--card-rose)', borderColor: 'var(--card-rose-border)' }} />
                  <div className="h-24 rounded-xl border" style={{ background: 'var(--card-mint)', borderColor: 'var(--card-mint-border)' }} />
                  <div className="h-24 rounded-xl border" style={{ background: 'var(--card-sky)', borderColor: 'var(--card-sky-border)' }} />
                </div>
              </div>

              {/* bottom chips */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-[var(--brand-15)] text-foreground/85 border border-[var(--brand-25)]">{t("hero.chip_live_points")}</span>
                <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">{t("hero.chip_daily_bonus")}</span>
                <span className="px-2 py-1 rounded-full bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-500/30">{t("hero.chip_referrals")}</span>
                <span className="px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">{t("hero.chip_telemedicine")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
