import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import RootChrome from "@/components/RootChrome";
import { LanguageProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GESA Flash Bangladesh — Learn & Earn, Health & Wealth, ShopWell, Entrepreneurship",
  description:
    "The Gesa Flash Program is a collaborative initiative supported by Flash Service Agency Limited that provides technology-driven services to promote education, health, skill development, social awareness, and earning opportunities in Bangladesh.",
  keywords: [
    "GESA Flash Bangladesh",
    "Learn & Earn",
    "Health & Wealth",
    "ShopWell",
    "Entrepreneurship",
    "Community Engagement",
    "Soft Skills",
    "ICT",
    "AI Projects",
    "Flash Service Agency Limited",
    "Education",
    "Health",
    "Skill Development",
    "Social Awareness",
    "Earning Opportunities",
    "Bangladesh",
  ],
  applicationName: "Flash Point",
  openGraph: {
    title: "GESA Flash Bangladesh — Learn & Earn, Health & Wealth, ShopWell, Entrepreneurship",
    description:
      "The Gesa Flash Program is a collaborative initiative supported by Flash Service Agency Limited that provides technology-driven services to promote education, health, skill development, social awareness, and earning opportunities in Bangladesh.",
    url: "/",
    siteName: "Flash Point",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GESA Flash Bangladesh — Learn & Earn, Health & Wealth, ShopWell, Entrepreneurship",
    description:
      "The Gesa Flash Program is a collaborative initiative supported by Flash Service Agency Limited that provides technology-driven services to promote education, health, skill development, social awareness, and earning opportunities in Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
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
        <LanguageProvider>
          {/* JSON-LD: GESA Flash Program */}
          <Script id="ldjson-gesa" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GESA Flash Bangladesh",
              alternateName: [
                "GESA",
                "GESA Flash Program",
              ],
              url: "/",
              description:
                "The Gesa Flash Program is a collaborative initiative supported by Flash Service Agency Limited that provides technology-driven services to promote education, health, skill development, social awareness, and earning opportunities in Bangladesh.",
              sponsor: {
                "@type": "Organization",
                name: "Flash Service Agency Limited",
              },
              areaServed: "Bangladesh",
              keywords: [
                "GESA Flash Bangladesh",
                "Learn & Earn",
                "Health & Wealth",
                "ShopWell",
                "Entrepreneurship",
                "Community Engagement",
                "Soft Skills",
                "ICT",
                "AI Projects",
              ],
            })}
          </Script>
          <RootChrome>
            {children}
          </RootChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
