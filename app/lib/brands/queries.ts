import { prisma } from "@/app/lib/prisma";

export const BRANDS_PER_PAGE = 12;

export type BrandCatalogParams = {
  search?: string;
  page?: number;
};

export async function getBrandCatalog({
  search = "",
  page = 1,
}: BrandCatalogParams = {}) {
  const normalizedSearch = search.trim();

  const where = {
    active: true,
    deletedAt: null,
    products: {
      some: {
        status: "PUBLISHED" as const,
        deletedAt: null,
      },
    },
    ...(normalizedSearch
      ? {
          name: {
            contains: normalizedSearch,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const totalBrands = await prisma.brand.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalBrands / BRANDS_PER_PAGE),
  );

  const currentPage = Math.min(
    Math.max(page, 1),
    totalPages,
  );

  const brands = await prisma.brand.findMany({
    where,
    orderBy: [
      {
        products: {
          _count: "desc",
        },
      },
      {
        name: "asc",
      },
    ],
    skip: (currentPage - 1) * BRANDS_PER_PAGE,
    take: BRANDS_PER_PAGE,
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

  return {
    brands,
    currentPage,
    totalPages,
    totalBrands,
  };
}