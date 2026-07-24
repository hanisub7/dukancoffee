import Link from "next/link";

const categories = [
  {
    name: "ماكينات الإسبريسو",
    description: "قارن بين ماكينات الإسبريسو المنزلية والاحترافية.",
    icon: "☕",
    href: "/products?category=espresso-machines",
  },
  {
    name: "الماكينات الأوتوماتيكية",
    description: "من حبوب القهوة إلى فنجانك بضغطة زر واحدة.",
    icon: "🤖",
    href: "/products?category=fully-automatic",
  },
  {
    name: "مطاحن القهوة",
    description: "اكتشف المطحنة المناسبة لطريقة تحضيرك المفضلة.",
    icon: "⚙️",
    href: "/products?category=coffee-grinders",
  },
  {
    name: "ماكينات الكبسولات",
    description: "خيارات سريعة وسهلة لتحضير القهوة يوميًا.",
    icon: "🟢",
    href: "/products?category=capsule-machines",
  },
];

const benefits = [
  {
    title: "قارن الأسعار",
    description:
      "شاهد عروض المتاجر المختلفة للمنتج نفسه في مكان واحد.",
    icon: "⚖️",
  },
  {
    title: "تابع تغير السعر",
    description:
      "اعرف ما إذا كان السعر الحالي مرتفعًا أو مناسبًا مقارنة بالسابق.",
    icon: "📈",
  },
  {
    title: "اختر بثقة",
    description:
      "راجع المواصفات والصور والمعلومات المهمة قبل اتخاذ قرار الشراء.",
    icon: "✓",
  },
];

const featuredProducts = [
  {
    name: "De'Longhi Magnifica",
    type: "ماكينة قهوة أوتوماتيكية",
    price: "ابتداءً من 1,899 ر.س",
    badge: "سعر مميز",
    icon: "☕",
  },
  {
    name: "Breville Barista Express",
    type: "ماكينة إسبريسو مع مطحنة",
    price: "ابتداءً من 2,249 ر.س",
    badge: "الأكثر بحثًا",
    icon: "♨️",
  },
  {
    name: "Nespresso Vertuo",
    type: "ماكينة قهوة بالكبسولات",
    price: "ابتداءً من 649 ر.س",
    badge: "خيار عملي",
    icon: "🟤",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="العودة إلى الصفحة الرئيسية"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-900 text-xl text-white shadow-sm">
              ☕
            </span>

            <div>
              <p className="text-xl font-bold tracking-tight text-stone-950">
                DukanCoffee
              </p>
              <p className="text-xs text-stone-500">دكان القهوة</p>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex"
            aria-label="التنقل الرئيسي"
          >
            <Link
              href="/products"
              className="transition hover:text-amber-900"
            >
              جميع المنتجات
            </Link>

            <Link
              href="/categories"
              className="transition hover:text-amber-900"
            >
              التصنيفات
            </Link>

            <Link
              href="/price-drops"
              className="transition hover:text-amber-900"
            >
              انخفاضات الأسعار
            </Link>
          </nav>

          <Link
            href="/products"
            className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900"
          >
            ابدأ المقارنة
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-amber-50 via-stone-50 to-stone-50">
        <div
          className="pointer-events-none absolute -left-24 top-14 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm font-medium text-amber-950 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              مقارنة أسعار ماكينات القهوة في السعودية
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl font-bold leading-[1.25] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              ابحث عن ماكينة القهوة المناسبة
              <span className="block text-amber-900">
                بأفضل سعر متاح
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
              قارن الأسعار والمواصفات وتاريخ السعر لمساعدتك على اختيار
              ماكينة القهوة المناسبة دون التنقل بين عشرات المتاجر.
            </p>

            <form
              action="/products"
              method="get"
              className="mt-9 max-w-2xl"
            >
              <label htmlFor="homepage-search" className="sr-only">
                ابحث عن ماكينة قهوة
              </label>

              <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-stone-900/5 sm:flex-row">
                <div className="flex flex-1 items-center gap-3 px-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 shrink-0 text-stone-400"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>

                  <input
                    id="homepage-search"
                    type="search"
                    name="q"
                    placeholder="مثال: ديلونجي، بريفيل، نسبريسو..."
                    className="min-h-12 w-full bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-12 rounded-xl bg-amber-900 px-7 font-semibold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
                >
                  ابحث الآن
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                مقارنة مجانية
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                أسعار من عدة متاجر
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span>
                تاريخ تغير السعر
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-amber-200/50 to-orange-100/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl shadow-stone-900/10 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-500">
                    مثال على المقارنة
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-stone-950">
                    ماكينة إسبريسو منزلية
                  </h2>
                </div>

                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                  ☕
                </span>
              </div>

              <div className="mt-7 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      المتجر الأول
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      أقل سعر حالي
                    </p>
                  </div>

                  <p className="text-lg font-bold text-stone-950">
                    1,899 ر.س
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      المتجر الثاني
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      شحن مجاني
                    </p>
                  </div>

                  <p className="text-lg font-bold text-stone-950">
                    1,999 ر.س
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      المتجر الثالث
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      متوفر الآن
                    </p>
                  </div>

                  <p className="text-lg font-bold text-stone-950">
                    2,149 ر.س
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-stone-950 px-4 py-3 text-white">
                <span className="text-sm text-stone-300">
                  التوفير المحتمل
                </span>
                <span className="font-bold text-emerald-400">
                  250 ر.س
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-amber-900">
              تصفح حسب النوع
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              اختر فئة ماكينة القهوة
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              ابدأ من نوع الماكينة التي تبحث عنها ثم قارن بين المنتجات
              والأسعار المتوفرة.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-sm font-bold text-amber-900 transition hover:text-amber-700"
          >
            عرض جميع التصنيفات ←
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg hover:shadow-stone-900/5"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl transition group-hover:bg-amber-100">
                {category.icon}
              </span>

              <h3 className="mt-6 text-lg font-bold text-stone-950">
                {category.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-600">
                {category.description}
              </p>

              <span className="mt-5 inline-flex text-sm font-bold text-amber-900">
                تصفح المنتجات ←
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold text-amber-900">
              مقارنة أوضح
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              كل ما تحتاجه قبل الشراء
            </h2>

            <p className="mt-4 leading-7 text-stone-600">
              نرتب المعلومات المهمة بطريقة بسيطة حتى تتمكن من اتخاذ قرار
              أفضل وفي وقت أقل.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl border border-stone-200 bg-stone-50 p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-xl font-bold text-white">
                  {benefit.icon}
                </span>

                <h3 className="mt-5 text-xl font-bold text-stone-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-stone-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-amber-900">
              منتجات مقترحة
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              ماكينات تستحق المقارنة
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              نماذج أولية لبطاقات المنتجات. سنربط هذا القسم بقاعدة البيانات
              في مرحلة لاحقة.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-bold text-amber-900 transition hover:text-amber-700"
          >
            عرض جميع المنتجات ←
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <article
              key={product.name}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50">
                <span className="text-7xl" aria-hidden="true">
                  {product.icon}
                </span>

                <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-900 shadow-sm">
                  {product.badge}
                </span>
              </div>

              <div className="p-6">
                <p className="text-sm text-stone-500">{product.type}</p>

                <h3
                  className="mt-2 text-xl font-bold text-stone-950"
                  dir="ltr"
                >
                  {product.name}
                </h3>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500">أفضل سعر</p>
                    <p className="mt-1 font-bold text-stone-950">
                      {product.price}
                    </p>
                  </div>

                  <Link
                    href="/products"
                    className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-bold text-stone-800 transition hover:border-amber-800 hover:text-amber-900"
                  >
                    قارن السعر
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-12 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-amber-300">
              ابدأ رحلتك الآن
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              لا تشترِ ماكينة القهوة قبل مقارنة سعرها
            </h2>

            <p className="mt-4 leading-7 text-stone-300">
              استعرض المنتجات وقارن العروض المتاحة واختر الصفقة الأنسب لك.
            </p>
          </div>

          <Link
            href="/products"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-7 font-bold text-stone-950 transition hover:bg-amber-300 lg:mt-0"
          >
            تصفح المنتجات
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm text-stone-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-bold text-stone-900">DukanCoffee</p>
            <p className="mt-1">
              مقارنة أسعار ماكينات القهوة في السعودية.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/about" className="transition hover:text-amber-900">
              من نحن
            </Link>

            <Link
              href="/privacy"
              className="transition hover:text-amber-900"
            >
              سياسة الخصوصية
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-amber-900"
            >
              تواصل معنا
            </Link>
          </div>

          <p dir="ltr">
            © {new Date().getFullYear()} DukanCoffee
          </p>
        </div>
      </footer>
    </main>
  );
}