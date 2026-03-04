"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useI18n } from "@/lib/i18n";

export default function ApplyCardPage() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nid, setNid] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await addDoc(collection(db, "CardRegistration"), {
        name,
        age,
        phone,
        address,
        occupation,
        nid,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setName("");
      setAge("");
      setPhone("");
      setAddress("");
      setOccupation("");
      setNid("");
    } catch (err: any) {
      setError(err?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-900">
            {t("gesa.apply_title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-900/80">
            {t("gesa.apply_desc")}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 p-4 text-center font-medium">
            {t("gesa.apply_success")}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-sm ring-1 ring-emerald-100 p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1">
                {t("gesa.apply_name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  {t("gesa.apply_age")}
                </label>
                <input
                  type="number"
                  min={0}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  {t("gesa.apply_phone")}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-1">
                {t("gesa.apply_address")}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
                className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  {t("gesa.apply_occupation")}
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  required
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-1">
                  {t("gesa.apply_nid")}
                </label>
                <input
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  required
                  className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-pill px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? t("gesa.apply_submitting") : t("gesa.apply_submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
