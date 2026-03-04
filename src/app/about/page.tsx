import Image from "next/image";

export default function AboutPage() {
  const team = [
    {
      name: "মোঃ মোশারফ হোসেন",
      role: "সহ-সভাপতি",
      org: "গ্রামীন ইকোনমি এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/mdmossarofhossain.jpeg",
    },
    {
      name: "মোঃ আলমগীর হোসেন",
      role: "নির্বাহী পরিচালক",
      org: "গ্রামীন ইকোনোমিক এন্ড সোশ্যাল অ্যাডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/alamgirhossain.jpeg",
    },
    {
      name: "নাসির আহমেদ",
      role: "পরিচালক (টেকনোলজি)",
      org: "জিসা ফ্লাশ প্রোগ্রাম, গ্রামীণ ইকোনোমিক এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/nasirahmed.jpeg",
    },
    {
      name: "মোঃ কামরুজ্জামান ইমরান",
      role: "পরিচালক প্রকল্প",
      org: "জিশা ফ্লাশ প্রোগ্রাম, গ্রামীন ইকোনমিক এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/kamrujjamanimran.jpeg",
    },
    {
      name: "মাকসুদা আক্তার মিশু",
      role: "অতিরিক্ত পরিচালক প্রকল্প",
      org: "জিসা ফ্লাশ প্রোগ্রাম, গ্রামীন ইকোনমিক এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/maksudaakhter.jpeg",
    },
    {
      name: "নাহিদ নুসরাত",
      role: "অতিরিক্ত পরিচালক প্রকল্প",
      org: "জিসা ফ্লাশ প্রোগ্রাম, গ্রামীন ইকোনমিক এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা)",
      img: "/assets/images/teams/nahidnusrat.jpeg",
    },
    {
      name: "মোঃ জাহাঙ্গির খাঁ",
      role: "উপ-পরিচালক প্রকল্প",
      org: "জিসা ফ্লাশ প্রোগ্রাম, জিসা",
      img: "/assets/images/teams/mdjahangir.jpeg",
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[52rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
      </div>

      <div className="relative">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-900">
            আমাদের সম্পর্কে
          </h1>
          <p className="mt-3 text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
            গ্রামীন ইকোনমি এন্ড সোশ্যাল এডভান্সমেন্ট (জিসা) – এর নিবেদিত টিম
            যারা প্রযুক্তি ও সমাজ উন্নয়নে কাজ করছে।
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--surface-2)]/60 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] overflow-hidden hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] transition-shadow"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--surface-1)] p-2">
                <Image
                  src={m.img}
                  alt={m.name}
                  width={640}
                  height={480}
                  className="h-full w-full object-contain transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-emerald-900 leading-snug">
                  {m.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/80">
                  {m.role}
                </p>
                <p className="mt-1 text-sm text-foreground/70">{m.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
