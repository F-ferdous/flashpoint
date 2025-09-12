"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider, Toaster } from "@/components/ui/toast";

export default function RootChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSection =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/agentDashboard") ||
    pathname?.startsWith("/customerDashboard");

  if (isSection) {
    // Admin section manages its own chrome in src/app/admin/layout.tsx
    return <>{children}</>;
  }

  return (
    <ToastProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster />
    </ToastProvider>
  );
}
