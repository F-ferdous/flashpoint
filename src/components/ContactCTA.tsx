import Link from "next/link";

export default function ContactCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--background)]">
      {/* Ambient arcs and glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[22rem] w-[54rem] rounded-full bg-[var(--brand)]/20 blur-3xl opacity-40" />
        {/* subtle arcs */}
        <div className="absolute inset-x-0 top-16 mx-auto max-w-5xl h-[420px] rounded-[999px] border border-white/5 opacity-30" />
        <div className="absolute inset-x-10 top-28 mx-auto max-w-4xl h-[360px] rounded-[999px] border border-white/5 opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* floating app badge */}
        <div className="mx-auto mb-6 size-14 sm:size-16 rounded-2xl p-[2px] bg-gradient-to-br from-fuchsia-400 via-rose-300 to-[var(--brand)] shadow-[0_10px_40px_-10px_var(--brand-45)]">
          <div className="h-full w-full rounded-2xl bg-[var(--surface)] grid place-items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="text-white/90">
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f0abfc" />
                  <stop offset="50%" stopColor="#fda4af" />
                  <stop offset="100%" style={{ stopColor: 'var(--brand)' }} />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="16" height="16" rx="4" fill="url(#g)" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to <span className="bg-gradient-to-r from-fuchsia-400 via-rose-300 to-[var(--brand)] bg-clip-text text-transparent">get in touch</span>?
        </h2>
        <p className="mt-2 text-sm text-foreground/70 max-w-xl mx-auto">
          No links wired yet — this is a UI-only landing page.
        </p>

        {/* CTA */}
        <div className="mt-6">
          <Link href="#" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-black shadow-[0_10px_40px_-10px_var(--brand-60)] focus:outline-none focus:ring-2 focus:ring-white/60" style={{
            background: "linear-gradient(135deg, rgba(240,171,252,.9), rgba(253,164,175,.95), var(--brand))"
          }}>
            Join waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
