"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function GesaHero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-[color:oklch(0.96_0.03_160)]">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[60rem] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 text-emerald-700 ring-1 ring-emerald-200 text-xs">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t("gesa.hero_badge")}
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-emerald-900">
              <span className="block">{t("gesa.hero_h1_p1")}</span>
              <span className="block">{t("gesa.hero_h1_p2")}</span>
              <span className="block">{t("gesa.hero_h1_p3")}</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-emerald-800/80 max-w-xl">
              {t("gesa.hero_sub")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-pill px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700">
                {t("gesa.hero_cta_primary")}
              </Link>
              <Link href="/coming-soon" className="btn-pill px-5 py-2.5 text-sm font-medium border border-emerald-300 text-emerald-800 hover:bg-white/60">
                {t("gesa.hero_cta_secondary")}
              </Link>
            </div>
          </div>

          {/* Right visual: hero image */}
          <div className="relative h-48 sm:h-64 md:h-80">
            <Image
              src="/assets/images/hero-image.jpg"
              alt="Team collaborating at Flash Services Agency"
              fill
              className="rounded-2xl object-cover ring-1 ring-emerald-200/60 shadow-sm"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
