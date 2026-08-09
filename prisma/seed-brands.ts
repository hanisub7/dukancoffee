import type { PrismaClient } from "../app/generated/prisma/client";

const brands = [
  {
    name: "De'Longhi",
    slug: "delonghi",
  },
  {
    name: "Philips",
    slug: "philips",
  },
  {
    name: "Breville",
    slug: "breville",
  },
  {
    name: "Sage",
    slug: "sage",
  },
  {
    name: "Jura",
    slug: "jura",
  },
  {
    name: "Siemens",
    slug: "siemens",
  },
  {
    name: "Nespresso",
    slug: "nespresso",
  },
  {
    name: "Gaggia",
    slug: "gaggia",
  },
] as const;

export async function seedBrands(
  prisma: PrismaClient,
): Promise<number> {
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: {
        slug: brand.slug,
      },
      update: {
        name: brand.name,
        active: true,
        deletedAt: null,
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        active: true,
      },
    });
  }

  return brands.length;
}