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
    <main dir="rtl" className="bg-white text-stone-900">
      <section className="border-b border-stone-200 bg-[#FFF9F4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#C85A1A]">
              دليل التصنيفات
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              التصنيفات
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              اختر التصنيف المناسب، استعرض آلات القهوة المتوفرة داخله وقارن
              المنتجات والأسعار بسهولة.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد تصنيفات متاحة حالياً.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <h2 className="text-2xl font-bold text-stone-900 transition-colors group-hover:text-[#C85A1A]">
                  {category.nameAr}
                </h2>

                <p
                  dir="ltr"
                  className="mt-2 text-left text-base font-medium text-stone-500"
                >
                  {category.nameEn}
                </p>

                <p className="mt-4 text-base font-medium text-stone-500">
                  {category._count.products} منتج
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-sm font-semibold text-[#C85A1A]">
                  <span>عرض المنتجات</span>
                  <span aria-hidden="true">←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}