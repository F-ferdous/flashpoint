import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import RootChrome from "@/components/RootChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flash Point — Earn, Spend, Heal",
  description: "Unified points platform with referrals, subscriptions, and telemedicine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              const t = localStorage.getItem('theme');
              if (t === 'dark') {
                document.documentElement.classList.add('theme-dark');
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('theme-dark');
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `}
        </Script>
        <RootChrome>
          {children}
        </RootChrome>
      </body>
    </html>
  );
}
