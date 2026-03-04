import Link from "next/link";
import { FileText, Users } from "lucide-react";

export default function RecruitmentLandingPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/10 text-emerald-800 ring-1 ring-emerald-300 text-xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            নিয়োগ বিজ্ঞপ্তি
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-900">
            GESA FLASH — নিয়োগ ও আবেদন
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-900/80 max-w-2xl mx-auto">
            নিচের যেকোনো একটি অপশনে ক্লিক করে আবেদন করুন।
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/recruitment/observer-application"
            className="group rounded-2xl bg-[var(--surface-2)] ring-1 ring-black/10 dark:ring-white/10 p-6 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-600/10 text-emerald-700 p-3 ring-1 ring-emerald-300">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">
                  ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬ - পর্যবেক্ষক আবেদন ফরম
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  স্থানীয় পর্যবেক্ষক হিসেবে আবেদন করুন (Form EO-2 অনুসারে)।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700 group-hover:underline">
                  ফরম দেখুন
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/recruitment/job-application"
            className="group rounded-2xl bg-[var(--surface-2)] ring-1 ring-black/10 dark:ring-white/10 p-6 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-fuchsia-600/10 text-fuchsia-700 p-3 ring-1 ring-fuchsia-300">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">
                  চাকরীর নিয়োগ বিজ্ঞপ্তি
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  GESA FLASH Program-এর চাকরির জন্য আবেদন করুন।
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700 group-hover:underline">
                  আবেদন ফরম দেখুন
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
