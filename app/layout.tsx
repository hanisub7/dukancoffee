import type { Metadata } from "next";
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
  title: "DukanCoffee",
  description: "قارن أسعار آلات القهوة وتتبع تغيرها.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-neutral-900 antialiased`}
      >
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}