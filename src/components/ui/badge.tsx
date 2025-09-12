import * as React from "react";
import { cn } from "./cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-[var(--brand)] text-black border border-[var(--brand-25)]",
    secondary: "bg-[var(--surface-2)] text-foreground border border-black/10 dark:border-white/10",
    outline: "bg-transparent text-foreground border border-black/10 dark:border-white/10",
    success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    destructive: "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
