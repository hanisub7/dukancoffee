import { prisma } from "@/app/lib/prisma";

export const PRICE_DROPS_PER_PAGE = 12;

export type PriceDropSort =
  | "latest"
  | "saving-desc"
  | "price-asc"
  | "price-desc";

export type PriceDropsParams = {
  sort?: string;
  page?: number;
};

export type PriceDropItem = {
  offerId: string;
  productSlug: string;
  productName: string;
  brandName: string;
  retailerName: string;
  imageUrl: string | null;
  previousPrice: number;
  currentPrice: number;
  savingAmount: number;
  currencyCode: string;
  checkedAt: Date;
};

export type PriceDropsResult = {
  items: PriceDropItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

function normalizePage(value?: number): number {
  if (!value || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeSort(value?: string): PriceDropSort {
  switch (value) {
    case "saving-desc":
    case "price-asc":
    case "price-desc":
    case "latest":
      return value;

    default:
      return "latest";
  }
}

function decimalToNumber(
  value: { toString(): string } | number | string,
): number {
  return Number(value.toString());
}

export async function getPriceDrops(
  params: PriceDropsParams = {},
): Promise<PriceDropsResult> {
  const selectedSort = normalizeSort(params.sort);
  const requestedPage = normalizePage(params.page);

  const offers = await prisma.offer.findMany({
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

      product: {
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
      },

      priceHistory: {
        some: {},
      },
    },

    select: {
      id: true,
      currentPrice: true,
      currencyCode: true,
      checkedAt: true,

      retailer: {
        select: {
          name: true,
        },
      },

      product: {
        select: {
          slug: true,
          fullName: true,

          brand: {
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
        },
      },

      priceHistory: {
        orderBy: {
          checkedAt: "desc",
        },

        take: 2,

        select: {
          price: true,
          checkedAt: true,
        },
      },
    },
  });

   const priceDrops = offers.flatMap<PriceDropItem>((offer) => {
    if (offer.priceHistory.length < 2) {
      return [];
    }

    const latestHistory = offer.priceHistory[0];
    const previousHistory = offer.priceHistory[1];

    const currentPrice = decimalToNumber(latestHistory.price);
    const previousPrice = decimalToNumber(previousHistory.price);

    if (currentPrice >= previousPrice) {
      return [];
    }

    const mainImage =
      offer.product.images.find(
        (image) => image.imageType === "MAIN",
      ) ?? offer.product.images[0];

    return [
      {
        offerId: offer.id,
        productSlug: offer.product.slug,
        productName: offer.product.fullName,
        brandName: offer.product.brand.name,
        retailerName: offer.retailer.name,
        imageUrl: mainImage?.url ?? null,
        previousPrice,
        currentPrice,
        savingAmount: previousPrice - currentPrice,
        currencyCode: offer.currencyCode,
        checkedAt: latestHistory.checkedAt,
      },
    ];
  });
  
  priceDrops.sort((firstItem, secondItem) => {
    switch (selectedSort) {
      case "saving-desc":
        return (
          secondItem.savingAmount - firstItem.savingAmount
        );

      case "price-asc":
        return firstItem.currentPrice - secondItem.currentPrice;

      case "price-desc":
        return secondItem.currentPrice - firstItem.currentPrice;

      case "latest":
      default:
        return (
          secondItem.checkedAt.getTime() -
          firstItem.checkedAt.getTime()
        );
    }
  });

  const totalItems = priceDrops.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PRICE_DROPS_PER_PAGE),
  );

  const currentPage = Math.min(
    requestedPage,
    totalPages,
  );

  const startIndex =
    (currentPage - 1) * PRICE_DROPS_PER_PAGE;

  const items = priceDrops.slice(
    startIndex,
    startIndex + PRICE_DROPS_PER_PAGE,
  );

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
  };
}