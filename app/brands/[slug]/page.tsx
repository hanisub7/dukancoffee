import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
import { prisma } from "@/app/lib/prisma";
import { buildQuickSpecs } from "@/app/lib/products/queries";

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
          specification: {
  select: {
    machineType: true,
    grinderType: true,
    displayType: true,
    milkSystem: true,
    waterTankL: true,
    pumpPressureBar: true,
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
  price: offer
    ? Number(offer.currentPrice.toString())
    : undefined,
  currencyCode: offer?.currencyCode ?? "SAR",
  priceMovement,
  priceMovementText,
  isLowestPrice: false,
  quickSpecs: buildQuickSpecs(product.specification),
};
  });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white text-stone-900"
    >
<section className="border-b border-stone-200 bg-[#FFF9F4]">
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-[#C85A1A]">
        العلامة التجارية
      </p>

      <h1
        dir="ltr"
        className="mt-2 text-left text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl"
      >
        {brand.name}
      </h1>

      <p className="mt-3 text-sm font-medium text-stone-500 sm:text-base">
        {products.length === 1
          ? "آلة واحدة "
          : products.length === 2
            ? "آلتان"
            : `${products.length} آلات منشورة`}
      </p>
    </div>
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