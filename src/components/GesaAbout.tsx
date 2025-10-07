"use client";

import { useI18n } from "@/lib/i18n";

export default function GesaAbout() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-900">
              {t("gesa.about_title")}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground/80 max-w-prose">
              {t("gesa.about_desc")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[t("gesa.about_pill_education"), t("gesa.about_pill_health"), t("gesa.about_pill_entre"), t("gesa.about_pill_tech")].map(
              (label, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[color:oklch(0.96_0.03_160)] ring-1 ring-emerald-200 px-4 py-6 text-center text-emerald-900 font-semibold"
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
