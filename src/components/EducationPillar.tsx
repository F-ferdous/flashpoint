"use client";

export default function EducationPillar() {
  return (
    <section className="bg-gray-50">
      {/* Hero Section */}
      <header className="relative text-white text-center px-4">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(20, 83, 45, 0.85), rgba(20, 83, 45, 0.75)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto max-w-4xl py-16 md:py-28">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 inline-block uppercase tracking-wider">
            Education Pillar
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            শিক্ষা ও দক্ষতা উন্নয়ন
          </h1>
          <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            জিসা ফ্ল্যাশ প্রোগ্রামের অন্যতম মূল স্তম্ভ। আমাদের লক্ষ্য—প্রযুক্তি নির্ভর মানসম্মত শিক্ষা ও দক্ষতা প্রশিক্ষণের মাধ্যমে আপনাকে আত্মনির্ভরশীল করে গড়ে তোলা।
          </p>
          <div className="flex justify-center">
            <a href="#edu-projects" className="bg-white text-green-800 px-6 py-2 rounded-full font-semibold hover:bg-green-100 transition shadow">
              আমাদের প্রজেক্টসমূহ
            </a>
          </div>
        </div>
      </header>

      {/* Vision Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Education Vision"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="md:w-1/2 space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
                আমাদের দর্শন
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                প্রথাগত শিক্ষার পাশাপাশি কারিগরি ও সফট স্কিল বা জীবনমুখী দক্ষতা অর্জন বর্তমান যুগে অত্যন্ত জরুরি। জিসা ফ্ল্যাশ প্রোগ্রাম বিশ্বাস করে, <span className="font-bold text-green-700">"দক্ষতাই শক্তি, দক্ষতাই মুক্তি"</span>। আমরা এমন একটি ইকোসিস্টেম তৈরি করছি যেখানে একজন শিক্ষার্থী বা যুবক শেখার পাশাপাশি আয়ের সুযোগও পাবে।
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-3" aria-hidden>✔</span> ডিজিটাল স্কিল ডেভেলপমেন্ট
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-3" aria-hidden>✔</span> লার্ন এন্ড আর্ন (শেখার সাথে আয়)
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-3" aria-hidden>✔</span> পেশাগত ও সফট স্কিল প্রশিক্ষণ
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-3" aria-hidden>✔</span> লার্ণিং শেয়ারিং প্লাটফরম (প্রাইমারি থেকে উচ্চ মাধ্যমিক)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Projects Section */}
      <section id="edu-projects" className="py-12 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">শিক্ষা স্তম্ভ</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              শিক্ষা স্তম্ভের মাধ্যমে গ্রাম ও শহরের প্রাইমারি থেকে হায়ার সেকেন্ডারি পর্যায়ে শিক্ষণ শেয়ারের মাধ্যমে আয়ের সুযোগ রয়েছে। যা এই প্রকল্পকে অনন্য মাত্রা দিয়েছে।
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Project 1 Card */}
            <div className="bg-white rounded-2xl p-6 shadow border-t-4 border-green-500 transition duration-300 hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-5 text-green-600 text-xl font-bold">
                01
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">ইজি লার্ন অ্যান্ড আর্ন সুযোগ</h3>
              <p className="text-gray-700 mb-5">
                ডিজিটাল লিটারেসি বৃদ্ধি এবং সহজ অনলাইন কাজের মাধ্যমে আয়ের সুযোগ। ছাত্র-ছাত্রীদের জন্য পড়ালেখার পাশাপাশি বাড়তি আয়ের চমৎকার মাধ্যম।
              </p>
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-800 mb-2 border-b border-green-200 pb-2">সুবিধাসমূহ:</h4>
                <ul className="space-y-1.5 text-sm text-gray-800">
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5" aria-hidden>→</span> অনলাইন টাস্ক কমপ্লিট করে আয়</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5" aria-hidden>→</span> মাসিক আয়: প্রায় <span className="font-bold">৩০০০</span> টাকা (*শর্তসাপেক্ষ)</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5" aria-hidden>→</span> ছাত্র/শিক্ষক, বেকার, গৃহিণী, চাকরিজীবীসহ সবাই সহজে আয় করতে পারবেন</li>
                </ul>
              </div>
            </div>

            {/* Project 2 Card */}
            <div className="bg-white rounded-2xl p-6 shadow border-t-4 border-blue-500 transition duration-300 hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5 text-blue-600 text-xl font-bold">
                02
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">অনলাইন ও অফলাইন ফ্রিল্যান্সিং</h3>
              <p className="text-gray-700 mb-5">
                তরুণ ও কর্মজীবীদের জন্য প্রফেশনাল স্কিল সেট তৈরি। কর্মক্ষেত্রে প্রতিযোগিতা এবং ফ্রিল্যান্সিং মার্কেটপ্লেসে টিকে থাকার জন্য উন্নত প্রশিক্ষণ।
              </p>
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-2">সুবিধাসমূহ:</h4>
                <ul className="space-y-1.5 text-sm text-gray-800">
                  <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5" aria-hidden>→</span> যোগাযোগ দক্ষতা ও নেতৃত্ব বিকাশ</li>
                  <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5" aria-hidden>→</span> অনলাইন/অফলাইন ট্রেইনিং সুবিধা</li>
                  <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5" aria-hidden>→</span> প্যাসিভ আয়: <span className="font-bold">৫,০০০+</span> টাকা আয়ের সুযোগ(*শর্তসাপেক্ষ)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            কেন আমাদের শিক্ষা প্রকল্প আলাদা?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-5">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mb-4">
                <span aria-hidden>💻</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">বাস্তবমুখী প্রশিক্ষণ, সাথে আয়ের ব্যবস্থা</h3>
              <p className="text-gray-700">ব্যবহারিক বা প্র্যাক্টিক্যাল জ্ঞানে অধিক গুরুত্ব প্রদান</p>
            </div>
            <div className="p-5">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mb-4">
                <span aria-hidden>💰</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">আয়ের নিশ্চয়তা</h3>
              <p className="text-gray-700">শেখার সময় থেকেই ছোট ছোট কাজের মাধ্যমে আয়ের সুযোগ</p>
            </div>
            <div className="p-5">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mb-4">
                <span aria-hidden>👥</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">কমিউনিটি সাপোর্ট</h3>
              <p className="text-gray-700">আমাদের কমিউনিটি এবং মেন্টরদের সার্বক্ষণিক সহযোগিতা।</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-green-900 text-white text-center px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">আপনার দক্ষতা উন্নয়নের যাত্রা শুরু করুন আজই</h2>
          <p className="text-base md:text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            জিসা ফ্ল্যাশ প্রোগ্রামের শিক্ষা কার্যক্রমে বিনা ফি (ডিসেম্বর ২০২৫ পর্যন্ত) তে যুক্ত হয়ে নিজেকে স্বাবলম্বী করুন এবং উজ্জ্বল ভবিষ্যৎ গড়ুন।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a href="/signup" className="bg-white text-green-900 px-8 py-2.5 rounded-full font-bold hover:bg-gray-100 transition shadow">
              রেজিস্ট্রেশন করুন
            </a>
            <a href="/contact" className="border-2 border-white text-white px-8 py-2.5 rounded-full font-bold hover:bg-white hover:text-green-900 transition">
              যোগাযোগ করুন
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
