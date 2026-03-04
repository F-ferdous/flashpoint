"use client";

import { useRef, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ObserverApplicationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [fileErrors, setFileErrors] = useState<{
    photo?: string;
    cert?: string;
    nid?: string;
    sig?: string;
  }>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // previews
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [nidFileName, setNidFileName] = useState<string | null>(null);
  const [nidUrl, setNidUrl] = useState<string | null>(null);
  const [sigUrl, setSigUrl] = useState<string | null>(null);

  // file inputs
  const photoRef = useRef<HTMLInputElement | null>(null);
  const certRef = useRef<HTMLInputElement | null>(null);
  const nidRef = useRef<HTMLInputElement | null>(null);
  const sigRef = useRef<HTMLInputElement | null>(null);

  function onFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "photo" | "cert" | "nid" | "sig"
  ) {
    const f = e.target.files?.[0];
    if (!f) return;
    const MAX = 1 * 1024 * 1024; // 1MB
    if (f.size > MAX) {
      setFileErrors((prev) => ({
        ...prev,
        [kind]: "ফাইলের সর্বোচ্চ সাইজ 1MB",
      }));
      e.target.value = "";
      return;
    } else {
      setFileErrors((prev) => ({ ...prev, [kind]: undefined }));
    }

    if (kind === "photo" || kind === "sig") {
      if (!f.type.startsWith("image/")) {
        setFileErrors((prev) => ({
          ...prev,
          [kind]: "শুধুমাত্র ছবি আপলোড করা যাবে",
        }));
        e.target.value = "";
        return;
      }
      const url = URL.createObjectURL(f);
      if (kind === "photo") setPhotoUrl(url);
      if (kind === "sig") setSigUrl(url);
    } else {
      if (!(f.type === "application/pdf" || f.type.startsWith("image/"))) {
        setFileErrors((prev) => ({
          ...prev,
          [kind]: "শুধুমাত্র JPG, PNG অথবা PDF ফাইল আপলোড করুন",
        }));
        e.target.value = "";
        return;
      }
      if (kind === "cert") {
        setCertFileName(f.name);
        setCertUrl(
          f.type === "application/pdf" ? null : URL.createObjectURL(f)
        );
      }
      if (kind === "nid") {
        setNidFileName(f.name);
        setNidUrl(f.type === "application/pdf" ? null : URL.createObjectURL(f));
      }
    }
  }

  function remove(
    kind: "photo" | "cert" | "nid" | "sig",
    input?: HTMLInputElement | null
  ) {
    if (input) input.value = "";
    if (kind === "photo") setPhotoUrl(null);
    if (kind === "sig") setSigUrl(null);
    if (kind === "cert") {
      setCertFileName(null);
      setCertUrl(null);
    }
    if (kind === "nid") {
      setNidFileName(null);
      setNidUrl(null);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    setFileErrors({});
    e.preventDefault();

    // gather inputs and validate empties for inline errors
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newFieldErrors: Record<string, string> = {};
    const requiredNames = [
      "fullName",
      "dob",
      "nidNumber",
      "address",
      "mobile",
      "education",
      "ref1_text",
      "declaration",
    ];
    requiredNames.forEach((n) => {
      const v = (fd.get(n) as string) || "";
      if (!v.trim()) newFieldErrors[n] = "এই ঘরটি আবশ্যক";
    });

    // mobile format check
    const mob = (fd.get("mobile") as string) || "";
    if (!/^[0-9]{11}$/.test(mob))
      newFieldErrors.mobile = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন";

    // dob format check: allow any non-digit separators (/, ., -, space)
    const dobStr = ((fd.get("dob") as string) || "").trim();
    const parts = dobStr.split(/\D+/).filter(Boolean);
    if (parts.length !== 3) {
      newFieldErrors.dob = "dd/mm/yyyy ফরম্যাটে লিখুন";
    } else {
      const [dd, mm, yyyy] = parts.map((v) => parseInt(v, 10));
      if (
        !Number.isFinite(dd) ||
        !Number.isFinite(mm) ||
        !Number.isFinite(yyyy) ||
        mm < 1 ||
        mm > 12 ||
        dd < 1 ||
        dd > 31 ||
        yyyy < 1900
      ) {
        newFieldErrors.dob = "সঠিক তারিখ দিন (dd/mm/yyyy)";
      }
    }

    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) return;

    // ensure files
    const photo = photoRef.current?.files?.[0];
    const errs: typeof fileErrors = {};
    if (!photo) errs.photo = "এই ফাইলটি আবশ্যক";
    if (errs.photo) {
      setFileErrors((prev) => ({ ...prev, ...errs }));
      return;
    }

    // collect payload
    const payload = {
      name: fd.get("fullName") as string,
      dob: fd.get("dob") as string,
      nidNumber: fd.get("nidNumber") as string,
      address: fd.get("address") as string,
      mobile: fd.get("mobile") as string,
      education: fd.get("education") as string,
      ref1Text: fd.get("ref1_text") as string,
    };

    try {
      setSubmitting(true);
      const ts = Date.now();
      const pSnap = await uploadBytes(
        ref(storage, `electionObserver/${ts}/photo`),
        photo!
      );
      const photoURL = await getDownloadURL(pSnap.ref);

      await addDoc(collection(db, "ElectionObserverForm"), {
        ...payload,
        files: { photoURL },
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("দুঃখিত! আবেদন জমা দিতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-300 text-xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-900">
            পর্যবেক্ষক আবেদন ফরম (EO-2)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            প্রদত্ত নির্দেশনা অনুযায়ী তথ্য প্রদান করুন।
          </p>
        </div>

        {!success ? (
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl bg-[var(--surface-2)] ring-1 ring-black/10 dark:ring-white/10 p-6 md:p-8 space-y-6"
          >
            {/* <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3">
              <p className="text-base md:text-lg font-semibold">
                সময়সীমা: ২০/১২/২০২৫ সকাল ১০ টা পর্যন্ত
              </p>
            </div> */}
            <p className="text-sm text-muted-foreground">
              অনুগ্রহ করে সঠিক তথ্য প্রদান করুন। জাতীয় পরিচয়পত্র অনুযায়ী নাম
              ও তথ্য লিখুন।
            </p>

            <div>
              <p className="text-base md:text-lg text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 mb-3 font-medium">
                অনুগ্রহ করে নির্বাচন কমিশনের ডকুমেন্ট EO-2 সম্পূর্ণ পূরণ করে
                প্রশিক্ষনের দিন/নির্ধারিত দিন সাথে নিয়ে আসুন। প্রশিক্ষনের তারিখ
                পরবর্তীতে জানিয়ে দেয়া হবে।
              </p>
              <h3 className="text-lg font-semibold border-l-4 border-emerald-600 pl-3">
                ব্যক্তিগত তথ্য
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                পূর্ণ নাম (বাংলায়)
              </label>
              <input
                type="text"
                name="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-emerald-500"
                placeholder="জাতীয় পরিচয়পত্র অনুযায়ী আপনার নাম"
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  জন্মতারিখ
                </label>
                <input
                  type="text"
                  name="dob"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="day/month/year"
                  className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-emerald-500"
                />
                {fieldErrors.dob && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.dob}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  জাতীয় পরিচয়পত্র (NID) নম্বর
                </label>
                <input
                  type="number"
                  name="nidNumber"
                  className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-emerald-500"
                  placeholder="১০/১৩/১৭ ডিজিট"
                />
                {fieldErrors.nidNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.nidNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                ভোটার এলাকা (নির্বাচনী আসন উল্লেখ করুন)
              </label>
              <textarea
                rows={2}
                name="address"
                className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-emerald-500"
                placeholder="নির্বাচনী আসন উল্লেখ করুন"
              />
              {fieldErrors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-emerald-500"
                  placeholder="01XXXXXXXXX"
                />
                {fieldErrors.mobile && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.mobile}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  ১১ ডিজিটের নম্বর দিন
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  সর্বশেষ শিক্ষাগত যোগ্যতা
                </label>
                <select
                  name="education"
                  className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white focus:outline-none focus:ring-েমেরাল্ড-500"
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="SSC">এস.এস.সি / সমমান</option>
                  <option value="HSC">এইচ.এস.সি / সমমান</option>
                  <option value="Bachelor">স্নাতক / অনার্স / সমমান</option>
                  <option value="Masters">স্নাতকোত্তর / মাস্টার্স</option>
                  <option value="PhD">পিএইচডি / অন্যান্য</option>
                </select>
                {fieldErrors.education && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.education}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-l-4 border-emerald-600 pl-3">
                রেফারেন্স তথ্য
              </h3>
              <div className="grid gap-4 mt-4">
                <div className="bg-[var(--surface-1)] rounded-lg ring-1 ring-black/10 dark:ring-white/10 p-4">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    রেফারেন্স
                  </h4>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-white"
                    placeholder="রেফারেন্স সংক্রান্ত তথ্য"
                    name="ref1_text"
                    rows={3}
                  />
                  {fieldErrors.ref1_text && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.ref1_text}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold border-l-4 border-emerald-600 pl-3">
                প্রয়োজনীয় কাগজপত্র
              </h3>
              <div className="grid gap-6 mt-4">
                {/* Photo */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    পাসপোর্ট সাইজ ছবি{" "}
                    <span className="text-xs text-muted-foreground">
                      (Max 1MB)
                    </span>
                  </label>
                  <div className="relative border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={photoRef}
                      onChange={(e) => onFileSelect(e, "photo")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="preview"
                        className="max-h-48 mx-auto object-contain"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ছবি নির্বাচন করতে ক্লিক করুন
                      </p>
                    )}
                    {photoUrl && (
                      <button
                        type="button"
                        onClick={(e) => remove("photo", photoRef.current)}
                        className="mt-2 text-sm text-red-600"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    {fileErrors.photo && (
                      <p className="mt-2 text-xs text-red-600">
                        {fileErrors.photo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Certificate - commented out as requested */}
                {/**
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    শিক্ষাগত সনদ{" "}
                    <span className="text-xs text-muted-foreground">
                      (Max 1MB)
                    </span>
                  </label>
                  <div className="relative border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      ref={certRef}
                      onChange={(e) => onFileSelect(e, "cert")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {certFileName ? (
                      <p className="text-sm font-medium">{certFileName}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ফাইল নির্বাচন করুন (JPG/PNG/PDF)
                      </p>
                    )}
                    {certUrl && (
                      <img
                        src={certUrl}
                        alt="preview"
                        className="max-h-48 mx-auto object-contain mt-2"
                      />
                    )}
                    {certFileName && (
                      <button
                        type="button"
                        onClick={() => remove("cert", certRef.current)}
                        className="mt-2 text-sm text-red-600"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    {fileErrors.cert && (
                      <p className="mt-2 text-xs text-red-600">
                        {fileErrors.cert}
                      </p>
                    )}
                  </div>
                </div>
                */}

                {/* NID - commented out as requested */}
                {/**
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    জাতীয় পরিচয়পত্র (NID){" "}
                    <span className="text-xs text-muted-foreground">
                      (Max 1MB)
                    </span>
                  </label>
                  <div className="relative border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      ref={nidRef}
                      onChange={(e) => onFileSelect(e, "nid")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {nidFileName ? (
                      <p className="text-sm font-medium">{nidFileName}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ফাইল নির্বাচন করুন (JPG/PNG/PDF)
                      </p>
                    )}
                    {nidUrl && (
                      <img
                        src={nidUrl}
                        alt="preview"
                        className="max-h-48 mx-auto object-contain mt-2"
                      />
                    )}
                    {nidFileName && (
                      <button
                        type="button"
                        onClick={() => remove("nid", nidRef.current)}
                        className="mt-2 text-sm text-red-600"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    {fileErrors.nid && (
                      <p className="mt-2 text-xs text-red-600">
                        {fileErrors.nid}
                      </p>
                    )}
                  </div>
                </div>
                */}

                {/* Signature - commented out as requested */}
                {/**
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    স্বাক্ষর{" "}
                    <span className="text-xs text-muted-foreground">
                      (Max 1MB)
                    </span>
                  </label>
                  <div className="relative border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={sigRef}
                      onChange={(e) => onFileSelect(e, "sig")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {sigUrl ? (
                      <img
                        src={sigUrl}
                        alt="preview"
                        className="max-h-48 mx-auto object-contain"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        স্বাক্ষরের ছবি নির্বাচন করুন
                      </p>
                    )}
                    {sigUrl && (
                      <button
                        type="button"
                        onClick={() => remove("sig", sigRef.current)}
                        className="mt-2 text-sm text-red-600"
                      >
                        বাতিল করুন
                      </button>
                    )}
                    {fileErrors.sig && (
                      <p className="mt-2 text-xs text-red-600">
                        {fileErrors.sig}
                      </p>
                    )}
                  </div>
                </div>
                */}
              </div>
            </div>

            <div>
              <label className="inline-flex items-start gap-2 text-sm">
                <input type="checkbox" name="declaration" className="mt-1" />
                <span>আমি শপথ করছি যে প্রদত্ত সকল তথ্য ও কাগজপত্র সত্য।</span>
              </label>
              {fieldErrors.declaration && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.declaration}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-pill px-5 py-3 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70"
            >
              {submitting ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl bg-white ring-1 ring-emerald-200 p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-েমেরাল্ড-100 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-emerald-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1">
              Thank you for your interest, we will contact you soon.
            </h3>
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-left inline-block">
              <p className="text-base md:text-lg font-medium">
                অনুগ্রহ করে নির্বাচন কমিশনের ডকুমেন্ট EO-2 সম্পূর্ণ পূরণ করে
                প্রশিক্ষনের দিন/নির্ধারিত দিন সাথে নিয়ে আসুন। প্রশিক্ষনের তারিখ
                পরবর্তীতে জানিয়ে দেয়া হবে।
              </p>
            </div>
            <a
              href="https://drive.google.com/file/d/1F8J9HAd-QR-DaiHyoaSIbpZboynqfzJP/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block btn-pill px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Download EO-2 Form
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
