import {
  ArrowRight,
  DownloadCloud,
  Sprout,
  Tractor,
  Store,
  Megaphone,
  Users,
  WifiOff,
  Building2,
  Zap,
  MapPin,
  Box,
  Gem,
  Star,
  Search,
  Headset,
} from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse" />
        <div
          className="absolute -bottom-10 -right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 text-xs font-bold tracking-wider mb-4 border border-orange-300 shadow-sm">
              🚀 অপারেশনাল ব্লুপ্রিন্ট ২০২৬
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              গ্রাম ও শহরে <br />
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-transparent bg-clip-text">
                সেবার নতুন দিগন্ত
              </span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              একটি ইউজার ফ্রেন্ডলি ইকোসিস্টেম যেখানে প্রযুক্তি এবং মানবিক
              সম্পর্ক মিলেমিশে কাজ করে। দেখুন কিভাবে আমরা প্রতিটি কাস্টমারের
              কাছে সেবা পৌঁছে দিই।
            </p>
          </div>
        </div>

        {/* Customer Journey */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <div className="h-1 w-12 bg-gray-300 rounded-full" />
            <h2 className="text-3xl font-bold text-gray-800">
              কাস্টমার জার্নি ম্যাপ
            </h2>
            <div className="h-1 w-12 bg-gray-300 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative z-10 group">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-cyan-500 h-full transform transition duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition group-hover:bg-cyan-200" />
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                  ১
                </div>
                <h3 className="font-bold text-xl mb-2 text-cyan-700">
                  রেজিস্ট্রেশন
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  স্মার্ট কার্ড ও অ্যাপ এক্সেস পাওয়ার প্রথম ধাপ। অনবোর্ডিং গিফট।
                </p>
              </div>
            </div>

            <div className="relative z-10 group">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-violet-500 h-full transform transition duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-violet-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition group-hover:bg-violet-200" />
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                  ২
                </div>
                <h3 className="font-bold text-xl mb-2 text-violet-700">
                  ভেন্ডর খুঁজুন
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  অ্যাপ ম্যাপ অথবা 'জিসা ফ্লাশ ফ্লাগ/স্টিকার' দেখে ভেরিফাইড
                  দোকান/ভেন্ডর চিনুন।
                </p>
              </div>
            </div>

            <div className="relative z-10 group">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-rose-500 h-full transform transition duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition group-hover:bg-rose-200" />
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                  ৩
                </div>
                <h3 className="font-bold text-xl mb-2 text-rose-700">
                  সেবা গ্রহণ
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  QR কোড স্ক্যান বা কার্ড সোয়াইপ করে ইনস্ট্যান্ট পেমেন্ট/পয়েন্ট
                  আদান প্রদান।
                </p>
              </div>
            </div>

            <div className="relative z-10 group">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-b-4 border-amber-500 h-full transform transition duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-full -mr-4 -mt-4 opacity-50 transition group-hover:bg-amber-200" />
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4">
                  ৪
                </div>
                <h3 className="font-bold text-xl mb-2 text-amber-700">
                  রিওয়ার্ড লাভ
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  ক্যাশব্যাক ওয়ালেটে জমা এবং সেবার মান রেটিং।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Strategy */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              হাইপার-লোকাল অপারেশন স্ট্র্যাটেজি
            </h2>
            <p className="text-gray-500 mt-2">
              গ্রাম ও শহরের জন্য সম্পূর্ণ ভিন্ন দুটি শক্তিশালী মডেল
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Rural */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-1 shadow-2xl hover:shadow-emerald-200/50 transition duration-500">
              <div className="h-full bg-white/60 backdrop-blur-md rounded-[20px] p-8 border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sprout className="w-32 h-32 text-emerald-600" />
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <Tractor className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text">
                      রুরাল (গ্রাম) স্ট্র্যাটেজি
                    </h3>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      TRUST BASED MODEL
                    </span>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition">
                    <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        ফ্লাশ হাব (Hub)
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        বাজারের বিশ্বস্ত মুদি দোকান/ফার্মেসি হবে আমাদের লোকাল
                        এজেন্ট/পার্টনার
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition">
                    <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        হাট-বার ক্যাম্পেইন
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        সাপ্তাহিক হাটের দিন সরাসরি কৃষকদের রেজিস্ট্রেশন ও স্পট
                        অফার।
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition">
                    <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        ফ্লাশ এজেন্ট (Agents)
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        বেকার যুবকদের লজিস্টিক বিও হিসেবে নিয়োগ, যারা পণ্য ও
                        সেবা বাড়ি বাড়ি পৌঁছে দেবে।
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition">
                    <div className="bg-emerald-500 text-white p-2 rounded-lg shrink-0">
                      <WifiOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        অফলাইন ফার্স্ট
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        ইন্টারনেট ছাড়াও USSD বা SMS এর মাধ্যমে লেনদেন সম্পন্ন
                        করার সুবিধা।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Urban */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl p-1 shadow-2xl hover:shadow-indigo-200/50 transition duration-500">
              <div className="h-full bg-white/60 backdrop-blur-md rounded-[20px] p-8 border border-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Building2 className="w-32 h-32 text-indigo-600" />
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <Zap className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
                      আরবান (শহর) স্ট্র্যাটেজি
                    </h3>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      TECH SPEED MODEL
                    </span>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-50 transition">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        লাইভ জিপিএস ট্র্যাকিং
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        ডেলিভারি ম্যান বা সার্ভিস প্রোভাইডার কোথায় আছে তা ম্যাপে
                        লাইভ দেখার সুবিধা।
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-50 transition">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        ফ্লাশ স্টোর (Flash Store)
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        শহরের গুরুত্বপূর্ণ পয়েন্টে ছোট ওয়ারহাউজ/শপ সেটআপ যাতে ৩০
                        মিনিটে ডেলিভারি দেয়া যায়।
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-indigo-100 hover:bg-indigo-50 transition">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        প্রিমিয়াম ফ্লাশ পার্টনার
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        বড় ব্র্যান্ড শপ ও হসপিটালের সাথে অটোমেটেড POS
                        ইন্টিগ্রেশন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QA Loop */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="rounded-[40px] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay blur-[100px] opacity-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay blur-[100px] opacity-40 animate-pulse" />
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-2 block">
                Quality Assurance Protocol v2.0
              </span>
              <h2 className="text-4xl font-bold mb-8">
                সেবার মান নিয়ন্ত্রণ লুপ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-yellow-400/50 transition group">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">অটোমেটেড রেটিং</h4>
                  <p className="text-sm text-gray-300">
                    ৩.৫ স্টারের নিচে রেটিং নামলে ভেন্ডর অটোমেটিক ফ্ল্যাগড হবে।
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-green-400/50 transition group">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition duration-300">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">মিস্ট্রি শপার</h4>
                  <p className="text-sm text-gray-300">
                    আমাদের সিক্রেট এজেন্ট কাস্টমার সেজে সেবার মান যাচাই করবে।
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-pink-400/50 transition group">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition duration-300">
                    <Headset className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">২৪/৭ সাপোর্ট</h4>
                  <p className="text-sm text-gray-300">
                    যেকোনো সমস্যা সমাধানে ডেডিকেটেড হটলাইন ও লাইভ চ্যাট।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            বিপ্লব শুরু হোক এখান থেকেই!
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <DownloadCloud className="w-5 h-5" /> ব্লুপ্রিন্ট ডাউনলোড
            </a>
            <a
              href="#"
              className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition"
            >
              পার্টনার হতে চাই
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
