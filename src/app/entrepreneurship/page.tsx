"use client";

import Link from "next/link";

export default function EntrepreneurshipPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 overflow-hidden bg-[color:oklch(0.96_0.03_160)]">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold mb-6 shadow-sm">
              🚀 নতুন উদ্যোক্তাদের জন্য সুবর্ণ সুযোগ
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-emerald-900 leading-tight mb-6">
              নিজের স্বপ্ন পূরণ করুন, <br />
              <span className="text-[var(--brand)]">সফল উদ্যোক্তা</span> হোন
            </h1>
            <p className="text-base md:text-lg text-foreground/80 mb-8 leading-relaxed max-w-2xl">
              জিসা ফ্ল্যাশ এর উদ্যোগে শুরু হচ্ছে নতুন উদ্যোক্তা উন্নয়ন প্রজেক্ট। আমরা দিচ্ছি দক্ষতা উন্নয়ন, মূলধন সহায়তা এবং সঠিক গাইডলাইন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#apply" className="px-6 md:px-8 py-3 md:py-4 btn-pill btn-brand font-semibold text-center">
                আজই যুক্ত হোন
              </a>
              <a href="#about" className="px-6 md:px-4 py-3 md:py-2 btn-pill border border-black/10 dark:border-white/10 bg-white/80 hover:bg-white text-foreground font-semibold text-center">
                বিস্তারিত জানুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-[var(--surface-2)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--brand)] mb-1">হতে চান</h3>
              <p className="text-foreground/70 text-sm">সফল উদ্যোক্তা</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--brand)] mb-1">পেতে চান</h3>
              <p className="text-foreground/70 text-sm">বেস্ট প্রশিক্ষণ</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--brand)] mb-1">করতে চান</h3>
              <p className="text-foreground/70 text-sm">দেশ জুড়ে কার্যক্রম</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--brand)] mb-1">নিতে চান</h3>
              <p className="text-foreground/70 text-sm">মেন্টরশিপ সাপোর্ট</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-14 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-emerald-900 mb-4">
              আমাদের লক্ষ্য ও উদ্দেশ্য
            </h2>
            <div className="w-16 h-1 bg-[var(--brand)] mx-auto rounded" />
            <p className="mt-4 text-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
              GESA FLASH এর মূল মন্ত্র হলো মানুষের জীবনযাত্রার মান উন্নয়ন এবং স্বাবলম্বী করে তোলা।
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-[color:oklch(0.98_0.02_160)] p-6 md:p-8 rounded-2xl ring-1 ring-black/5 text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 text-xl md:text-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M14 6h7v2h-7zM3 6h9v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">জীবিকা উন্নয়ন (Livelihood)</h3>
              <p className="text-foreground/70 text-sm md:text-base">নতুন আয়ের উৎস তৈরি ও বিদ্যমান আয়ের উৎস আধুনিকায়নের মাধ্যমে টেকসই জীবিকা নিশ্চিত করা।</p>
            </div>

            <div className="bg-[color:oklch(0.98_0.02_160)] p-6 md:p-8 rounded-2xl ring-1 ring-black/5 text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 text-xl md:text-2xl group-hover:bg-green-600 group-hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M4 4h16v2H4zm2 4h12v2H6zm-2 4h8v2H4zm0 4h16v2H4z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">দক্ষতা বৃদ্ধি (Skill)</h3>
              <p className="text-foreground/70 text-sm md:text-base">আধুনিক প্রযুক্তির ব্যবহার এবং হাতে-কলমে প্রশিক্ষণের মাধ্যমে দক্ষ জনশক্তি গড়ে তোলা।</p>
            </div>

            <div className="bg-[color:oklch(0.98_0.02_160)] p-6 md:p-8 rounded-2xl ring-1 ring-black/5 text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 text-xl md:text-2xl group-hover:bg-red-600 group-hover:text-white transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                  <path d="M12 21C8 21 2 13 2 8a6 6 0 0112 0c0 5-6 13-2 13zm0-9a3 3 0 100-6 3 3 0 000 6z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">স্বাস্থ্য সুরক্ষা (Health)</h3>
              <p className="text-foreground/70 text-sm md:text-base">উদ্যোক্তাদের স্বাস্থ্য সুরক্ষা ও লিমিটলেস রেফার আয়ের সুবিধা।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 md:py-20 bg-[color:oklch(0.98_0.02_160)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2">
              <div className="rounded-2xl shadow-2xl w-full h-[280px] md:h-[400px] bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80')] bg-cover bg-center" />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-900 mb-6">
                কেন আমাদের সাথে যুক্ত হবেন?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-[var(--brand)] bg-[var(--brand)]/10 text-xl">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                      <path d="M4 4h16v2H4zm2 4h12v2H6zm-2 4h14v2H4zm0 4h10v2H4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-foreground">বিনামূল্যে প্রশিক্ষণ</h4>
                    <p className="text-foreground/70 mt-1 text-sm md:text-base">ব্যবসা ব্যবস্থাপনা, মার্কেটিং এবং ডিজিটাল স্কিল এর উপর বিশেষ প্রশিক্ষণ।</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-[var(--brand)] bg-[var(--brand)]/10 text-xl">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                      <path d="M12 3l4 8H8l4-8zm-6 10h12v2H6zm-2 4h16v2H4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-foreground">সহজ শর্তে মূলধন</h4>
                    <p className="text-foreground/70 mt-1 text-sm md:text-base">সেরা আইডিয়াগুলোর জন্য সীড ফান্ডিং এবং সহজ শর্তে ঋণের ব্যবস্থা।</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-[var(--brand)] bg-[var(--brand)]/10 text-xl">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                      <path d="M3 12l18-8-8 18-2-6-6-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold text-foreground">নেটওয়ার্কিং ও মার্কেটিং</h4>
                    <p className="text-foreground/70 mt-1 text-sm md:text-base">পণ্যের প্রচার এবং অভিজ্ঞ ব্যবসায়ীদের সাথে নেটওয়ার্কিং এর সুযোগ।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-14 md:py-20 bg-white">
        <div className="mx-auto max-w-3xl md:max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-xl ring-1 ring-black/10 overflow-hidden">
            <div className="bg-[var(--brand)] p-6 text-center text-white">
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">উদ্যোক্তা হিসেবে রেজিস্ট্রেশন করুন</h2>
              <p className="opacity-90 mt-2 text-sm md:text-base">আপনার তথ্য দিন, আমরা খুব শীঘ্রই যোগাযোগ করব</p>
            </div>
            <form className="p-6 md:p-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">আপনার নাম</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-lg ring-1 ring-black/10 focus:ring-2 focus:ring-[var(--brand)] outline-none transition bg-white" placeholder="সম্পূর্ণ নাম লিখুন" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">মোবাইল নম্বর</label>
                  <input type="tel" required className="w-full px-4 py-3 rounded-lg ring-1 ring-black/10 focus:ring-2 focus:ring-[var(--brand)] outline-none transition bg-white" placeholder="01XXXXXXXXX" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">ইমেইল (ঐচ্ছিক)</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg ring-1 ring-black/10 focus:ring-2 focus:ring-[var(--brand)] outline-none transition bg-white" placeholder="example@email.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">আপনার ব্যবসার ধরণ / আইডিয়া</label>
                <select className="w-full px-4 py-3 rounded-lg ring-1 ring-black/10 focus:ring-2 focus:ring-[var(--brand)] outline-none transition bg-white">
                  <option>কৃষি উদ্যোগ</option>
                  <option>ক্ষুদ্র ও কুটির শিল্প</option>
                  <option>আইটি ও ফ্রিল্যান্সিং</option>
                  <option>ই-কমার্স / এফ-কমার্স</option>
                  <option>অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">আপনার সম্পর্কে বা ব্যবসার পরিকল্পনা সম্পর্কে সংক্ষেপে লিখুন</label>
                <textarea rows={4} required className="w-full px-4 py-3 rounded-lg ring-1 ring-black/10 focus:ring-2 focus:ring-[var(--brand)] outline-none transition bg-white" placeholder="বিস্তারিত লিখুন..." />
              </div>

              <button type="submit" className="w-full btn-pill bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/90 text-foreground font-semibold text-lg py-4">
                জমা দিন
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
