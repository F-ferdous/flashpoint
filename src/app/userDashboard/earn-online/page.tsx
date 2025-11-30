"use client";

import Image from "next/image";

export default function EarnOnlinePage() {
  return (
    <div className="min-h-[60vh] p-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          সুখবর! সুখবর! এখন ঘরে বসেই আয় করুন FSA Rewards অ্যাপ দিয়ে!
        </h1>
      </div>
      <p className="text-foreground/80">
        মোবাইল দিয়ে ছোট ছোট কাজ করে হাতখরচ চালাতে চান? নিয়ে এলাম সম্পূর্ণ নতুন
        FSA Rewards অ্যাপ! ডিসেম্বর ২০২৫ পর্যন্ত ফ্রি রেজিষ্ট্রেশন সুযোগ!
      </p>

      <div className="mt-6">
        <p className="font-semibold text-emerald-600 dark:text-emerald-300">
          কী কী কাজ করে আয় করবেন?
        </p>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1 list-disc list-inside text-foreground/80">
          <li>অ্যাড এবং ভিডিও দেখে</li>
          <li>যোগ অংক সমাধান করে</li>
          <li>গেম খেলে</li>
          <li>লাকি স্পিন করে</li>
          <li>ওয়েবসাইট ও ব্লগসাইট ভিজিট করে</li>
          <li>স্ক্র্যাচ করে</li>
          <li>বন্ধুদের রেফার করে বড় বোনাস</li>
          <li>ছোট ছোট টাস্ক কমপ্লিট করে</li>
          <li>সার্ভে করে</li>
        </ul>
      </div>

      <div className="mt-6 space-y-2 text-foreground/90">
        <p>
          💰 পেমেন্ট মেথড: নির্দিষ্ট পয়েন্ট হলেই টাকা তুলুন সরাসরি বিকাশ, নগদ বা
          রকেটে।
        </p>
        <p>📲 এখনই ডাউনলোড করুন:</p>
      </div>

      <div className="mt-4">
        <a
          href="https://fsarewards.xyz/fsarewards.apk"
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-[var(--brand)] text-black px-4 py-2 text-sm font-medium hover:brightness-110"
        >
          অ্যাপ ডাউনলোড করুন
        </a>
      </div>

      <p className="mt-6 text-sm text-foreground/70">
        যেকোনো সাপোর্টের জন্য জয়েন করুন আমাদের টেলিগ্রাম ও হোয়াটসএপ গ্রুপে।
      </p>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          href="https://chat.whatsapp.com/JikKABk8kaeL1FrCFmfnuZ?mode=hqrt2"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface)]/80"
        >
          WhatsApp গ্রুপ
        </a>
        <a
          href="https://t.me/+dSedQpifwWU3NWE9"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface)]/80"
        >
          Telegram গ্রুপ
        </a>
        <a
          href="https://www.facebook.com/share/1BrzwLf2gW/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-[var(--surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface)]/80"
        >
          Facebook পেজ
        </a>
      </div>

      <div className="mt-10">
        <p className="font-semibold text-emerald-600 dark:text-emerald-300">
          ভিডিওতে দেখুন কিভাবে কাজ করবেন
        </p>
        <div className="mt-4 relative w-full h-0 pb-[56.25%] overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-[var(--surface-2)]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/LSDKLMzyNnU"
            title="FSA Rewards Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="mt-10">
        <p className="font-semibold text-emerald-600 dark:text-emerald-300">
          অ্যাপে আয়ের ধাপসমূহ
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              className="overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-[var(--surface-2)]"
            >
              <Image
                src={`/assets/images/appwork/${n}.jpeg`}
                alt={`ধাপ ${n}`}
                width={800}
                height={1600}
                className="w-full h-auto object-cover"
              />
              <div className="px-3 py-2 text-sm text-foreground/80">
                ধাপ {n}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
