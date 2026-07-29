import Image from "next/image";
import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-dc-orange.png"
                alt="DukanCoffee"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />

              <h2 className="text-xl font-bold text-stone-900">
                DukanCoffee
              </h2>
            </div>

            <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
              منصة لمقارنة أسعار آلات القهوة وتتبع تغيراتها لمساعدتك على
              اتخاذ قرار شراء مبني على معلومات واضحة.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <Link href="/" className="text-stone-600 hover:text-orange-700">
              الرئيسية
            </Link>

            <Link
              href="/products"
              className="text-stone-600 hover:text-orange-700"
            >
              المنتجات
            </Link>

            <Link
              href="/brands"
              className="text-stone-600 hover:text-orange-700"
            >
              العلامات التجارية
            </Link>

            <Link
              href="/categories"
              className="text-stone-600 hover:text-orange-700"
            >
              الفئات
            </Link>

            <Link
              href="/price-drops"
              className="text-stone-600 hover:text-orange-700"
            >
              انخفاضات الأسعار
            </Link>

            <Link
              href="/about"
              className="text-stone-600 hover:text-orange-700"
            >
              من نحن
            </Link>

            <Link
              href="/contact"
              className="text-stone-600 hover:text-orange-700"
            >
              تواصل معنا
            </Link>

            <Link
              href="/privacy"
              className="text-stone-600 hover:text-orange-700"
            >
              سياسة الخصوصية
            </Link>

            <Link
              href="/terms"
              className="text-stone-600 hover:text-orange-700"
            >
              الشروط والأحكام
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} DukanCoffee. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}