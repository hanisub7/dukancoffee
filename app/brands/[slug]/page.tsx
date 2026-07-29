import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
import { prisma } from "@/app/lib/prisma";

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;

  const brand = await prisma.brand.findFirst({
    where: {
      slug,
      active: true,
      deletedAt: null,
    },
    select: {
      name: true,
    },
  });

  if (!brand) {
    return {
      title: "العلامة التجارية غير موجودة | DukanCoffee",
    };
  }

  return {
    title: `${brand.name} | DukanCoffee`,
    description: `استعرض آلات القهوة من ${brand.name} وقارن الأسعار الحالية.`,
  };
}

export default async function BrandPage({
  params,
}: BrandPageProps) {
  const { slug } = await params;

  const brand = await prisma.brand.findFirst({
    where: {
      slug,
      active: true,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
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

  if (!brand) {
    notFound();
  }

  const products = brand.products.map((product) => {
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
      brandName: brand.name,
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
            العلامة التجارية
          </p>

          <h1
            dir="ltr"
            className="mt-3 text-left text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {brand.name}
          </h1>

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
              لا توجد منتجات منشورة لهذه العلامة التجارية.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}