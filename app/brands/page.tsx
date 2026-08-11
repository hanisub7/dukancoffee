import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/app/lib/prisma";

export const metadata: Metadata = {
  title: "العلامات التجارية | DukanCoffee",
  description:
    "تصفح العلامات التجارية لآلات القهوة واكتشف المنتجات المتوفرة لكل علامة.",
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

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: {
      active: true,
      deletedAt: null,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: {
            where: {
              status: "PUBLISHED",
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  const sortedBrands = [...brands].sort((firstBrand, secondBrand) => {
    const firstHasProducts = firstBrand._count.products > 0;
    const secondHasProducts = secondBrand._count.products > 0;

    if (firstHasProducts !== secondHasProducts) {
      return firstHasProducts ? -1 : 1;
    }

    return firstBrand.name.localeCompare(secondBrand.name, "en");
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-[#FFF9F4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#C85A1A]">
              دليل العلامات التجارية
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              العلامات التجارية
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
              تصفح أشهر العلامات التجارية لآلات القهوة،
              اكتشف منتجات كل علامة وقارن الأسعار المتاحة.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {sortedBrands.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedBrands.map((brand) => {
              const productCount = brand._count.products;
              const hasProducts = productCount > 0;

              const cardContent = (
                <>
                  <p
                    dir="ltr"
                    className={`text-left text-2xl font-bold transition-colors ${
                      hasProducts
                        ? "text-stone-900 group-hover:text-[#C85A1A]"
                        : "text-stone-500"
                    }`}
                  >
                    {brand.name}
                  </p>

                  <p className="mt-3 text-base font-medium text-stone-500">
                    {getProductCountText(productCount)}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-sm font-semibold">
                    {hasProducts ? (
                      <>
                        <span className="text-[#C85A1A]">
                          عرض المنتجات
                        </span>

                        <span
                          aria-hidden="true"
                          className="text-[#C85A1A]"
                        >
                          ←
                        </span>
                      </>
                    ) : (
                      <span className="text-stone-400">
                        قريبًا
                      </span>
                    )}
                  </div>
                </>
              );

              return hasProducts ? (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={brand.id}
                  className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد علامات تجارية متاحة حاليًا.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}