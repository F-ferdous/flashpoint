"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-0 relative overflow-hidden bg-emerald-900 text-white">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-emerald-500/30 blur-3xl" />
      </div>

      <div className="border-t border-white/10 bg-emerald-900/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand + info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Brand logo: green ring + magenta F */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className="shrink-0"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                  />
                  <path
                    fill="#a21caf"
                    d="M38 14c5 0 9 0 9 0l-4 7H31c-3.5 0-6 2.5-6 6h14c4.4 0 8 3.6 8 8H18c0-12 8-21 20-21z"
                  />
                  <path fill="#a21caf" d="M46 35c0 3.9-3.1 7-7 7H26l4-7h16z" />
                </svg>
                <span className="text-lg font-semibold tracking-tight leading-none">
                  {t("common.brand_title")}
                </span>
              </div>
              <p className="text-sm text-white/80 max-w-xs">
                {t("footer.blurb1")}
              </p>
              <p className="text-sm text-white/70 max-w-xs">
                {t("footer.blurb2")}
              </p>
            </div>

            {/* Columns */}
            <nav
              aria-label="Footer Navigation"
              className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              <div>
                <h5 className="text-sm font-semibold mb-3 text-white">
                  {t("footer.product")}
                </h5>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.earning")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.points")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.telemedicine")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-white">
                  {t("footer.company")}
                </h5>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.careers")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.blog")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-white">
                  {t("footer.resources")}
                </h5>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.downloads")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.docs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.support")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-white">
                  {t("footer.legal")}
                </h5>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="hover:text-emerald-200"
                    >
                      {t("footer.terms")}
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="mt-10 border-top border-white/10 pt-6 flex items-center justify-between text-xs text-white/70">
            <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
            <p>{t("footer.made_with")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
