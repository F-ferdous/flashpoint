"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { CreditCard, ArrowRight, UserPlus2 } from "lucide-react";

export default function GesaFlashCardPromo() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-[color:oklch(0.98_0.02_160)]">
      {/* soft brand glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-center">
          {/* Copy */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-300 text-xs">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t("gesa.flash_title")}
            </div>
            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-900">
              {t("gesa.flash_title")}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-emerald-900/80 max-w-2xl">
              {t("gesa.flash_desc")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/flash-card"
                className="btn-pill px-5 py-2.5 text-sm font-medium border border-emerald-300 text-emerald-800 hover:bg-white/60 inline-flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" /> {t("gesa.flash_btn_details")}
              </Link>
              <Link
                href="/apply-card"
                className="btn-pill px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2"
              >
                <UserPlus2 className="h-4 w-4" /> {t("gesa.flash_btn_apply")}
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="md:col-span-5">
            <div className="relative mx-auto w-full max-w-md [perspective:1200px]">
              <div className="relative aspect-[16/10] rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 text-white shadow-2xl ring-1 ring-emerald-200/40 overflow-hidden transition-transform duration-300 will-change-transform">
                {/* glow blobs */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-8 -top-8 w-56 h-56 bg-emerald-400 rounded-full blur-3xl" />
                  <div className="absolute -left-8 -bottom-8 w-56 h-56 bg-fuchsia-500 rounded-full blur-3xl" />
                </div>
                <div className="relative h-full p-6 flex flex-col justify-between z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/80">
                        Life & Discount
                      </p>
                      <h4 className="text-2xl font-bold tracking-wide">
                        GESA FLASH
                      </h4>
                    </div>
                    <div className="rounded-md border border-yellow-500/60 bg-gradient-to-tr from-yellow-200 to-yellow-500 w-14 h-10 flex items-center justify-center">
                      <div className="w-full h-[1px] bg-yellow-700/70" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase text-white/70">
                        Card Holder
                      </p>
                      <p className="text-lg font-semibold tracking-wide">
                        RAFSAN AHMED
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-white/70">
                        Valid Thru
                      </p>
                      <p className="text-base font-semibold">12/28</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              <div className="absolute -bottom-6 right-6 rounded-xl bg-white p-2 shadow-lg ring-1 ring-emerald-100 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-700" />
                <span className="text-xs font-semibold text-emerald-800">
                  EMV Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
