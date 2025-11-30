"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import districtsData from "@/lib/districts.json";
import { useI18n } from "@/lib/i18n";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";

export default function SignupPage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100dvh-140px)] grid place-items-center text-sm text-foreground/70">
          {t("signup.loading")}
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const DISTRICTS: string[] = ((districtsData as any).districts || []).map(
    (d: { name: string }) => d.name
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData(e.currentTarget);
      const referrerId = String(form.get("referrerId") || "").trim();
      const ageVal = Number.parseInt(String(form.get("age") || "").trim(), 10);
      if (!referrerId) {
        setError("Referrer ID is required.");
        setSubmitting(false);
        return;
      }
      if (!Number.isFinite(ageVal) || ageVal <= 0) {
        setError("Please enter a valid age.");
        setSubmitting(false);
        return;
      }
      const payload = {
        fullName: String(form.get("fullName") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        district: String(form.get("district") || ""),
        nidNumber: String(form.get("nidNumber") || ""),
        address: String(form.get("address") || ""),
        nidFile: null as any, // files are not stored here; upload can be added later
        Approved: "No",
        ReferrerID: referrerId,
        referrerUid: referrerId,
        Age: ageVal,
        Role: "Customer",
      };

      const [cEmailSnap, cPhoneSnap, pEmailSnap, pPhoneSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, "Customers"),
            where("email", "==", payload.email),
            limit(1)
          )
        ),
        getDocs(
          query(
            collection(db, "Customers"),
            where("phone", "==", payload.phone),
            limit(1)
          )
        ),
        getDocs(
          query(
            collection(db, "PendingUsers"),
            where("email", "==", payload.email),
            limit(1)
          )
        ),
        getDocs(
          query(
            collection(db, "PendingUsers"),
            where("phone", "==", payload.phone),
            limit(1)
          )
        ),
      ]);

      const emailDuplicate = !cEmailSnap.empty || !pEmailSnap.empty;
      const phoneDuplicate = !cPhoneSnap.empty || !pPhoneSnap.empty;

      if (emailDuplicate || phoneDuplicate) {
        if (emailDuplicate && phoneDuplicate) {
          setError("This email and phone number are already in use.");
        } else if (emailDuplicate) {
          setError("This email is already in use.");
        } else {
          setError("This phone number is already in use.");
        }
        setSubmitting(false);
        return;
      }

      await addDoc(collection(db, "PendingUsers"), payload as any);
      setSubmitted(true);
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      // Fail silently in UI; could add a toast if desired
    } finally {
      setSubmitting(false);
    }
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
              {t("signup.badge")}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t("signup.heading")}
              <>{t("common.brand_title")}</>
            </h1>
            <p className="mt-2 text-sm text-foreground/70">{t("signup.sub")}</p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)] p-5 sm:p-6 glow-brand"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fullName"
                  className="text-sm text-foreground/80"
                >
                  {t("signup.full_name")}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder={t("signup.full_name_ph")}
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              {/* Username removed per request */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm text-foreground/80">
                  {t("signup.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("signup.email_ph")}
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm text-foreground/80">
                  {t("signup.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("signup.phone_ph")}
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="referrerId" className="text-sm text-foreground/80">
                  Referrer ID
                </label>
                <input
                  id="referrerId"
                  name="referrerId"
                  required
                  placeholder="Enter your Referrer ID"
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="age" className="text-sm text-foreground/80">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={1}
                  required
                  placeholder="Your age"
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="district"
                  className="text-sm text-foreground/80"
                >
                  {t("signup.district")}
                </label>
                <select
                  id="district"
                  name="district"
                  required
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="" disabled>
                    {t("signup.district_select")}
                  </option>
                  {DISTRICTS.map((d: string) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="nidNumber"
                  className="text-sm text-foreground/80"
                >
                  {t("signup.nid")}
                </label>
                <input
                  id="nidNumber"
                  name="nidNumber"
                  required
                  placeholder={t("signup.nid_ph")}
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm text-foreground/80">
                  {t("signup.address")}
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  placeholder={t("signup.address_ph")}
                  rows={3}
                  className="w-full rounded-lg bg-[var(--surface)] dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="sm:col-span-2 grid gap-2">
                <label htmlFor="nidFile" className="text-sm text-foreground/80">
                  {t("signup.upload_nid")}
                </label>
                <input
                  id="nidFile"
                  name="nidFile"
                  type="file"
                  accept="image/*,application/pdf"
                  className="block w-full text-sm text-foreground/80 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--brand)] file:px-3 file:py-2 file:text-black file:font-medium file:hover:brightness-110"
                />
                <p className="text-xs text-foreground/60">
                  {t("signup.upload_supported")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-foreground/60">
                {t("signup.terms")}
                <Link href="#" className="underline hover:text-[var(--brand)]">
                  {t("signup.terms_terms")}
                </Link>{" "}
                {t("common.and", {
                  /* fallback if needed */
                }) || "and"}{" "}
                <Link href="#" className="underline hover:text-[var(--brand)]">
                  {t("signup.terms_privacy")}
                </Link>
                .
              </p>
              <button
                disabled={submitting}
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] text-black px-4 py-2.5 text-sm font-semibold shadow-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)] focus:ring-offset-[var(--background-solid)] disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {t("signup.creating")}
                  </>
                ) : (
                  <>{t("signup.create_account")}</>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {submitted && (
              <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-200">
                An Agent or Admin will Confirm.
              </div>
            )}
          </form>

          <p className="mt-4 text-center text-sm text-foreground/70">
            {t("signup.already")}{" "}
            <Link href="/login" className="underline hover:text-[var(--brand)]">
              {t("signup.login")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
