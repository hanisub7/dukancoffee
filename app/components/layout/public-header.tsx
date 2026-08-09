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

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex min-h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex shrink-0 items-center gap-3"
        >
          <Image
            src="/logo-dc-orange.png"
            alt="DukanCoffee"
            width={48}
            height={48}
            priority
            className="h-12 w-auto object-contain"
          />

          <span className="text-xl font-bold tracking-tight text-orange-500 sm:text-2xl">
            DukanCoffee
          </span>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 whitespace-nowrap lg:flex"
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
               className={`relative px-3 py-3 text-[17px] font-normal transition-colors duration-200 ${
                  active
                    ? "text-orange-500"
                    : "text-stone-700 hover:text-orange-500"
                }`}
              >
                {link.label}

                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-orange-500"
                  />
                )}
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
          className="mr-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
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
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    active
                      ? "bg-orange-50 text-orange-600"
                      : "text-stone-700 hover:bg-stone-50 hover:text-orange-600"
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