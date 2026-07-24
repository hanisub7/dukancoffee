import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "DukanCoffee | مقارنة أسعار ماكينات القهوة",
    template: "%s | DukanCoffee",
  },
  description:
    "قارن أسعار ماكينات القهوة في السعودية، وتابع تاريخ الأسعار والمواصفات والعروض المتاحة من المتاجر.",
  applicationName: "DukanCoffee",
  keywords: [
    "ماكينات القهوة",
    "مقارنة أسعار ماكينات القهوة",
    "ماكينات إسبريسو",
    "ماكينات قهوة أوتوماتيكية",
    "مطاحن القهوة",
    "السعودية",
    "DukanCoffee",
  ],
  authors: [{ name: "DukanCoffee" }],
  creator: "DukanCoffee",
  publisher: "DukanCoffee",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "/",
    siteName: "DukanCoffee",
    title: "DukanCoffee | مقارنة أسعار ماكينات القهوة",
    description:
      "قارن أسعار ماكينات القهوة في السعودية وتابع تغير الأسعار قبل الشراء.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DukanCoffee | مقارنة أسعار ماكينات القهوة",
    description:
      "قارن أسعار ماكينات القهوة في السعودية وتابع تغير الأسعار قبل الشراء.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}