import {
  UserPlus,
  Coins,
  Banknote,
  ShoppingBag,
  Stethoscope,
  Tv,
  Zap,
  GraduationCap,
  RefreshCcw,
  ShoppingBasket,
  Shirt,
  HandCoins,
  MonitorPlay,
  Rocket,
  Video,
  PiggyBank,
  Palmtree,
  Check,
} from "lucide-react";

export default function FlashCardPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            আপনার ডিজিটাল{" "}
            <span className="text-emerald-600">লাইফ ও ডিসকাউন্ট</span> পার্টনার
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            GESA এর উদ্যোগে সর্বাধুনিক স্মার্ট কার্ড।
          </p>
        </div>

        {/* Content column */}
        <div className="flex flex-col items-center gap-12">
          {/* Card design */}
          <div className="flex flex-col items-center space-y-8 w-full">
            <div className="[perspective:1000px] w-full max-w-2xl">
              <div className="relative w-full aspect-[1.75/1] rounded-2xl shadow-2xl overflow-hidden transition-transform transform hover:scale-105 duration-300 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white border-t border-white/20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
                  <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-fuchsia-500 rounded-full blur-3xl" />
                </div>

                {/* Card Content */}
                <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-wider italic">
                        GESA FLASH
                      </h2>
                      <p className="text-xs md:text-sm uppercase tracking-widest text-gray-200 mt-1">
                        Life & Discount Card
                      </p>
                    </div>
                    {/* Chip */}
                    <div className="w-14 h-11 md:w-16 md:h-12 bg-gradient-to-tr from-yellow-200 to-yellow-500 rounded-md border border-yellow-600 flex items-center justify-center opacity-90">
                      <div className="w-full h-[1px] bg-yellow-700 my-[2px]" />
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs md:text-sm text-gray-300 uppercase">
                        Customer ID
                      </span>
                      <p className="font-mono text-xl md:text-3xl tracking-widest text-yellow-50 drop-shadow-md">
                        C000002
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-300 uppercase">
                          Card Holder
                        </p>
                        <p className="font-medium text-lg md:text-2xl tracking-wide uppercase">
                          RAFSAN AHMED
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] md:text-xs text-gray-300 uppercase">
                          Valid Thru
                        </p>
                        <p className="font-medium text-base md:text-xl">
                          12/28
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* sheen */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* CTA */}
            <a
              href="/apply-card"
              className="w-full max-w-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 text-center flex items-center justify-center gap-2 text-lg"
            >
              <UserPlus className="w-6 h-6" /> কার্ডের জন্য রেজিস্ট্রেশন করুন
            </a>

            {/* Dashboard preview */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">
                  অ্যাপ ড্যাশবোর্ড প্রিভিউ
                </span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-50">
                <div className="bg-emerald-50 p-4 rounded-xl text-center">
                  <div className="bg-emerald-100 w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2">
                    <Coins className="text-emerald-600 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">মোট পয়েন্ট</p>
                  <p className="text-xl font-bold text-emerald-700">২,২৫০</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="bg-green-100 w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2">
                    <Banknote className="text-green-600 w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500">ওয়ালেট ব্যালেন্স</p>
                  <p className="text-xl font-bold text-green-700">৳ ৫২০.০০</p>
                </div>
              </div>

              <div className="px-6 py-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                  পয়েন্ট ব্রেকডাউন (সার্ভিস অনুযায়ী)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        কেনাকাটা
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ৮৫০{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-teal-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        স্বাস্থ্যসেবা
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ৪০০{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center">
                        <Tv className="w-4 h-4 text-cyan-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        ইলেকট্রনিক্স
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ৬০০{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        ইউটিলিটি বিল
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ২৫০{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        শিক্ষা ফি
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      ১৫০{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        pts
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4" /> পয়েন্ট কনভার্ট করুন
                </button>
              </div>
            </div>
          </div>

          {/* Bottom sections: features & simulations */}
          <div className="w-full max-w-2xl space-y-8">
            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-emerald-500 pl-3">
                কার্ডের সুবিধাসমূহ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      সহজ কেনাকাটা
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      মুদি দোকান থেকে সুপারশপ, সবখানে পেমেন্ট।
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="shrink-0 w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      পয়েন্ট কালেকশন
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      প্রতি কেনাকাটায় নিশ্চিত রিওয়ার্ড পয়েন্ট।
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      ক্যাশ উইথড্র
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      পয়েন্ট ভাঙিয়ে নগদ টাকা উত্তোলনের সুবিধা।
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <RefreshCcw className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      রেগুলার ক্যাশব্যাক
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      নির্দিষ্ট পণ্যে সাপ্তাহিক/মাসিক ক্যাশব্যাক অফার।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulations */}
            {/* Pharmacy */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-1 shadow-sm border border-teal-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    ওষুধ কিনুন জিসা ফ্লাশ কার্ড দিয়ে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        সফল লেনদেন
                      </span>
                      <span className="text-xs text-gray-200">
                        গতকাল, ০৮:৪৫ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">মাই ফ্লাশ ফার্মেসি</p>
                    <p className="text-sm opacity-90">
                      প্রেসক্রিপশন অনুযায়ী ওষুধ ও হেলথ কেয়ার পণ্য ক্রয়।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ১,২০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "স্বাস্থ্য সুরক্ষায় ডিসকাউন্ট ও ক্যাশব্যাক সুবিধা উপভোগ
                  করুন।"
                </p>
              </div>
            </div>

            {/* Grocery */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-1 shadow-sm border border-indigo-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBasket className="text-indigo-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    চাল ডাল কিনুন পয়েন্ট দিয়ে খুব সহজে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        পয়েন্ট রিডেম্পশন
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ১১:১৫ AM
                      </span>
                    </div>
                    <p className="font-medium text-lg">ভাই ভাই জেনারেল স্টোর</p>
                    <p className="text-sm opacity-90">
                      ৫ কেজি চাল ও ১ কেজি ডাল (পয়েন্ট দিয়ে পেমেন্ট)।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center text-[8px] font-bold text-orange-600">
                        P
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৮৫০ পয়েন্ট
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "টাকা খরচ না করেই জমানো পয়েন্ট দিয়ে নিত্যপ্রয়োজনীয় বাজার
                  সদাই।"
                </p>
              </div>
            </div>

            {/* Fashion */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-1 shadow-sm border border-pink-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shirt className="text-pink-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    কাপড় কিনুন জিসা ফ্লাশ কার্ড দিয়ে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-pink-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        ডিসকাউন্ট পেমেন্ট
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ০৪:৩০ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">স্টাইল জোন ফ্যাশন</p>
                    <p className="text-sm opacity-90">
                      দেশীয় শাড়ি ও ট্র্যাডিশনাল ড্রেস কালেকশন।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ৩,৫০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "লেটেস্ট ফ্যাশন কালেকশনে এক্সক্লুসিভ ডিসকাউন্ট।"
                </p>
              </div>
            </div>

            {/* Electronics */}
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-1 shadow-sm border border-cyan-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tv className="text-cyan-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    টিভি ফ্রিজ কিনুন কার্ড/পয়েন্ট দিয়ে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        পয়েন্ট পেমেন্ট
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ০৭:১৫ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">ফ্লাশ ইলেকট্রো মার্ট</p>
                    <p className="text-sm opacity-90">
                      স্মার্ট এলইডি টিভি ও রেফ্রিজারেটর ক্রয়।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center text-[8px] font-bold text-orange-600">
                        P
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ২৫,০০০ পয়েন্ট
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "বড় ইলেকট্রনিক্স পণ্য কিনুন জমানো পয়েন্ট বা সহজ কিস্তিতে।"
                </p>
              </div>
            </div>

            {/* Education Fee */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-1 shadow-sm border border-yellow-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="text-yellow-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    স্কুল কলেজের বেতন দিন কার্ড দিয়ে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        ফি পেমেন্ট
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ১০:০০ AM
                      </span>
                    </div>
                    <p className="font-medium text-lg">জিসা স্কুল এন্ড কলেজ</p>
                    <p className="text-sm opacity-90">
                      শিক্ষার্থীর মাসিক বেতন ও সেমিস্টার ফি পরিশোধ।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ১,৫০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "লাইনে না দাঁড়িয়েই নিমিষে স্কুলের বেতন পরিশোধ করুন।"
                </p>
              </div>
            </div>

            {/* Utility */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-1 shadow-sm border border-red-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="text-red-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    বিদ্যুৎ বিল, মোবাইল রিচার্জ করুন পয়েন্ট দিয়ে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        বিল পেমেন্ট
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ০৯:০০ AM
                      </span>
                    </div>
                    <p className="font-medium text-lg">ইউটিলিটি বিল প্রদান</p>
                    <p className="text-sm opacity-90">
                      বাসার বিদ্যুৎ বিল, ইন্টারনেট বিল ও মোবাইল রিচার্জ সফল।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center text-[8px] font-bold text-orange-600">
                        P
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ২৫০ পয়েন্ট
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "ঘরে বসেই বিদ্যুৎ বিল ও মোবাইল রিচার্জ করুন পয়েন্ট বা
                  ক্যাশব্যাক দিয়ে।"
                </p>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-1 shadow-sm border border-emerald-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PiggyBank className="text-emerald-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    টাকা জমান সপ্তাহে বা মাসে
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        DPS জমা
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ১২:৩০ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">মাসিক সঞ্চয় স্কিম</p>
                    <p className="text-sm opacity-90">
                      সাপ্তাহিক কিস্তি সফলভাবে জমা হয়েছে।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      + ৳ ৫০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "ভবিষ্যতের জন্য নিশ্চিন্তে জমান টাকা, কার্ড দিয়েই।"
                </p>
              </div>
            </div>

            {/* Micro Loan */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-1 shadow-sm border border-violet-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HandCoins className="text-violet-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    ক্ষুদ্র লোন নিন, ব্যবসা বা পার্সোনাল কাজের জন্য
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-violet-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        লোন মঞ্জুর
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ০৩:৪৫ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">ব্যবসা সম্প্রসারণ লোন</p>
                    <p className="text-sm opacity-90">
                      আপনার অ্যাকাউন্টে ১০,০০০ টাকা লোন জমা হয়েছে।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      + ৳ ১০,০০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "সহজ শর্তে ও দ্রুত প্রসেসিংয়ে লোন নিন, স্বপ্ন পূরণ করুন।"
                </p>
              </div>
            </div>

            {/* Online Learning */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-1 shadow-sm border border-sky-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MonitorPlay className="text-sky-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    অনলাইন লার্নিং শেয়ারিং প্লাটফরমে শিখুন সফট স্কিল
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-sky-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        কোর্স এনরোলমেন্ট
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, ০৮:০০ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">সফট স্কিল ডেভেলপমেন্ট</p>
                    <p className="text-sm opacity-90">
                      কমিউনিকেশন ও লিডারশিপ কোর্স সাবস্ক্রিপশন।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ৫০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "ঘরে বসেই স্কিল ডেভেলপ করুন, পেমেন্ট করুন কার্ড দিয়ে।"
                </p>
              </div>
            </div>

            {/* Flash Service */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-1 shadow-sm border border-orange-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="text-orange-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    ফ্লাশ সেবা নিন (হাইপার লোকাল সার্ভিস ডেলিভারি)
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-orange-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        ফ্লাশ সেবা
                      </span>
                      <span className="text-xs text-gray-200">
                        এখনই, ১০:৩০ AM
                      </span>
                    </div>
                    <p className="font-medium text-lg">
                      লোকালি ভেরিফাইড সার্ভিস
                    </p>
                    <p className="text-sm opacity-90">
                      অভিজ্ঞ ও দক্ষ মিস্ত্রি, টেকনিশিয়ান, সার্ভিস পার্সন দ্বারা
                      ইলেকট্রিক, প্লাম্বিং, রিপেয়ারিং সেবা পান গ্রামে বসেও
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ১০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "আপনার সময়ের মূল্য আমাদের কাছে সবার আগে।"
                </p>
              </div>
            </div>

            {/* Telemedicine */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-1 shadow-sm border border-cyan-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="text-cyan-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    ২৪/৭ ডাক্তারের সেবা নিন ফ্রি তে !
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        টেলিমেডিসিন
                      </span>
                      <span className="text-xs text-gray-200">এখনই, ২৪/৭</span>
                    </div>
                    <p className="font-medium text-lg">ফ্রি ডাক্তার পরামর্শ</p>
                    <p className="text-sm opacity-90">
                      ভিডিও কলে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন সম্পূর্ণ
                      বিনামূল্যে।
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-700" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      ফ্রি সেবা
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "GESA FLASH মেম্বারদের জন্য স্বাস্থ্যসেবা এখন হাতের মুঠোয়।"
                </p>
              </div>
            </div>

            {/* Hotel & Tourism */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-1 shadow-sm border border-blue-100">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palmtree className="text-blue-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    হোটেল, মোটেল ও টুরিস্ট লোকেশনে টেনশন ফ্রি থাকুন
                  </h3>
                </div>
                <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden group">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded text-white">
                        হোটেল বুকিং
                      </span>
                      <span className="text-xs text-gray-200">
                        আজ, দুপুর ০২:০০ PM
                      </span>
                    </div>
                    <p className="font-medium text-lg">সী ভিউ, কক্সবাজার</p>
                    <p className="text-sm opacity-90">
                      কক্সবাজার, কুয়াকাটা, সাজেকভ্যালী, নিঝুম দ্বীপ,
                      সেন্টমার্টিন্সসহ সকল ট্যুরিস্ট স্পটে হোটেল, মোটেল বুক করুন
                      স্পেশাল ডিসকাউন্টে!
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                    <div className="w-8 h-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full mx-[1px]" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      - ৳ ২,০০০.০০
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center italic">
                  "ভ্রমণে আবাসন নিয়ে আর কোনো চিন্তা নেই।"
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <a
            href="/apply-card"
            className="w-full max-w-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 text-center flex items-center justify-center gap-2 text-lg"
          >
            <UserPlus className="w-6 h-6" /> কার্ডের জন্য রেজিস্ট্রেশন করুন
          </a>

          <p className="text-xs text-gray-400 text-center mt-2 max-w-xl mx-auto">
            ডিসক্লেমার: এই পেজে প্রদর্শিত ইমেজ, পরিসংখ্যান ও গাণিতিক মানসমূহ
            শুধুমাত্র ব্যাখ্যামূলক উদ্দেশ্যে ব্যবহৃত হয়েছে। বাস্তব তথ্য বা
            ফলাফলের সঙ্গে এর কোনো প্রত্যক্ষ বা পরোক্ষ সামঞ্জস্য নাও থাকতে পারে।
          </p>
        </div>
      </main>
    </div>
  );
}
