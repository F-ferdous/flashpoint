"use client";

export default function HealthPillar() {
  return (
    <section className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center text-center px-4">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,83,45,0.85), rgba(20,83,45,0.75)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto max-w-4xl text-white">
          <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-4 inline-block">
            স্বাস্থ্য স্তম্ভ (Health Pillar)
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            সুস্থ জীবন, সমৃদ্ধ ভবিষ্যৎ
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            জিসা ফ্লাশ প্রোগ্রামের মাধ্যমে আমরা পৌঁছে দিচ্ছি মানসম্মত
            স্বাস্থ্যসেবা, সুবিধাবঞ্চিত মানুষের দোরগোড়ায়।
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="text-lg btn-pill px-8 py-3 font-semibold btn-brand hover:opacity-90 transition"
            >
              আমাদের সেবাসমূহ
            </a>
            <a
              href="#volunteer"
              className="text-lg text-white btn-pill px-8 py-3 font-semibold btn-brand-outline hover:opacity-90 transition"
            >
              আজই যোগ দিন
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Medical Camp"
                className="rounded-2xl shadow-2xl w-full object-cover h-96"
              />
              <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-6 rounded-xl shadow-xl hidden md:block">
                <p className="text-4xl font-bold">১০,০০০+</p>
                <p className="text-sm">মানুষকে সেবা প্রদান</p>
              </div>
            </div>
            <div>
              <h2 className="text-emerald-700 font-semibold uppercase tracking-wide mb-2">
                আমাদের উদ্দেশ্য
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                F.L.A.S.H. এর 'H' মানেই সুস্বাস্থ্য
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                জিসা ফ্ল্যাশ বিশ্বাস করে যে স্বাস্থ্যই সকল সুখের মূল। আমাদের
                'হেলথ পিলার' বা স্বাস্থ্য স্তম্ভের মূল লক্ষ্য হলো সমাজের সকল
                জনগোষ্ঠীর স্বাস্থ্যসেবা নিশ্চিত করা এবং স্বাস্থ্য সচেতনতা বৃদ্ধি
                করা।
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-600 mr-3 text-xl" aria-hidden>
                    ✔
                  </span>
                  বিনামূল্যে চিকিৎসা পরামর্শ
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-600 mr-3 text-xl" aria-hidden>
                    ✔
                  </span>
                  মা ও শিশু স্বাস্থ্য সুরক্ষা
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-emerald-600 mr-3 text-xl" aria-hidden>
                    ✔
                  </span>
                  পুষ্টি ও পরিচ্ছন্নতা বিষয়ক সচেতনতা
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-emerald-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              আমাদের মূল স্বাস্থ্য সেবাসমূহ
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              আমরা যে সকল ক্ষেত্রে বিশেষ সেবা প্রদান করে থাকি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  🩺
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ফ্রি মেডিকেল ক্যাম্প
              </h3>
              <p className="text-gray-600">
                গ্রামাঞ্চল ও বস্তি এলাকায় নিয়মিত ফ্রি মেডিকেল ক্যাম্পের আয়োজন,
                যেখানে অভিজ্ঞ ডাক্তার দ্বারা বিনামূল্যে রোগী দেখা হয়।
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  👶
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                মা ও শিশু স্বাস্থ্য
              </h3>
              <p className="text-gray-600">
                গর্ভবতী মায়েদের চেকআপ, পরামর্শ এবং নবজাতকের প্রয়োজনীয় টিকা ও
                পুষ্টি নিশ্চিত করতে বিশেষ কার্যক্রম।
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  💊
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                বিনামূল্যে ঔষধ বিতরণ
              </h3>
              <p className="text-gray-600">
                দরিদ্র ও অসহায় রোগীদের জন্য ডাক্তারের প্রেসক্রিপশন অনুযায়ী
                প্রয়োজনীয় ঔষধ বিনামূল্যে প্রদান করা হয়।
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  🎥
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                টেলিমেডিসিন সেবা
              </h3>
              <p className="text-gray-600">
                দূর্গম এলাকার মানুষের জন্য ভিডিও কলের মাধ্যমে শহরের বিশেষজ্ঞ
                ডাক্তারদের পরামর্শ নেওয়ার সুব্যবস্থা।
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  ❤️
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                স্বাস্থ্য সচেতনতা
              </h3>
              <p className="text-gray-600">
                মহামারী প্রতিরোধ, হাত ধোয়া এবং স্যানিটেশন বিষয়ে স্কুল ও কমিউনিটি
                পর্যায়ে সচেতনতামূলক ওয়ার্কশপ।
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  👁️
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                চক্ষু শিবির
              </h3>
              <p className="text-gray-600">
                বয়োজেষ্ঠ্যদের জন্য ছানি অপারেশন ও চক্ষু পরীক্ষার বিশেষ
                ক্যাম্পেইন আয়োজন করা হয়।
              </p>
            </div>

            {/* Service 7 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-8 border-t-4 border-emerald-500 group md:col-start-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition duration-300">
                <span
                  className="text-2xl text-emerald-600 group-hover:text-white"
                  aria-hidden
                >
                  🪪
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                হেলথ কার্ড
              </h3>
              <p className="text-gray-600">
                সারাদেশের যে কোন স্থান থেকে ফ্রি টেলিমেডিসিনসহ অন্যান্য মেডিকেল
                সেবা নিন ডিসকাউন্ট মূল্যে!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer/CTA */}
      <section
        id="volunteer"
        className="py-16 bg-emerald-900 text-white text-center px-4"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            আপনিও হতে পারেন এই মহৎ কাজের অংশীদার
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            জিসা ফ্ল্যাশ প্রোগ্রামের স্বাস্থ্য কার্যক্রমে স্বেচ্ছাসেবক হিসেবে
            যোগ দিন অথবা অনুদান দিয়ে আমাদের পাশে দাঁড়ান।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/coming-soon"
              className="text-md btn-pill px-8 py-3 font-bold bg-white text-emerald-900 shadow hover:bg-gray-100 transition"
            >
              স্বেচ্ছাসেবক হোন
            </a>
            <a
              href="/coming-soon"
              className="text-md btn-pill px-8 py-3 font-bold btn-brand-outline hover:opacity-90 transition"
            >
              দান করুন
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
