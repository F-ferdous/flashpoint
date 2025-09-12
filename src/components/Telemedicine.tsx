export default function Telemedicine() {
  return (
    <section id="telemedicine" className="relative overflow-hidden bg-[var(--background)]">
      {/* subtle ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[48rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col gap-3 mb-8 sm:mb-10">
          <p className="inline-flex w-fit items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/90">
            <span className="size-2 rounded-full bg-[var(--brand)]" />
            Virtual Care
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Telemedicine <span style={{ color: "var(--brand)" }}>Built‑In</span>
          </h2>
          <p className="text-sm text-foreground/80 max-w-2xl">
            Secure virtual care with consultations, prescriptions, and records in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Card 1 */}
          <div className="group relative rounded-2xl border border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* video icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="5" width="11" height="14" rx="2" />
                  <path d="M14 10l7-4v12l-7-4z" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">On‑Demand Consults</h3>
                <p className="text-sm/6 text-foreground/70">
                  Book video or chat visits with licensed providers. Triage and wait‑time indicators.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl border border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* pill icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="8" width="8" height="13" rx="4" />
                  <rect x="13" y="3" width="8" height="13" rx="4" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">E‑Prescriptions</h3>
                <p className="text-sm/6 text-foreground/70">
                  Provider‑issued prescriptions with pharmacy integrations and refill reminders.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl border border-white/10 bg-[var(--surface-2)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[var(--brand-25)]">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-70" />
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground">
                {/* files icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Reports & History</h3>
                <p className="text-sm/6 text-foreground/70">
                  Store labs, visit notes, and invoices. Share securely with role‑based access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
