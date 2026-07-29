import Link from "next/link";

import { getPriceDrops } from "@/app/lib/price-drops/queries";

export const metadata = {
  title: "Latest Price Drops | DukanCoffee",
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    sort?: string;
  }>;
};

export default async function PriceDropsPage({
  searchParams,
}: PageProps) {
  const params = (await searchParams) ?? {};

  const result = await getPriceDrops({
    page: Number(params.page) || 1,
    sort: params.sort,
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          أحدث انخفاضات الأسعار
        </h1>

        <p className="mt-2 text-stone-600">
          تم العثور على {result.totalItems} انخفاض في الأسعار.
        </p>
      </div>

      <form
        method="get"
        className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4"
      >
        <label
          htmlFor="sort"
          className="text-sm font-medium text-stone-700"
        >
          ترتيب النتائج
        </label>

        <select
          id="sort"
          name="sort"
          defaultValue={params.sort ?? "latest"}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          <option value="latest">الأحدث</option>
          <option value="saving-desc">أكبر توفير</option>
          <option value="price-asc">
            السعر: من الأقل إلى الأعلى
          </option>
          <option value="price-desc">
            السعر: من الأعلى إلى الأقل
          </option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white"
        >
          تطبيق
        </button>
      </form>

      {result.items.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            لا توجد انخفاضات أسعار حالياً
          </h2>

          <p className="mt-3 text-stone-600">
            سنعرض أحدث الانخفاضات بمجرد توفرها.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {result.items.map((item) => (
            <article
              key={item.offerId}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="flex h-56 items-center justify-center bg-stone-50 p-4">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-stone-400">
                    لا توجد صورة للمنتج
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h2 className="font-semibold">
                    {item.productName}
                  </h2>

                  <p className="text-sm text-stone-500">
                    {item.brandName}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    المتجر: {item.retailerName}
                  </div>

                  <div>
                    السعر السابق:{" "}
                    <span className="line-through">
                      {item.previousPrice.toFixed(2)}{" "}
                      {item.currencyCode}
                    </span>
                  </div>

                  <div className="font-semibold">
                    السعر الحالي:{" "}
                    {item.currentPrice.toFixed(2)}{" "}
                    {item.currencyCode}
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                      وفر {item.savingAmount.toFixed(2)}{" "}
                      {item.currencyCode}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/products/${item.productSlug}`}
                  className="mt-5 inline-flex rounded-lg bg-stone-900 px-4 py-2 text-white"
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
          className="mt-10 flex items-center justify-center gap-3"
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
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
            >
              الصفحة السابقة
            </Link>
          ) : null}

          <span className="text-sm text-stone-600">
            الصفحة {result.currentPage} من {result.totalPages}
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
              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
            >
              الصفحة التالية
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}