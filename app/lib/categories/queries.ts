import { prisma } from "@/app/lib/prisma";

export const CATEGORIES_PER_PAGE = 12;

export type CategoryCatalogParams = {
  search?: string;
  page?: number;
};

export async function getCategoryCatalog({
  search = "",
  page = 1,
}: CategoryCatalogParams = {}) {
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
          OR: [
            {
              nameAr: {
                contains: normalizedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              nameEn: {
                contains: normalizedSearch,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const totalCategories = await prisma.category.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalCategories / CATEGORIES_PER_PAGE),
  );

  const currentPage = Math.min(
    Math.max(page, 1),
    totalPages,
  );

  const categories = await prisma.category.findMany({
    where,
    orderBy: [
      {
        products: {
          _count: "desc",
        },
      },
      {
        nameAr: "asc",
      },
    ],
    skip: (currentPage - 1) * CATEGORIES_PER_PAGE,
    take: CATEGORIES_PER_PAGE,
    select: {
      id: true,
      slug: true,
      nameAr: true,
      nameEn: true,
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
    categories,
    currentPage,
    totalPages,
    totalCategories,
  };
}