"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    // Placeholder: send to API or Firebase later
    await new Promise((r) => setTimeout(r, 900));
    console.log(Object.fromEntries(form.entries()));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <section className="relative min-h-[calc(100dvh-140px)] overflow-hidden bg-[var(--background)]">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(80%_80%_at_50%_0%,black,transparent)]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[48rem] rounded-full bg-[var(--brand)]/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <p className="inline-flex w-fit items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-full bg-[var(--brand-15)] border border-[var(--brand-25)] text-foreground/90">
              <span className="size-2 rounded-full bg-[var(--brand)]" />
              Create your account
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sign up for <span className="logo-flash">Flash</span>
              <span style={{ color: "var(--brand)" }}>Point</span>
            </h1>
            <p className="mt-2 text-sm text-foreground/70">Join to earn points, redeem, and access telemedicine securely.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 sm:p-6 glow-brand">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-sm text-foreground/80">Full Name</label>
                <input id="fullName" name="fullName" required placeholder="Jane Doe" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm text-foreground/80">Email</label>
                <input id="email" name="email" type="email" required placeholder="jane@example.com" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm text-foreground/80">Phone Number</label>
                <input id="phone" name="phone" type="tel" required placeholder="+8801XXXXXXXXX" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nidNumber" className="text-sm text-foreground/80">NID Number</label>
                <input id="nidNumber" name="nidNumber" required placeholder="XXXXXXXXXX" className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm text-foreground/80">Address</label>
                <textarea id="address" name="address" required placeholder="House, Road, City, ZIP" rows={3} className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]" />
              </div>
              <div className="sm:col-span-2 grid gap-2">
                <label htmlFor="nidFile" className="text-sm text-foreground/80">Upload NID (optional)</label>
                <input id="nidFile" name="nidFile" type="file" accept="image/*,application/pdf" className="block w-full text-sm text-foreground/80 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:px-3 file:py-2 file:text-black file:font-medium file:hover:brightness-110" />
                <p className="text-xs text-foreground/60">Supported: JPG, PNG, or PDF.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-foreground/60">By continuing you agree to our <Link href="#" className="underline hover:text-[var(--brand)]">Terms</Link> and <Link href="#" className="underline hover:text-[var(--brand)]">Privacy Policy</Link>.</p>
              <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] text-black px-4 py-2.5 text-sm font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)] focus:ring-offset-[var(--background-solid)] disabled:opacity-70">
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>Create account</>
                )}
              </button>
            </div>

            {submitted && (
              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-200">
                Thanks! Your sign up info has been captured locally. We’ll connect this to Firebase next.
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-sm text-foreground/70">
            Already have an account? <Link href="/login" className="underline hover:text-[var(--brand)]">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
