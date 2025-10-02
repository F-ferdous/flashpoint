"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 relative overflow-hidden bg-[var(--background)]">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
      </div>

      <div className="border-t border-black/10 dark:border-white/10 bg-[var(--surface-2)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand + info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Logo copied from Navbar */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className="shrink-0 rounded-xl shadow-[0_10px_30px_-10px_rgba(245,195,59,0.35)]"
                >
                  <rect
                    x="2"
                    y="2"
                    width="28"
                    height="28"
                    rx="6"
                    fill="var(--brand)"
                  />
                  <g fill="#0a0a0a">
                    <circle cx="11" cy="11" r="1.6" />
                    <circle cx="16" cy="11" r="1.6" />
                    <circle cx="21" cy="11" r="1.6" />
                    <circle cx="11" cy="16" r="1.6" />
                    <circle cx="16" cy="16" r="1.6" />
                    <circle cx="21" cy="16" r="1.6" />
                    <circle cx="11" cy="21" r="1.6" />
                    <circle cx="16" cy="21" r="1.6" />
                    <circle cx="21" cy="21" r="1.6" />
                  </g>
                </svg>
                <span className="text-lg font-semibold tracking-tight leading-none">
                  <span className="logo-flash">Flash</span>
                  <span style={{ color: "var(--brand)" }}>Point</span>
                </span>
              </div>
              <p className="text-sm text-foreground/70 max-w-xs">
                {t("footer.blurb1")}
              </p>
              <p className="text-sm text-foreground/60 max-w-xs">
                {t("footer.blurb2")}
              </p>
            </div>

            {/* Columns */}
            <nav
              aria-label="Footer Navigation"
              className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">
                  {t("footer.product")}
                </h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.earning")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.points")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.telemedicine")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">
                  {t("footer.company")}
                </h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.careers")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.blog")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">
                  {t("footer.resources")}
                </h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.downloads")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.docs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/coming-soon"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.support")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">
                  {t("footer.legal")}
                </h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.privacy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="hover:text-[var(--brand)]"
                    >
                      {t("footer.terms")}
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="mt-10 border-t border-black/10 dark:border-white/10 pt-6 flex items-center justify-between text-xs text-foreground/60">
            <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
            <p>{t("footer.made_with")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
