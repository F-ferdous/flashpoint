"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export type CardVariant = "default" | "highlight" | "horizontal";

export interface CardProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  icon?: ReactNode;
  variant?: CardVariant;
  className?: string;
  accent?: "c1" | "c2" | "c3" | "c4"; // optional palette accent
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = "",
  ctaText = "Learn more",
  ctaHref = "#",
  icon,
  variant = "default",
  className = "",
  accent,
}: CardProps) {
  const base =
    "group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur transition shadow-sm hover:shadow-md hover:-translate-y-0.5";

  const highlight =
    "ring-1 ring-inset ring-amber-500/40 bg-gradient-to-br from-amber-50/70 to-transparent dark:from-amber-500/5";

  const horizontal = variant === "horizontal";

  const ringStyle = accent
    ? { boxShadow: `0 0 0 1px var(--${accent})` } as React.CSSProperties
    : undefined;

  const bgTintClass = accent ? `tint-${accent}` : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={ringStyle}
      className={`${base} ${variant === "highlight" ? highlight : ""} ${bgTintClass} ${className}`}
    >
      <div className={`${horizontal ? "grid grid-cols-1 sm:grid-cols-3" : "grid"} gap-0`}>
        {imageSrc && (
          <div className={`${horizontal ? "sm:col-span-1" : ""} relative aspect-[16/9] sm:aspect-square overflow-hidden`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className={`${horizontal ? "sm:col-span-2" : ""} p-5 sm:p-6 flex flex-col gap-3`}>
          <div className="flex items-start gap-3">
            {icon && <div className="shrink-0 mt-1 text-foreground/80">{icon}</div>}
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          </div>
          <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{description}</p>

          <div className="mt-2">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:opacity-80"
            >
              {ctaText}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
