import type { Metadata } from "next";
import Link from "next/link";

import { getCategoryCatalog } from "@/app/lib/categories/queries";

export const metadata: Metadata = {
  title: "التصنيفات | DukanCoffee",
  description:
    "استعرض تصنيفات آلات القهوة المتوفرة في DukanCoffee.",
};

export default async function CategoriesPage() {
  const { categories } = await getCategoryCatalog();

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900">
          التصنيفات
        </h1>

        <p className="mt-3 text-stone-600">
          اختر التصنيف لاستعراض آلات القهوة المتوفرة داخله.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="font-semibold text-stone-900">
            لا توجد تصنيفات متاحة.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-orange-300 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-stone-900">
                {category.nameAr}
              </h2>

              <p
                dir="ltr"
                className="mt-2 text-left text-sm text-stone-500"
              >
                {category.nameEn}
              </p>

              <p className="mt-4 text-sm text-stone-500">
                {category._count.products} منتج
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