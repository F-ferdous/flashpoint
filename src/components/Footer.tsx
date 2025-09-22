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
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--brand)" />
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
              <div className="flex items-center gap-3 pt-1">
                <Link aria-label="Twitter" href="#" className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M22 5.95c-.64.28-1.33.47-2.05.56a3.52 3.52 0 0 0 1.54-1.94 7.03 7.03 0 0 1-2.23.85 3.5 3.5 0 0 0-5.96 3.2A9.94 9.94 0 0 1 3.16 4.9a3.5 3.5 0 0 0 1.08 4.67c-.54-.02-1.06-.16-1.5-.42v.04a3.5 3.5 0 0 0 2.81 3.43c-.26.07-.54.1-.82.1-.2 0-.4-.02-.59-.06a3.5 3.5 0 0 0 3.27 2.43A7.02 7.02 0 0 1 2 17.54a9.9 9.9 0 0 0 5.37 1.57c6.45 0 9.98-5.34 9.98-9.98l-.01-.45A7.1 7.1 0 0 0 22 5.95z"/>
                  </svg>
                </Link>
                <Link aria-label="GitHub" href="#" className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.53-1.12-1.53-.92-.64.07-.63.07-.63 1.02.08 1.56 1.07 1.56 1.07.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .85-.28 2.78 1.05a9.3 9.3 0 0 1 5.06 0c1.93-1.33 2.78-1.05 2.78-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.69.94.69 1.89 0 1.37-.01 2.47-.01 2.81 0 .26.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Columns */}
            <nav aria-label="Footer Navigation" className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">{t("footer.product")}</h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li><Link href="#third-party-earning" className="hover:text-[var(--brand)]">{t("footer.earning")}</Link></li>
                  <li><Link href="#points-and-conversion" className="hover:text-[var(--brand)]">{t("footer.points")}</Link></li>
                  <li><Link href="#telemedicine" className="hover:text-[var(--brand)]">{t("footer.telemedicine")}</Link></li>
                  <li><Link href="#contact" className="hover:text-[var(--brand)]">{t("footer.contact")}</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">{t("footer.company")}</h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li><Link href="#" className="hover:text-[var(--brand)]">{t("footer.about")}</Link></li>
                  <li><Link href="#" className="hover:text-[var(--brand)]">{t("footer.careers")}</Link></li>
                  <li><Link href="#" className="hover:text-[var(--brand)]">{t("footer.blog")}</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-3 text-foreground">{t("footer.resources")}</h5>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li><Link href="#" className="hover:text-[var(--brand)]">{t("footer.downloads")}</Link></li>
                  <li><Link href="#" className="hover:text-[var(--brand)]">{t("footer.docs")}</Link></li>
                  <li><Link href="#contact" className="hover:text-[var(--brand)]">{t("footer.support")}</Link></li>
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
