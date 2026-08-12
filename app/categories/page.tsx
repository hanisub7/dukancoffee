import type { Metadata } from "next";
import Link from "next/link";

import { getCategoryCatalog } from "@/app/lib/categories/queries";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "التصنيفات | DukanCoffee",
  description:
    "استعرض تصنيفات آلات القهوة المتوفرة في DukanCoffee.",
};

function getProductCountText(count: number) {
  if (count === 0) {
    return "لا توجد منتجات";
  }

  if (count === 1) {
    return "منتج واحد";
  }

  if (count === 2) {
    return "منتجان";
  }

  if (count >= 3 && count <= 10) {
    return `${count} منتجات`;
  }

  return `${count} منتجًا`;
}

export default async function CategoriesPage() {
  const { categories } = await getCategoryCatalog();

  const sortedCategories = [...categories].sort(
    (firstCategory, secondCategory) => {
      const firstHasProducts =
        firstCategory._count.products > 0;

      const secondHasProducts =
        secondCategory._count.products > 0;

      if (firstHasProducts !== secondHasProducts) {
        return firstHasProducts ? -1 : 1;
      }

      return firstCategory.nameEn.localeCompare(
        secondCategory.nameEn,
        "en",
      );
    },
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-[#FFF9F4]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#C85A1A]">
              دليل التصنيفات
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              التصنيفات
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              اختر التصنيف المناسب، استعرض آلات القهوة
              المتوفرة داخله وقارن المنتجات والأسعار بسهولة.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {sortedCategories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد تصنيفات متاحة حاليًا.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              sortedCategories.length === 1
                ? "mx-auto max-w-xl grid-cols-1"
                : sortedCategories.length === 2
                  ? "mx-auto max-w-5xl grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {sortedCategories.map((category) => {
              const productCount =
                category._count.products;

              const hasProducts =
                productCount > 0;

              const cardContent = (
                <>
                  <div>
                    <h2
                      className={`text-2xl font-bold transition-colors ${
                        hasProducts
                          ? "text-stone-900 group-hover:text-[#C85A1A]"
                          : "text-stone-500"
                      }`}
                    >
                      {category.nameAr}
                    </h2>

                    <p
                      dir="ltr"
                      className="mt-1.5 text-left text-sm font-medium text-stone-400"
                    >
                      {category.nameEn}
                    </p>

                    <p className="mt-4 text-base font-medium text-stone-500">
                      {getProductCountText(productCount)}
                    </p>
                  </div>

                  <div className="mt-auto border-t border-stone-100 pt-5">
                    {hasProducts ? (
                      <div className="flex min-h-11 items-center justify-between px-1 text-sm font-bold text-[#C85A1A]">
                        <span>
                          عرض المنتجات
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-base transition-transform duration-200 group-hover:-translate-x-1"
                        >
                          ←
                        </span>
                      </div>
                    ) : (
                      <div className="flex min-h-11 items-center rounded-xl bg-stone-100 px-4 text-sm font-semibold text-stone-400">
                        قريبًا
                      </div>
                    )}
                  </div>
                </>
              );

              return hasProducts ? (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group flex min-h-[250px] flex-col rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-8"
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={category.id}
                  className="flex min-h-[250px] flex-col rounded-3xl border border-stone-200 bg-stone-50/60 p-7 sm:p-8"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}