"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function GesaCTA() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-emerald-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center text-white">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t("gesa.cta_band_title")} 
          </h3>
          <p className="mt-2 text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
            {t("gesa.cta_band_sub")}
          </p>
          <div className="mt-6">
            <Link href="/signup" className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow hover:brightness-95">
              {t("gesa.cta_band_btn")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
