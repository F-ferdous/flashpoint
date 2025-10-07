"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function EarningLandingPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const r1 = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>();
  const r3 = useReveal<HTMLDivElement>();

  return (
    <div
      className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-foreground transition-opacity duration-700 ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Ambient cool glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[60rem] rounded-full bg-[var(--brand)]/15 blur-3xl" />
      </div>

      {/* Hero / Intro */}
      <section className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-15)] px-3 py-1 text-xs font-medium text-foreground ring-1 ring-[var(--brand-25)]">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            {t("thirdParty.badge")}
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            <span>{t("thirdParty.title")}</span>
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-600 bg-clip-text text-transparent">{t("thirdParty.title_highlight")}</span>
          </h1>
          <p className="mt-3 text-sm text-foreground/70">{t("thirdParty.subtitle")}</p>

          {/* Coming soon notice */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)]/70 px-3 py-1 text-[11px] ring-1 ring-black/10 dark:ring-white/10">
            <svg className="h-3.5 w-3.5 text-[var(--brand)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
            </svg>
            <span className="opacity-80">{t("coming.badge")} — {t("coming.title")}</span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section ref={r1} className="mt-12 sm:mt-16 reveal">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              title: t("thirdParty.step1_title"),
              desc: t("thirdParty.step1_desc"),
              n: 1,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
                </svg>
              ),
            },
            {
              title: t("thirdParty.step2_title"),
              desc: t("thirdParty.step2_desc"),
              n: 2,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4 5h16v10H4z" /><path d="M2 19h20v2H2z" />
                </svg>
              ),
            },
            {
              title: t("thirdParty.step3_title"),
              desc: t("thirdParty.step3_desc"),
              n: 3,
              icon: (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 3h10a2 2 0 0 1 2 2v14l-7-3-7 3V5a2 2 0 0 1 2-2z" />
                </svg>
              ),
            },
          ].map((card) => (
            <article
              key={card.n}
              className="group relative rounded-2xl border p-5 sm:p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.35)]"
              style={{
                background: card.n === 2 ? "var(--card-lime)" : "var(--card-mint)",
                borderColor: card.n === 2 ? "var(--card-lime-border)" : "var(--card-mint-border)",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)]/70 to-transparent" />
              <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 p-2.5 text-foreground">
                {card.icon}
              </div>
              <h3 className="text-base font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{card.desc}</p>
              <div className="mt-4 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/85">
                {t("thirdParty.step_label", { n: card.n })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Additional Ways to Earn */}
      <section ref={r2} className="mt-12 sm:mt-16 reveal">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/50 backdrop-blur-md p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 p-5 bg-[var(--surface)]/70">
              <h4 className="font-semibold">{t("points.c1_title")}</h4>
              <p className="mt-1 text-sm text-foreground/70">{t("points.c1_desc")}</p>
            </div>
            <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 p-5 bg-[var(--surface)]/70">
              <h4 className="font-semibold">{t("points.c2_title")}</h4>
              <p className="mt-1 text-sm text-foreground/70">{t("points.c2_desc")}</p>
            </div>
            <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 p-5 bg-[var(--surface)]/70">
              <h4 className="font-semibold">{t("points.c3_title")}</h4>
              <p className="mt-1 text-sm text-foreground/70">{t("points.c3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={r3} className="mt-12 sm:mt-16 reveal">
        <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/50 backdrop-blur-md overflow-hidden">
          {/* soft gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[color:oklch(0.92_0.06_160)]/40 via-transparent to-[color:oklch(0.9_0.05_160)]/40" />
          <div className="relative p-6 sm:p-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-15)] px-3 py-1 text-xs font-medium text-foreground ring-1 ring-[var(--brand-25)]">
              {t("coming.badge")}
            </div>
            <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight">
              {t("coming.title")}
            </h3>
            <p className="mt-2 text-sm text-foreground/70 max-w-2xl mx-auto">{t("coming.desc")}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/" className="btn-pill px-5 py-2.5 text-sm font-semibold btn-brand">
                {t("coming.cta_home")}
              </Link>
              <Link href="/contact" className="btn-pill px-5 py-2.5 text-sm font-semibold btn-brand-outline">
                {t("coming.cta_contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* reveal animation */
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity 700ms ease, transform 700ms ease; }
        .reveal-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </div>
  );
}
