"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/brands", label: "العلامات التجارية" },
  { href: "/categories", label: "الفئات" },
  { href: "/price-drops", label: "انخفاضات الأسعار" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <Image
            src="/logo-dc-orange.png"
            alt="DukanCoffee"
            width={44}
            height={44}
            priority
            className="h-11 w-11 object-contain"
          />

          <span className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
            DukanCoffee
          </span>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-1 lg:flex"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-orange-50 text-orange-700"
                    : "text-stone-600 hover:bg-stone-50 hover:text-orange-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={isMenuOpen}
          aria-controls="public-mobile-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:bg-stone-50 lg:hidden"
        >
          <span className="sr-only">
            {isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          </span>

          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="public-mobile-menu"
          aria-label="التنقل على الجوال"
          className="border-t border-stone-200 bg-white px-4 py-3 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-700"
                      : "text-stone-700 hover:bg-stone-50 hover:text-orange-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}