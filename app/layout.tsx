import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import PublicShell from "./components/layout/public-shell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dukancoffee.com"),

  title: {
    default: "DukanCoffee",
    template: "%s | DukanCoffee",
  },

  description: "قارن أسعار آلات القهوة وتتبع تغيرها.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ar" dir="rtl">
      <body
  className={`${geistSans.variable} ${geistMono.variable} bg-white text-neutral-900 antialiased`}
>
  <PublicShell>{children}</PublicShell>

  {gaMeasurementId && (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaMeasurementId}');
        `}
      </Script>
    </>
  )}
</body>
    </html>
  );
}