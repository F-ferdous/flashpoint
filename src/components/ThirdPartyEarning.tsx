export default function ThirdPartyEarning() {
  return (
    <section id="third-party-earning" className="relative overflow-hidden bg-[var(--background)]">
      {/* ambient top glow and starry sprinkle */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-72 w-[46rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Heading */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-foreground/80">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            Earn with Third‑Party Offers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How to Earn <span className="bg-gradient-to-r from-fuchsia-400 via-rose-300 to-[var(--brand)] bg-clip-text text-transparent">step‑by‑step</span>
          </h2>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto">
            Create your account, engage with offers, and collect points directly from your dashboard.
          </p>
        </div>

        {/* Panels row (design signature inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Create Account */}
          <article className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/90 p-5 sm:p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.55)] hover:border-[var(--brand-25)]">
            {/* top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)]/70 to-transparent" />
            {/* icon */}
            <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 p-2.5 text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M20 8v6" />
                <path d="M23 11h-6" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Create an Account</h3>
            <p className="mt-1 text-sm text-foreground/70">Sign up and verify your profile to access your earning dashboard.</p>
            {/* footer chip */}
            <div className="mt-4 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/85">Step 1</div>
          </article>

          {/* 2. Watch Ads */}
          <article className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/90 p-5 sm:p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.55)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)]/70 to-transparent" />
            <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 p-2.5 text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Watch Ads</h3>
            <p className="mt-1 text-sm text-foreground/70">Complete short ad views to earn points instantly.</p>
            <div className="mt-4 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/85">Step 2</div>
          </article>

          {/* 3. Install Apps */}
          <article className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/90 p-5 sm:p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.55)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)]/70 to-transparent" />
            <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 p-2.5 text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
                <path d="M12 8v7" />
                <path d="M9.5 12.5 12 15l2.5-2.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Install Apps</h3>
            <p className="mt-1 text-sm text-foreground/70">Choose offers, install apps from your dashboard, and complete tasks.</p>
            <div className="mt-4 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/85">Step 3</div>
          </article>

          {/* 4. Earn Points */}
          <article className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface)]/90 p-5 sm:p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-20px_rgba(0,0,0,0.55)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)]/70 to-transparent" />
            <div className="mb-3 inline-flex items-center justify-center rounded-xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-black/10 to-black/5 dark:from-white/10 dark:to-white/5 p-2.5 text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <ellipse cx="12" cy="5" rx="8" ry="3" />
                <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
                <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Earn Points</h3>
            <p className="mt-1 text-sm text-foreground/70">Points add up across all activities. Redeem or convert anytime.</p>
            <div className="mt-4 text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/85">Step 4</div>
          </article>
        </div>
      </div>
    </section>
  );
}
