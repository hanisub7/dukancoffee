import type { Metadata } from "next";
import Link from "next/link";

import { getBrandCatalog } from "@/app/lib/brands/queries";

export const metadata: Metadata = {
  title: "العلامات التجارية | DukanCoffee",
  description:
    "استعرض العلامات التجارية المتوفرة في DukanCoffee.",
};

export default async function BrandsPage() {
  const { brands } = await getBrandCatalog();

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900">
          العلامات التجارية
        </h1>

        <p className="mt-3 text-stone-600">
          اختر العلامة التجارية لاستعراض جميع
          آلات القهوة الخاصة بها.
        </p>
      </header>

      {brands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="font-semibold text-stone-900">
            لا توجد علامات تجارية متاحة.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-orange-300 hover:shadow-md"
            >
              <h2
                dir="ltr"
                className="text-xl font-bold text-stone-900"
              >
                {brand.name}
              </h2>

              <p className="mt-3 text-sm text-stone-500">
                {brand._count.products} منتج
              </p>

              <div className="mt-5 text-sm font-semibold text-orange-700">
                عرض المنتجات ←
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}