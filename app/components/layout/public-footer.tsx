import Image from "next/image";
import Link from "next/link";

export default function PublicFooter() {
  return (
   <footer className="mt-10 border-t border-stone-200 bg-white">
  <div className="mx-auto max-w-7xl px-6 py-10">
    <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <div className="flex items-center gap-3">
          <Image
            src="/logo-dc-orange.png"
            alt="DukanCoffee"
            width={38}
            height={38}
            className="h-10 w-auto object-contain"
          />

          <h2 className="text-3xl font-extrabold tracking-tight text-brand">
            DukanCoffee
          </h2>
        </div>

        <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
         أسعار أوضح. مقارنة أسهل. قرار شراء أفضل.
        
        </p>
      </div>

      <div className="grid grid-cols-2 gap-10 justify-items-start">
        <div>
          <h3 className="mb-4 text-sm font-bold text-stone-900">
            التصفح
          </h3>

          <nav className="space-y-1 text-sm">
            <Link
              href="/"
              className="block text-stone-600 transition hover:text-brand"
            >
              الرئيسية
            </Link>

            <Link
              href="/products"
              className="block text-stone-600 transition hover:text-brand"
            >
              المنتجات
            </Link>

            <Link
              href="/brands"
              className="block text-stone-600 transition hover:text-brand"
            >
              العلامات التجارية
            </Link>

            <Link
              href="/categories"
              className="block text-stone-600 transition hover:text-brand"
            >
              الفئات
            </Link>

            <Link
              href="/price-drops"
              className="block text-stone-600 transition hover:text-brand"
            >
              انخفاضات الأسعار
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold text-stone-900">
            معلومات
          </h3>

          <nav className="space-y-1 text-sm">
            <Link
              href="/about"
              className="block text-stone-600 transition hover:text-brand"
            >
              من نحن
            </Link>

            <Link
              href="/contact"
              className="block text-stone-600 transition hover:text-brand"
            >
              تواصل معنا
            </Link>

            <Link
              href="/privacy"
              className="block text-stone-600 transition hover:text-brand"
            >
              سياسة الخصوصية
            </Link>

            <Link
              href="/terms"
              className="block text-stone-600 transition hover:text-brand"
            >
              الشروط والأحكام
            </Link>
          </nav>
        </div>
      </div>
    </div>

    <div className="mt-7 border-t border-stone-200 pt-4">
      <div className="flex items-center justify-end text-xs text-stone-500">
        <p>
          © {new Date().getFullYear()} DukanCoffee. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  </div>
</footer>
  );
}