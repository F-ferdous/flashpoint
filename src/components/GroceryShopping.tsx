import Link from "next/link";

export default function GroceryShopping() {
  return (
    <section
      id="grocery-shopping"
      className="relative overflow-hidden bg-[var(--background)]"
    >
      {/* Ambient arcs and glow similar to ContactCTA */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[22rem] w-[54rem] rounded-full bg-[var(--brand)]/20 blur-3xl opacity-40" />
        <div className="absolute inset-x-0 top-16 mx-auto max-w-5xl h-[420px] rounded-[999px] border border-white/5 opacity-30" />
        <div className="absolute inset-x-10 top-28 mx-auto max-w-4xl h-[360px] rounded-[999px] border border-white/5 opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Floating badge */}
        <div className="mx-auto mb-6 size-14 sm:size-16 rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-cyan-300 to-[var(--brand)] shadow-[0_10px_40px_-10px_var(--brand-45)]">
          <div className="h-full w-full rounded-2xl bg-[var(--surface)] grid place-items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden
              className="text-white/90"
            >
              <defs>
                <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" style={{ stopColor: 'var(--brand)' }} />
                </linearGradient>
              </defs>
              <path
                d="M4 6h2l2.4 9.6A2 2 0 0 0 10.35 17H17a2 2 0 0 0 1.94-1.5L20 10H8"
                fill="none"
                stroke="url(#g2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="url(#g2)" />
              <circle cx="17" cy="20" r="1.5" fill="url(#g2)" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Grocery & Shopping
        </h2>
        <p className="mt-2 text-sm text-foreground/70 max-w-xl mx-auto">
          Convenient grocery orders and in-app shopping integrations to earn and
          redeem points.
        </p>

        {/* Coming soon banner */}
        <div className="mt-6">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-4 text-md font-medium text-black shadow-[0_10px_40px_-10px_var(--brand-60)] focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              background:
                "linear-gradient(135deg, rgba(240,171,252,.9), rgba(253,164,175,.95), var(--brand))",
            }}
          >
            Coming Soon
          </Link>
        </div>

        {/* Optional CTA disabled */}
      </div>
    </section>
  );
}
