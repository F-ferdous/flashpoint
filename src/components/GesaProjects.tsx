"use client";

import { useI18n } from "@/lib/i18n";
import {
  GraduationCap,
  HeartPulse,
  FlaskConical,
  Briefcase,
  Users,
  MessageSquareText,
  Cpu
} from "lucide-react";

export default function GesaProjects() {
  const { t } = useI18n();
  const items = [
    { k: "p1", d: "p1_desc", Icon: GraduationCap, tone: { bg: "bg-emerald-500/15", text: "text-emerald-700" } },
    { k: "p2", d: "p2_desc", Icon: HeartPulse, tone: { bg: "bg-rose-500/15", text: "text-rose-700" } },
    { k: "p3", d: "p3_desc", Icon: FlaskConical, tone: { bg: "bg-sky-500/15", text: "text-sky-700" } },
    { k: "p4", d: "p4_desc", Icon: Briefcase, tone: { bg: "bg-amber-500/15", text: "text-amber-700" } },
    { k: "p5", d: "p5_desc", Icon: Users, tone: { bg: "bg-violet-500/15", text: "text-violet-700" } },
    { k: "p6", d: "p6_desc", Icon: MessageSquareText, tone: { bg: "bg-lime-500/15", text: "text-lime-700" } },
    { k: "p7", d: "p7_desc", Icon: Cpu, tone: { bg: "bg-indigo-500/15", text: "text-indigo-700" } },
  ];
  return (
    <section className="relative overflow-hidden bg-[color:oklch(0.97_0.03_160)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-center text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-900">
          {t("gesa.projects_title")}
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(({ k, d, Icon, tone }, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white ring-1 ring-emerald-200 p-5 sm:p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start gap-3">
                <span className={`grid place-items-center rounded-lg p-2 ${tone.bg} ${tone.text}`} aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-emerald-900 font-semibold">{t(`gesa.${k}`)}</div>
                  <p className="mt-1 text-sm text-foreground/70">{t(`gesa.${d}`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
