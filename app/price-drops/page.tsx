import Link from "next/link";

import { getPriceDrops } from "@/app/lib/price-drops/queries";

export const metadata = {
  title: "انخفاضات الأسعار | DukanCoffee",
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    sort?: string;
  }>;
};

function formatPrice(
  value: number,
  currencyCode: string,
) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)} ${currencyCode}`;
}

export default async function PriceDropsPage({
  searchParams,
}: PageProps) {
  const params = (await searchParams) ?? {};

  const result = await getPriceDrops({
    page: Number(params.page) || 1,
    sort: params.sort,
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-[#FFF9F4]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#C85A1A]">
              دليل انخفاضات الأسعار
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              انخفاضات الأسعار
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              تابع أحدث انخفاضات أسعار ماكينات القهوة
              واكتشف فرص الشراء الأفضل.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          method="get"
          className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
        >
          <label
            htmlFor="sort"
            className="shrink-0 text-sm font-medium text-stone-600"
          >
            ترتيب النتائج
          </label>

          <select
            id="sort"
            name="sort"
            defaultValue={params.sort ?? "latest"}
            className="h-11 min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-900 outline-none transition-colors hover:border-stone-300 focus:border-brand focus:ring-2 focus:ring-brand/10"
          >
            <option value="latest">الأحدث</option>
            <option value="saving-desc">
              أكبر توفير
            </option>
            <option value="price-asc">
              السعر: من الأقل إلى الأعلى
            </option>
            <option value="price-desc">
              السعر: من الأعلى إلى الأقل
            </option>
          </select>

          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-brand px-6 text-sm font-semibold !text-white transition-colors hover:bg-brand-hover"
          >
            تطبيق
          </button>
        </form>

        {result.items.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl text-[#C85A1A]">
              ↓
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-stone-900">
              لا توجد انخفاضات أسعار حاليًا
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-600 sm:text-base">
              سنعرض أحدث انخفاضات الأسعار هنا بمجرد
              توفرها.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-brand-hover"
            >
              تصفح جميع الماكينات
            </Link>
          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              result.items.length === 1
                ? "mx-auto max-w-md grid-cols-1"
                : result.items.length === 2
                  ? "mx-auto max-w-4xl grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {result.items.map((item) => (
              <article
                key={item.offerId}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
<div className="flex h-72 items-center justify-center overflow-hidden border-b border-stone-100 bg-[#F8F8F8] p-4">
  {item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt={item.productName}
      className="max-h-full max-w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03]"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
      لا توجد صورة للمنتج
    </div>
  )}
</div>

                <div className="flex flex-1 flex-col p-5">
                  <div>
                    <p
                      dir="ltr"
                      className="text-left text-xs font-bold uppercase tracking-wide text-[#C85A1A]"
                    >
                      {item.brandName}
                    </p>

                    <h2
                      dir="ltr"
                      className="mt-1.5 line-clamp-2 min-h-14 text-left text-lg font-bold leading-7 text-stone-900"
                    >
                      {item.productName}
                    </h2>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-stone-100 pt-4 text-sm">
                    <span className="text-stone-500">
                      المتجر
                    </span>

                    <span className="font-semibold text-stone-900">
                      {item.retailerName}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-stone-50 p-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-stone-500">
                          السعر السابق
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-left text-sm font-medium text-stone-400 line-through"
                        >
                          {formatPrice(
                            item.previousPrice,
                            item.currencyCode,
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-stone-500">
                          السعر الحالي
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-left text-2xl font-bold tracking-tight text-[#C85A1A]"
                        >
                          {formatPrice(
                            item.currentPrice,
                            item.currencyCode,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-[#C85A1A]">
                      وفّر{" "}
                      {formatPrice(
                        item.savingAmount,
                        item.currencyCode,
                      )}
                    </span>
                  </div>

                  <Link
                    href={`/products/${item.productSlug}`}
                    className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md"
                  >
                    عرض المنتج
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {result.totalPages > 1 ? (
          <nav
            aria-label="التنقل بين صفحات انخفاضات الأسعار"
            className="mt-8 flex items-center justify-center gap-3"
          >
            {result.currentPage > 1 ? (
              <Link
                href={{
                  pathname: "/price-drops",
                  query: {
                    sort: params.sort ?? "latest",
                    page: result.currentPage - 1,
                  },
                }}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-stone-300"
              >
                الصفحة السابقة
              </Link>
            ) : null}

            <span className="text-sm text-stone-600">
              الصفحة {result.currentPage} من{" "}
              {result.totalPages}
            </span>

            {result.currentPage < result.totalPages ? (
              <Link
                href={{
                  pathname: "/price-drops",
                  query: {
                    sort: params.sort ?? "latest",
                    page: result.currentPage + 1,
                  },
                }}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-stone-300"
              >
                الصفحة التالية
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  );
}