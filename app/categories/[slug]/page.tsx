import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
import { prisma } from "@/app/lib/prisma";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findFirst({
    where: {
      slug,
      active: true,
      deletedAt: null,
    },
    select: {
      nameAr: true,
    },
  });

  if (!category) {
    return {
      title: "التصنيف غير موجود | DukanCoffee",
    };
  }

  return {
    title: `${category.nameAr} | DukanCoffee`,
    description: `استعرض آلات القهوة ضمن تصنيف ${category.nameAr} وقارن الأسعار الحالية.`,
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findFirst({
    where: {
      slug,
      active: true,
      deletedAt: null,
    },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      products: {
        where: {
          status: "PUBLISHED",
          deletedAt: null,
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          slug: true,
          fullName: true,
          model: true,
          brand: {
            select: {
              name: true,
            },
          },
          images: {
            where: {
              imageType: "MAIN",
            },
            orderBy: {
              sortOrder: "asc",
            },
            take: 1,
            select: {
              url: true,
            },
          },
          offers: {
            where: {
              inStock: true,
              retailer: {
                active: true,
                deletedAt: null,
                country: {
                  code: "SA",
                  enabled: true,
                },
              },
            },
            orderBy: {
              currentPrice: "asc",
            },
            take: 1,
            select: {
              currentPrice: true,
              currencyCode: true,
              priceHistory: {
                orderBy: {
                  checkedAt: "desc",
                },
                take: 2,
                select: {
                  price: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const products = category.products.map((product) => {
    const offer = product.offers[0] ?? null;
    const latestHistory = offer?.priceHistory[0] ?? null;
    const previousHistory = offer?.priceHistory[1] ?? null;

    let priceMovement: "down" | "up" | "same" | "none" = "none";
    let priceMovementText: string | null = null;

    if (latestHistory && previousHistory) {
      const latestPrice = Number(latestHistory.price.toString());
      const previousPrice = Number(previousHistory.price.toString());

      if (latestPrice < previousPrice) {
        priceMovement = "down";
        priceMovementText = "أقل من السعر السابق";
      } else if (latestPrice > previousPrice) {
        priceMovement = "up";
        priceMovementText = "أعلى من السعر السابق";
      } else {
        priceMovement = "same";
        priceMovementText = "لا يوجد تغير في السعر";
      }
    }

    return {
      id: product.id,
      slug: product.slug,
      name: product.fullName,
      brandName: product.brand.name,
      imageUrl: product.images[0]?.url ?? null,
      subtitle: product.model,
      price: offer?.currentPrice
        ? offer.currentPrice.toString()
        : null,
      currencyCode: offer?.currencyCode ?? "SAR",
      priceMovement,
      priceMovementText,
      isLowestPrice: false,
    };
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
      <section className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-orange-700">
            التصنيف
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {category.nameAr}
          </h1>

          <p
            dir="ltr"
            className="mt-2 text-left text-sm text-stone-500"
          >
            {category.nameEn}
          </p>

          <p className="mt-3 text-stone-600">
            {products.length} منتج منشور
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد منتجات منشورة في هذا التصنيف.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}