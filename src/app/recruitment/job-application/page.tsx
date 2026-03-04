"use client";

import { useRef, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function JobApplicationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileErrors, setFileErrors] = useState<{
    photo?: string;
    cert?: string;
    nid?: string;
  }>({});
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [certName, setCertName] = useState<string | null>(null);
  const [nidName, setNidName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // file inputs
  const photoRef = useRef<HTMLInputElement | null>(null);
  const certRef = useRef<HTMLInputElement | null>(null);
  const nidRef = useRef<HTMLInputElement | null>(null);

  function onFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "photo" | "cert" | "nid"
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
      if (kind === "photo") setPhotoName(null);
      if (kind === "cert") setCertName(null);
      if (kind === "nid") setNidName(null);
      return;
    }
    // allow images and pdf
    const isImage = f.type.startsWith("image/");
    const isPdf = f.type === "application/pdf";
    if (!isImage && !isPdf) {
      setFileErrors((prev) => ({
        ...prev,
        [kind]: "শুধুমাত্র JPG/PNG/JPEG অথবা PDF ফাইল আপলোড করুন",
      }));
      e.target.value = "";
      if (kind === "photo") setPhotoName(null);
      if (kind === "cert") setCertName(null);
      if (kind === "nid") setNidName(null);
      return;
    }
    setFileErrors((prev) => ({ ...prev, [kind]: undefined }));
    if (kind === "photo") setPhotoName(f.name);
    if (kind === "cert") setCertName(f.name);
    if (kind === "nid") setNidName(f.name);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFileErrors({});
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

    // validate required fields and simple formats (observer-style)
    const newFieldErrors: Record<string, string> = {};
    const requiredNames = [
      "position",
      "fullName",
      "dob",
      "nidNumber",
      "mobile",
      "address",
      "education",
      "experience",
      "declaration",
    ];
    requiredNames.forEach((n) => {
      const v = (fd.get(n) as string) || "";
      if (!String(v).trim()) newFieldErrors[n] = "এই ঘরটি আবশ্যক";
    });
    const mob = (fd.get("mobile") as string) || "";
    if (mob && !/^[0-9]{11}$/.test(mob)) {
      newFieldErrors.mobile = "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন";
    }
    if (Object.keys(newFieldErrors).length) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // ensure files present
    const photo = photoRef.current?.files?.[0];
    const cert = certRef.current?.files?.[0];
    const nid = nidRef.current?.files?.[0];
    const errs: typeof fileErrors = {};
    if (!photo) errs.photo = "এই ফাইলটি আবশ্যক";
    if (!cert) errs.cert = "এই ফাইলটি আবশ্যক";
    if (!nid) errs.nid = "এই ফাইলটি আবশ্যক";
    if (Object.keys(errs).length) {
      setFileErrors(errs);
      return;
    }

    const payload = {
      position: (fd.get("position") as string) || "",
      fullName: (fd.get("fullName") as string) || "",
      dob: (fd.get("dob") as string) || "",
      nidNumber: (fd.get("nidNumber") as string) || "",
      mobile: (fd.get("mobile") as string) || "",
      address: (fd.get("address") as string) || "",
      education: (fd.get("education") as string) || "",
      experience: (fd.get("experience") as string) || "",
    };

    try {
      setSubmitting(true);
      const ts = Date.now();
      const base = `jobApplication/${ts}`;

      const photoSnap = await uploadBytes(
        ref(storage, `${base}/photo`),
        photo!
      );
      const certSnap = await uploadBytes(ref(storage, `${base}/cert`), cert!);
      const nidSnap = await uploadBytes(ref(storage, `${base}/nid`), nid!);

      const [photoURL, certURL, nidURL] = await Promise.all([
        getDownloadURL(photoSnap.ref),
        getDownloadURL(certSnap.ref),
        getDownloadURL(nidSnap.ref),
      ]);

      await addDoc(collection(db, "RecruitmentApplication"), {
        ...payload,
        files: { photoURL, certURL, nidURL },
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      form.reset();
      if (photoRef.current) photoRef.current.value = "";
      if (certRef.current) certRef.current.value = "";
      if (nidRef.current) nidRef.current.value = "";
      setPhotoName(null);
      setCertName(null);
      setNidName(null);
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-600/10 text-teal-800 ring-1 ring-teal-300 text-xs">
            <span className="size-2 rounded-full bg-teal-500" />
            নিয়োগ বিজ্ঞপ্তি
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-900">
            GESA FLASH - চাকরির আবেদন ফরম
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            নির্দেশনা অনুযায়ী সঠিক তথ্য প্রদান করে আবেদন সম্পন্ন করুন।
          </p>
        </div>

        {!success ? (
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl bg-[var(--surface-2)] ring-1 ring-black/10 dark:ring-white/10 p-6 md:p-8 space-y-6"
          >
            <div className="bg-teal-50 ring-1 ring-teal-200 rounded-lg p-4">
              <label className="block text-sm font-bold text-teal-800 mb-2">
                যে পদের জন্য আবেদন
              </label>
              <select
                name="position"
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="প্রোগ্রাম ম্যানেজার ২০০০০/-">
                  প্রোগ্রাম ম্যানেজার ২০০০০/-
                </option>
                <option value="প্রোগ্রাম অফিসার ১৬০০০/-">
                  প্রোগ্রাম অফিসার ১৬০০০/-
                </option>
              </select>
              {fieldErrors.position && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.position}
                </p>
              )}
            </div>

            <div className="border-b pb-2">
              <h3 className="text-xl font-bold text-emerald-900">
                ব্যক্তিগত তথ্য
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  আবেদনকারীর পূর্ণ নাম
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="আপনার নাম লিখুন"
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  জন্ম তারিখ
                </label>
                <input
                  name="dob"
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="আপনার জন্মতারিখ লিখুন"
                />
                {fieldErrors.dob && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.dob}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  জাতীয় পরিচয় পত্র (NID) নম্বর
                </label>
                <input
                  name="nidNumber"
                  type="number"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="NID নম্বর লিখুন"
                />
                {fieldErrors.nidNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.nidNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  হোয়াটসএপ নম্বর
                </label>
                <input
                  name="mobile"
                  type="tel"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="01xxxxxxxxx"
                />
                {fieldErrors.mobile && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.mobile}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  বর্তমান ঠিকানা
                </label>
                <textarea
                  name="address"
                  rows={3}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="আপনার পূর্ণ ঠিকানা..."
                ></textarea>
                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.address}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b pb-2 mt-2">
              <h3 className="text-xl font-bold text-emerald-900">
                শিক্ষা ও অভিজ্ঞতা
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  সর্বশেষ শিক্ষাগত যোগ্যতা
                </label>
                <select
                  name="education"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">বাছাই করুন</option>
                  <option value="Masters">স্নাতকোত্তর / মাস্টার্স</option>
                  <option value="Bachelors">স্নাতক / অনার্স</option>
                  <option value="HSC">এইচ.এস.সি / সমমান</option>
                  <option value="Diploma">ডিপ্লোমা</option>
                  <option value="Other">অন্যান্য</option>
                </select>
                {fieldErrors.education && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.education}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  কাজের অভিজ্ঞতা (যদি থাকে)
                </label>
                <textarea
                  name="experience"
                  rows={3}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  placeholder="আপনার পূর্ববর্তী কাজের অভিজ্ঞতা সংক্ষেপে লিখুন"
                ></textarea>
                {fieldErrors.experience && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.experience}
                  </p>
                )}
              </div>
            </div>

            <div className="border-b pb-2 mt-2">
              <h3 className="text-xl font-bold text-emerald-900">
                প্রয়োজনীয় কাগজপত্র আপলোড
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                সর্বোচ্চ ফাইল সাইজ: ২ মেগাবাইট (ফরম্যাট: JPG, PNG, PDF)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                <input
                  ref={photoRef}
                  name="photo"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  required
                  onChange={(e) => onFileSelect(e, "photo")}
                  className="hidden"
                />
                <div className="text-gray-700 text-sm font-medium">
                  পাসপোর্ট সাইজ ছবি
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ফাইল বাছাই করুন
                </div>
                {photoName && (
                  <div className="text-xs mt-1 text-gray-700">{photoName}</div>
                )}
                {fileErrors.photo && (
                  <div className="text-red-600 text-xs mt-2">
                    {fileErrors.photo}
                  </div>
                )}
              </label>
              <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                <input
                  ref={certRef}
                  name="cert"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  required
                  onChange={(e) => onFileSelect(e, "cert")}
                  className="hidden"
                />
                <div className="text-gray-700 text-sm font-medium">
                  শিক্ষাগত সনদ
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ফাইল বাছাই করুন
                </div>
                {certName && (
                  <div className="text-xs mt-1 text-gray-700">{certName}</div>
                )}
                {fileErrors.cert && (
                  <div className="text-red-600 text-xs mt-2">
                    {fileErrors.cert}
                  </div>
                )}
              </label>
              <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
                <input
                  ref={nidRef}
                  name="nid"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  required
                  onChange={(e) => onFileSelect(e, "nid")}
                  className="hidden"
                />
                <div className="text-gray-700 text-sm font-medium">
                  জাতীয় পরিচয় পত্র
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ফাইল বাছাই করুন
                </div>
                {nidName && (
                  <div className="text-xs mt-1 text-gray-700">{nidName}</div>
                )}
                {fileErrors.nid && (
                  <div className="text-red-600 text-xs mt-2">
                    {fileErrors.nid}
                  </div>
                )}
              </label>
            </div>
            <div className="border-b pb-2 mt-2">
              <h3 className="text-xl font-bold text-emerald-900">
                পদের দায়িত্বসমূহের শর্ট লিস্ট (Key Responsibilities)
              </h3>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-[var(--foreground)]">
              <li>
                প্রকল্প বাস্তবায়ন: মাঠ পর্যায়ে প্রকল্পের লক্ষ্যমাত্রা অনুযায়ী
                কার্যক্রম পরিকল্পনা ও বাস্তবায়ন করা।
              </li>
              <li>
                মনিটরিং ও ইভালুয়েশন: কাজের মান যাচাই করা এবং নিয়মিত প্রগ্রেস
                রিপোর্ট (Weekly/Monthly) তৈরি করা।
              </li>
              <li>
                স্টেকহোল্ডার ম্যানেজমেন্ট: সরকারি কর্মকর্তা, স্থানীয় প্রতিনিধি
                এবং উপকারভোগীদের সাথে সুসম্পর্ক বজায় রাখা।
              </li>
              <li>
                বাজেট ব্যবস্থাপনা: প্রকল্পের বরাদ্দকৃত অর্থ যথাযথভাবে ব্যয় হচ্ছে
                কি না তা তদারকি করা।
              </li>
              <li>
                টিম লিডারশিপ: (ম্যানেজার পদের জন্য) কর্মীদের পরিচালনা করা এবং
                তাদের কাজের দিকনির্দেশনা দেওয়া।
              </li>
              <li>
                ডকুমেন্টেশন: কেস স্টাডি, সাফল্যের গল্প এবং ডাটাবেজ সংরক্ষণ করা।
              </li>
            </ul>

            {/*  <div className="border-b pb-2 mt-2">
              <h3 className="text-xl font-bold text-emerald-900">আবেদন ফি</h3>
            </div>
 */}
            {/*  <div className="rounded-lg p-6 ring-1 ring-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
              <p className="text-gray-700 font-medium">
                আবেদন ফি:{" "}
                <span className="text-2xl font-bold text-blue-800">৩০০ টাকা</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                পেমেন্টের পর প্রাপ্ত TrxID নিচে লিখুন।
              </p>
              <div className="mt-4 max-w-md mx-auto text-left bg-white p-4 rounded-lg ring-1 ring-blue-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  পেমেন্ট ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TrxID লিখুন"
                />
                <p className="text-xs text-red-500 mt-2">
                  <span className="font-medium">নোট:</span> TrxID না দিলে আবেদন জমা হবে না।
                </p>
              </div>
            </div> */}

            <div>
              <label className="inline-flex items-start gap-2 text-sm">
                <input
                  name="declaration"
                  type="checkbox"
                  required
                  className="mt-1"
                />
                <span>
                  আমি অঙ্গীকার করছি যে, উপরে প্রদত্ত সকল তথ্য সত্য এবং সঠিক।
                </span>
              </label>
              {fieldErrors.declaration && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.declaration}
                </p>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-pill px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:opacity-70"
              >
                {submitting ? "প্রসেসিং হচ্ছে..." : "আবেদন জমা দিন"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl bg-white ring-1 ring-green-300 p-8 text-center">
            <div className="text-green-600 text-5xl mb-2">✓</div>
            <h3 className="text-2xl font-bold mb-2">আবেদন সফল হয়েছে!</h3>
            <p className="text-muted-foreground">
              আপনার আবেদনটি জমা হয়েছে। পরবর্তী নির্দেশনার জন্য অপেক্ষা করুন।
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              নতুন আবেদন করুন
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
