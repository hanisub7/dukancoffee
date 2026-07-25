import Link from "next/link";

const BRAND_ORANGE = "#C85A1A";

function DukanCoffeeLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-10 w-10 shrink-0 sm:h-11 sm:w-11"
      fill="none"
    >
      <path
        d="M10 7H23.5C33.7173 7 42 14.835 42 24.5C42 34.165 33.7173 42 23.5 42H10V7Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      <path
        d="M29.7 16.3C25.3 17.5 22.1 21.1 21.4 25.5C20.8 29.4 22.4 32.7 25.2 34.2C29.5 32.9 32.5 29.4 33.2 25.1C33.8 21.4 32.3 18 29.7 16.3Z"
        fill="currentColor"
      />

      <path
        d="M23.6 32.1C25.6 28.8 28.1 25.8 31.3 23.2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SiteHeader() {
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="العودة إلى الصفحة الرئيسية"
          className="flex shrink-0 items-center gap-2"
          style={{ color: BRAND_ORANGE }}
        >
          <DukanCoffeeLogo />

          <span
            dir="ltr"
            className="text-[1.65rem] font-bold leading-none tracking-[-0.045em] sm:text-[2rem]"
          >
            DukanCoffee
          </span>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-7 text-sm font-medium text-black md:flex"
        >
          <Link
            href="/products"
            className="transition-opacity hover:opacity-60"
          >
            آلات القهوة
          </Link>

          <Link
            href="/products?sort=price-asc"
            className="transition-opacity hover:opacity-60"
          >
            أفضل الأسعار
          </Link>

          <Link
            href="/products?sort=price-drop"
            className="transition-opacity hover:opacity-60"
          >
            انخفاضات الأسعار
          </Link>
        </nav>

        <Link
          href="/products"
          className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg bg-[#F2A064] px-3.5 text-xs font-bold text-black transition-colors hover:bg-[#E98B48] focus:outline-none focus:ring-2 focus:ring-[#C85A1A] focus:ring-offset-2 sm:min-h-10 sm:px-4 sm:text-sm"
        >
          عرض المنتجات
        </Link>
      </div>
    </header>
  );
}