import type { PrismaClient } from "../app/generated/prisma/client";

const productFamilies = [
  {
    brandSlug: "delonghi",
    categorySlug: "fully-automatic",
    name: "Magnifica Evo",
    slug: "delonghi-magnifica-evo",
  },
  {
    brandSlug: "delonghi",
    categorySlug: "fully-automatic",
    name: "Magnifica Start",
    slug: "delonghi-magnifica-start",
  },
  {
    brandSlug: "delonghi",
    categorySlug: "fully-automatic",
    name: "Dinamica",
    slug: "delonghi-dinamica",
  },
  {
    brandSlug: "delonghi",
    categorySlug: "fully-automatic",
    name: "Eletta Explore",
    slug: "delonghi-eletta-explore",
  },
  {
    brandSlug: "delonghi",
    categorySlug: "fully-automatic",
    name: "PrimaDonna Soul",
    slug: "delonghi-primadonna-soul",
  },
  {
    brandSlug: "delonghi",
    categorySlug: "espresso-machines",
    name: "La Specialista",
    slug: "delonghi-la-specialista",
  },

  {
    brandSlug: "philips",
    categorySlug: "fully-automatic",
    name: "Series 2200",
    slug: "philips-series-2200",
  },
  {
    brandSlug: "philips",
    categorySlug: "fully-automatic",
    name: "Series 3200",
    slug: "philips-series-3200",
  },
  {
    brandSlug: "philips",
    categorySlug: "fully-automatic",
    name: "Series 4300",
    slug: "philips-series-4300",
  },
  {
    brandSlug: "philips",
    categorySlug: "fully-automatic",
    name: "Series 5400",
    slug: "philips-series-5400",
  },

  {
    brandSlug: "breville",
    categorySlug: "espresso-machines",
    name: "Barista Express",
    slug: "breville-barista-express",
  },
  {
    brandSlug: "breville",
    categorySlug: "espresso-machines",
    name: "Barista Pro",
    slug: "breville-barista-pro",
  },
  {
    brandSlug: "breville",
    categorySlug: "espresso-machines",
    name: "Oracle Touch",
    slug: "breville-oracle-touch",
  },

  {
    brandSlug: "jura",
    categorySlug: "fully-automatic",
    name: "E8",
    slug: "jura-e8",
  },
  {
    brandSlug: "jura",
    categorySlug: "fully-automatic",
    name: "ENA 8",
    slug: "jura-ena-8",
  },

  {
    brandSlug: "siemens",
    categorySlug: "fully-automatic",
    name: "EQ.6 Plus",
    slug: "siemens-eq-6-plus",
  },
  {
    brandSlug: "siemens",
    categorySlug: "fully-automatic",
    name: "EQ.700",
    slug: "siemens-eq-700",
  },

  {
    brandSlug: "nespresso",
    categorySlug: "capsule-machines",
    name: "Vertuo",
    slug: "nespresso-vertuo",
  },
  {
    brandSlug: "nespresso",
    categorySlug: "capsule-machines",
    name: "Lattissima",
    slug: "nespresso-lattissima",
  },

  {
    brandSlug: "gaggia",
    categorySlug: "fully-automatic",
    name: "Magenta",
    slug: "gaggia-magenta",
  },
] as const;

export async function seedProductFamilies(
  prisma: PrismaClient,
): Promise<number> {
  for (const family of productFamilies) {
    const brand = await prisma.brand.findUnique({
      where: {
        slug: family.brandSlug,
      },
      select: {
        id: true,
      },
    });

    if (!brand) {
      throw new Error(
        `Brand not found for product family: ${family.brandSlug}`,
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        slug: family.categorySlug,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new Error(
        `Category not found for product family: ${family.categorySlug}`,
      );
    }

    await prisma.productFamily.upsert({
      where: {
        slug: family.slug,
      },
      update: {
        brandId: brand.id,
        categoryId: category.id,
        name: family.name,
        status: "DRAFT",
        deletedAt: null,
      },
      create: {
        brandId: brand.id,
        categoryId: category.id,
        name: family.name,
        slug: family.slug,
        status: "DRAFT",
      },
    });
  }

  return productFamilies.length;
}