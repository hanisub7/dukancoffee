import { prisma } from "@/app/lib/prisma";

export const PRODUCTS_PER_PAGE = 12;

export type ProductCatalogSort =
  | "updated"
  | "price-asc"
  | "price-desc"
  | "name";

export type ProductCatalogMovement =
  | "down"
  | "up"
  | "same"
  | "none";

export type ProductCatalogParams = {
  search?: string;
  brand?: string;
  category?: string;
  sort?: string;
  page?: number;
};

export type ProductCatalogItem = {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  subtitle: string | null;
  imageUrl: string | null;
  price: number | null;
  currencyCode: string;
  priceMovement: ProductCatalogMovement;
  priceMovementText: string | null;
  isLowestPrice: boolean;
};

export type ProductCatalogFilterOption = {
  value: string;
  label: string;
};

export type ProductCatalogResult = {
  products: ProductCatalogItem[];
  brands: ProductCatalogFilterOption[];
  categories: ProductCatalogFilterOption[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
};

function normalizeText(value?: string): string {
  return value?.trim() ?? "";
}

function normalizePage(value?: number): number {
  if (!value || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeSort(value?: string): ProductCatalogSort {
  switch (value) {
    case "price-asc":
    case "price-desc":
    case "name":
    case "updated":
      return value;

    default:
      return "updated";
  }
}

function decimalToNumber(
  value: { toString(): string } | number | string,
): number {
  return Number(value.toString());
}

function getPriceMovement(
  histories: Array<{
    price: { toString(): string } | number | string;
  }>,
): ProductCatalogMovement {
  if (histories.length < 2) {
    return "none";
  }

  const latestPrice = decimalToNumber(histories[0].price);
  const previousPrice = decimalToNumber(histories[1].price);

  if (latestPrice < previousPrice) {
    return "down";
  }

  if (latestPrice > previousPrice) {
    return "up";
  }

  return "same";
}

function getPriceMovementText(
  movement: ProductCatalogMovement,
): string | null {
  switch (movement) {
    case "down":
      return "Lower than previous price";

    case "up":
      return "Higher than previous price";

    case "same":
      return "No price change";

    default:
      return null;
  }
}

function compareNullablePrices(
  firstPrice: number | null,
  secondPrice: number | null,
  direction: "asc" | "desc",
): number {
  if (firstPrice === null && secondPrice === null) {
    return 0;
  }

  if (firstPrice === null) {
    return 1;
  }

  if (secondPrice === null) {
    return -1;
  }

  if (direction === "asc") {
    return firstPrice - secondPrice;
  }

  return secondPrice - firstPrice;
}

export async function getProductCatalog(
  params: ProductCatalogParams = {},
): Promise<ProductCatalogResult> {
  const search = normalizeText(params.search);
  const selectedBrand = normalizeText(params.brand);
  const selectedCategory = normalizeText(params.category);
  const selectedSort = normalizeSort(params.sort);
  const requestedPage = normalizePage(params.page);

  const [databaseProducts, databaseBrands, databaseCategories] =
    await Promise.all([
      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,

          brand: {
            active: true,
            deletedAt: null,
          },

          category: {
            active: true,
            deletedAt: null,
          },

          ...(selectedBrand
            ? {
                brand: {
                  slug: selectedBrand,
                  active: true,
                  deletedAt: null,
                },
              }
            : {}),

          ...(selectedCategory
            ? {
                category: {
                  slug: selectedCategory,
                  active: true,
                  deletedAt: null,
                },
              }
            : {}),

          ...(search
            ? {
                OR: [
                  {
                    fullName: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    model: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    modelNumber: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    brand: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                  {
                    productFamily: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                ],
              }
            : {}),
        },

        include: {
          brand: {
            select: {
              name: true,
            },
          },

          category: {
            select: {
              nameEn: true,
            },
          },

          productFamily: {
            select: {
              name: true,
            },
          },

          images: {
            orderBy: [
              {
                sortOrder: "asc",
              },
              {
                createdAt: "asc",
              },
            ],
            select: {
              url: true,
              imageType: true,
            },
          },

          offers: {
            where: {
              inStock: true,

              retailer: {
                active: true,
                deletedAt: null,
                country: {
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

        orderBy: {
          updatedAt: "desc",
        },
      }),

      prisma.brand.findMany({
        where: {
          active: true,
          deletedAt: null,
        },

        orderBy: {
          name: "asc",
        },

        select: {
          slug: true,
          name: true,
        },
      }),

      prisma.category.findMany({
        where: {
          active: true,
          deletedAt: null,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            nameEn: "asc",
          },
        ],

        select: {
          slug: true,
          nameEn: true,
        },
      }),
    ]);

  const catalogProducts: ProductCatalogItem[] =
    databaseProducts.map((product) => {
      const mainImage =
        product.images.find(
          (image) => image.imageType === "MAIN",
        ) ?? product.images[0];

      const bestOffer = product.offers[0];

      const price = bestOffer
        ? decimalToNumber(bestOffer.currentPrice)
        : null;

      const priceMovement = bestOffer
        ? getPriceMovement(bestOffer.priceHistory)
        : "none";

      return {
        id: product.id,
        slug: product.slug,
        name: product.fullName,
        brandName: product.brand.name,
        subtitle:
          product.modelNumber ??
          product.model ??
          product.productFamily.name ??
          product.category.nameEn,
        imageUrl: mainImage?.url ?? null,
        price,
        currencyCode: bestOffer?.currencyCode ?? "SAR",
        priceMovement,
        priceMovementText:
          getPriceMovementText(priceMovement),
        isLowestPrice: false,
      };
    });

  catalogProducts.sort((firstProduct, secondProduct) => {
    switch (selectedSort) {
      case "price-asc":
        return compareNullablePrices(
          firstProduct.price,
          secondProduct.price,
          "asc",
        );

      case "price-desc":
        return compareNullablePrices(
          firstProduct.price,
          secondProduct.price,
          "desc",
        );

      case "name":
        return firstProduct.name.localeCompare(
          secondProduct.name,
          "en",
          {
            sensitivity: "base",
          },
        );

      case "updated":
      default:
        return 0;
    }
  });

  const totalProducts = catalogProducts.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalProducts / PRODUCTS_PER_PAGE),
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages,
  );

  const startIndex =
    (currentPage - 1) * PRODUCTS_PER_PAGE;

  const paginatedProducts = catalogProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  return {
    products: paginatedProducts,

    brands: databaseBrands.map((brand) => ({
      value: brand.slug,
      label: brand.name,
    })),

    categories: databaseCategories.map((category) => ({
      value: category.slug,
      label: category.nameEn,
    })),

    currentPage,
    totalPages,
    totalProducts,
  };
}