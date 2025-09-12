"use client";

import * as React from "react";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning";
  duration?: number; // ms
};

type ToastContextValue = {
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now() + Math.random());
    const next: Toast = { id, duration: 3000, variant: "default", ...t };
    setToasts((prev) => [...prev, next]);
    if (next.duration && next.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, next.duration);
    }
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[260px] max-w-[360px] rounded-lg border px-4 py-3 text-sm shadow-md backdrop-blur bg-[var(--surface-2)] border-black/10 dark:border-white/10 ${
            t.variant === "success"
              ? "ring-1 ring-emerald-500/30"
              : t.variant === "destructive"
              ? "ring-1 ring-rose-500/30"
              : t.variant === "warning"
              ? "ring-1 ring-amber-500/30"
              : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
          {t.description && <div className="text-foreground/80">{t.description}</div>}
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="absolute top-2 right-2 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
