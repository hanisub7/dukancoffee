import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import PriceHistoryChart from "@/components/products/PriceHistoryChart";
import ProductGallery from "@/app/components/products/ProductGallery";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type PriceValue =
  | number
  | string
  | {
      toString(): string;
    };

type PriceMovement = "down" | "up" | "same" | "none";

function decimalToNumber(value: PriceValue): number {
  return Number(value.toString());
}

function formatPrice(
  value: PriceValue,
  currencyCode: string,
): string {
  const numericValue = decimalToNumber(value);

  const formattedNumber = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericValue);

  return `${formattedNumber} ${currencyCode}`;
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function getConditionalPromotionPrice(
  currentPrice: PriceValue,
  promotion: {
    discountPercent: number | null;
    discountAmount: PriceValue | null;
  },
): number | null {
  const regularPrice = decimalToNumber(currentPrice);

  if (promotion.discountPercent !== null) {
    return Math.max(
      0,
      regularPrice * (1 - promotion.discountPercent / 100),
    );
  }

  if (promotion.discountAmount !== null) {
    return Math.max(
      0,
      regularPrice -
        decimalToNumber(promotion.discountAmount),
    );
  }

  return null;
}

type OfferRankingInput = {
  currentPrice: PriceValue;
  promotions: Array<{
    discountPercent: number | null;
    discountAmount: PriceValue | null;
  }>;
};

function getOfferRankingValue(
  offer: OfferRankingInput,
): {
  publicPrice: number;
  conditionalPrice: number | null;
} {
  const promotionPrices = offer.promotions
    .map((promotion) =>
      getConditionalPromotionPrice(
        offer.currentPrice,
        promotion,
      ),
    )
    .filter(
      (price): price is number => price !== null,
    );

  return {
    publicPrice: decimalToNumber(offer.currentPrice),
    conditionalPrice:
      promotionPrices.length > 0
        ? Math.min(...promotionPrices)
        : null,
  };
}

function getPriceMovement(
  histories: Array<{
    price: PriceValue;
  }>,
): PriceMovement {
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

function getPriceMovementSymbol(
  movement: PriceMovement,
): "↓" | "↑" | "→" {
  switch (movement) {
    case "down":
      return "↓";

    case "up":
      return "↑";

    case "same":
    case "none":
    default:
      return "→";
  }
}

function getPriceMovementLabel(
  movement: PriceMovement,
): string {
  switch (movement) {
    case "down":
      return "السعر أقل من السعر السابق";

    case "up":
      return "السعر أعلى من السعر السابق";

    case "same":
      return "لا يوجد تغير في السعر";

    case "none":
    default:
      return "لا تتوفر مقارنة بعد";
  }
}


type ProductSpecificationView = {
  machineType: string | null;
  pumpPressureBar: PriceValue | null;
  waterTankL: PriceValue | null;
  beanHopperG: number | null;
  groundsContainerCapacity: number | null;
  grinderType: string | null;
  grinderMaterial: string | null;
  grindSettings: number | null;
  milkSystem: string | null;
  milkContainerCapacityL: PriceValue | null;
  displayType: string | null;
  powerW: number | null;
  voltage: string | null;
  frequencyHz: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  weightKg: PriceValue | null;
  removableWaterTank: boolean | null;
  removableBrewGroup: boolean | null;
  waterFilterCompatible: boolean | null;
};

type SpecificationItem = {
  label: string;
  value: string;
};

type SpecificationSection = {
  title: string;
  items: SpecificationItem[];
};

function hasSpecificationValue(
  value: string | number | boolean | PriceValue | null | undefined,
): boolean {
  return value !== null && value !== undefined && value !== "";
}

function formatSpecificationNumber(
  value: PriceValue,
  unit: string,
  maximumFractionDigits = 2,
): string {
  const formattedValue = new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(decimalToNumber(value));

  return `${formattedValue} ${unit}`;
}

function formatSpecificationBoolean(value: boolean): string {
  return value ? "نعم" : "لا";
}

function buildSpecificationSections(
  specification: ProductSpecificationView | null,
): SpecificationSection[] {
  if (!specification) {
    return [];
  }

  const createItems = (
    items: Array<SpecificationItem | null>,
  ): SpecificationItem[] =>
    items.filter(
      (item): item is SpecificationItem => item !== null,
    );

  const sections: SpecificationSection[] = [
    {
      title: "عام",
      items: createItems([
        hasSpecificationValue(specification.machineType)
          ? { label: "نوع الماكينة", value: specification.machineType as string }
          : null,
        hasSpecificationValue(specification.pumpPressureBar)
          ? { label: "ضغط المضخة", value: formatSpecificationNumber(specification.pumpPressureBar as PriceValue, "بار") }
          : null,
        hasSpecificationValue(specification.waterTankL)
          ? { label: "سعة خزان الماء", value: formatSpecificationNumber(specification.waterTankL as PriceValue, "لتر") }
          : null,
        hasSpecificationValue(specification.beanHopperG)
          ? { label: "سعة حاوية الحبوب", value: formatSpecificationNumber(specification.beanHopperG as number, "جم", 0) }
          : null,
        hasSpecificationValue(specification.groundsContainerCapacity)
          ? { label: "سعة حاوية تفل القهوة", value: formatSpecificationNumber(specification.groundsContainerCapacity as number, "حصة", 0) }
          : null,
      ]),
    },
    {
      title: "الطاحونة",
      items: createItems([
        hasSpecificationValue(specification.grinderType)
          ? { label: "نوع الطاحونة", value: specification.grinderType as string }
          : null,
        hasSpecificationValue(specification.grinderMaterial)
          ? { label: "مادة الطاحونة", value: specification.grinderMaterial as string }
          : null,
        hasSpecificationValue(specification.grindSettings)
          ? { label: "درجات الطحن", value: formatSpecificationNumber(specification.grindSettings as number, "درجة", 0) }
          : null,
      ]),
    },
    {
      title: "نظام الحليب",
      items: createItems([
        hasSpecificationValue(specification.milkSystem)
          ? { label: "نوع نظام الحليب", value: specification.milkSystem as string }
          : null,
        hasSpecificationValue(specification.milkContainerCapacityL)
          ? { label: "سعة حاوية الحليب", value: formatSpecificationNumber(specification.milkContainerCapacityL as PriceValue, "لتر") }
          : null,
      ]),
    },
    {
      title: "الشاشة والكهرباء",
      items: createItems([
        hasSpecificationValue(specification.displayType)
          ? { label: "نوع الشاشة", value: specification.displayType as string }
          : null,
        hasSpecificationValue(specification.powerW)
          ? { label: "القدرة الكهربائية", value: formatSpecificationNumber(specification.powerW as number, "واط", 0) }
          : null,
hasSpecificationValue(specification.voltage)
  ? {
      label: "الجهد الكهربائي",
      value: (specification.voltage as string)
        .replace(/\s*V$/i, " فولت")
        .replace(/\s*VAC$/i, " فولت"),
    }
  : null,
hasSpecificationValue(specification.frequencyHz)
  ? {
      label: "التردد",
      value: formatSpecificationNumber(
        specification.frequencyHz as number,
        "هرتز",
        0,
      ),
    }
  : null,
      ]),
    },
    {
      title: "الأبعاد والوزن",
      items: createItems([
        hasSpecificationValue(specification.widthMm)
          ? { label: "العرض", value: formatSpecificationNumber(specification.widthMm as number, "مم", 0) }
          : null,
        hasSpecificationValue(specification.heightMm)
          ? { label: "الارتفاع", value: formatSpecificationNumber(specification.heightMm as number, "مم", 0) }
          : null,
        hasSpecificationValue(specification.depthMm)
          ? { label: "العمق", value: formatSpecificationNumber(specification.depthMm as number, "مم", 0) }
          : null,
        hasSpecificationValue(specification.weightKg)
          ? { label: "الوزن", value: formatSpecificationNumber(specification.weightKg as PriceValue, "كجم") }
          : null,
      ]),
    },
    {
      title: "الأجزاء القابلة للإزالة والتوافق",
      items: createItems([
        hasSpecificationValue(specification.removableWaterTank)
          ? { label: "خزان ماء قابل للإزالة", value: formatSpecificationBoolean(specification.removableWaterTank as boolean) }
          : null,
        hasSpecificationValue(specification.removableBrewGroup)
          ? { label: "وحدة تحضير قابلة للإزالة", value: formatSpecificationBoolean(specification.removableBrewGroup as boolean) }
          : null,
        hasSpecificationValue(specification.waterFilterCompatible)
          ? { label: "متوافقة مع فلتر الماء", value: formatSpecificationBoolean(specification.waterFilterCompatible as boolean) }
          : null,
      ]),
    },
  ];

  return sections.filter((section) => section.items.length > 0);
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
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

select: {
  id: true,
  slug: true,
  fullName: true,
  model: true,
  modelNumber: true,
  updatedAt: true,

  brandId: true,
  categoryId: true,
  productFamilyId: true,

      brand: {
        select: {
          name: true,
          slug: true,
        },
      },

      category: {
        select: {
          nameAr: true,
          nameEn: true,
          slug: true,
        },
      },

      productFamily: {
        select: {
          name: true,
        },
      },

      specification: {
        select: {
          machineType: true,
          pumpPressureBar: true,
          waterTankL: true,
          beanHopperG: true,
          groundsContainerCapacity: true,

          grinderType: true,
          grinderMaterial: true,
          grindSettings: true,

          milkSystem: true,
          milkContainerCapacityL: true,

          displayType: true,
          powerW: true,
          voltage: true,
          frequencyHz: true,

          widthMm: true,
          heightMm: true,
          depthMm: true,
          weightKg: true,

          removableWaterTank: true,
          removableBrewGroup: true,
          waterFilterCompatible: true,
        },
      },

      features: {
        orderBy: {
          createdAt: "asc",
        },

        select: {
          feature: {
            select: {
              name: true,
              description: true,
              slug: true,
            },
          },
        },
      },

      boxContents: {
        orderBy: {
          createdAt: "asc",
        },

        select: {
          id: true,
          itemName: true,
          quantity: true,
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
          id: true,
          url: true,
          altText: true,
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

  select: {
    id: true,

    currentPrice: true,
    originalPrice: true,
    discountPercent: true,

    currencyCode: true,
    checkedAt: true,

    productUrl: true,
    affiliateUrl: true,

    retailer: {
      select: {
        name: true,
        slug: true,
      },
    },

    promotions: {
      where: {
        active: true,

        OR: [
          {
            endsAt: null,
          },
          {
            endsAt: {
              gte: new Date(),
            },
          },
        ],
      },

      orderBy: [
        {
          promotionType: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

      select: {
        id: true,
        promotionType: true,
        title: true,
        description: true,
        couponCode: true,
        bankName: true,
        discountPercent: true,
        discountAmount: true,
        cashbackPercent: true,
        cashbackAmount: true,
        installmentMonths: true,
        freeGiftDescription: true,
        startsAt: true,
        endsAt: true,
        terms: true,
      },
    },

    priceHistory: {
      orderBy: {
        checkedAt: "desc",
      },


      select: {
        id: true,
        price: true,
        checkedAt: true,
      },
    },
  },
},
    },
  });
}

async function getRelatedProducts(product: {
  id: string;
  brandId: string;
  categoryId: string;
  productFamilyId: string | null;
}) {
  const familyProducts =
    product.productFamilyId !== null
      ? await prisma.product.findMany({
          where: {
            id: {
              not: product.id,
            },
            status: "PUBLISHED",
            deletedAt: null,
            productFamilyId: product.productFamilyId,
          },
          take: 4,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            slug: true,
            fullName: true,

            brand: {
              select: {
                name: true,
              },
            },

images: {
  where: {
    imageType: "MAIN",
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
  },
},
          },
        })
      : [];

  if (familyProducts.length >= 4) {
    return familyProducts;
  }

  const brandProducts = await prisma.product.findMany({
    where: {
      id: {
        notIn: [
          product.id,
          ...familyProducts.map((item) => item.id),
        ],
      },
      status: "PUBLISHED",
      deletedAt: null,
      brandId: product.brandId,
    },
    take: 4 - familyProducts.length,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      fullName: true,

      brand: {
        select: {
          name: true,
        },
      },

images: {
  where: {
    imageType: "MAIN",
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
  },
},
    },
  });

  const selectedProducts = [
  ...familyProducts,
  ...brandProducts,
];

if (selectedProducts.length >= 4) {
  return selectedProducts;
}

const categoryProducts = await prisma.product.findMany({
  where: {
    id: {
      notIn: [
        product.id,
        ...selectedProducts.map((item) => item.id),
      ],
    },
    status: "PUBLISHED",
    deletedAt: null,
    categoryId: product.categoryId,
  },
  take: 4 - selectedProducts.length,
  orderBy: {
    updatedAt: "desc",
  },
  select: {
    id: true,
    slug: true,
    fullName: true,

    brand: {
      select: {
        name: true,
      },
    },

images: {
  where: {
    imageType: "MAIN",
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
  },
},
  },
});

return [...selectedProducts, ...categoryProducts];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود",
    };
  }

  return {
    title: product.fullName,
    description: `قارن أسعار ${product.fullName} وتابع تغير السعر عبر DukanCoffee.`,
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

function ProductImage({
  imageUrl,
  alt,
}: {
  imageUrl?: string | null;
  alt: string;
}) {
  if (!imageUrl) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-neutral-50">
        <div className="text-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="mx-auto h-28 w-28 text-black/20"
            aria-hidden="true"
          >
            <rect
              x="27"
              y="17"
              width="66"
              height="82"
              rx="13"
              stroke="currentColor"
              strokeWidth="4"
            />

            <rect
              x="37"
              y="28"
              width="46"
              height="21"
              rx="6"
              stroke="currentColor"
              strokeWidth="3"
            />

            <path
              d="M43 63H77"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M60 64V79"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              d="M45 88H75"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <p className="mt-4 text-sm text-black/45">
            لا تتوفر صورة حاليًا
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

function ProductFeatures({
  features,
}: {
  features: {
    feature: {
      name: string;
      description: string | null;
      slug: string;
    };
  }[];
}) {
  if (features.length === 0) return null;

return (
  <section className="py-6">
    <div className="mb-6 text-center">
      <h2 className="text-3xl font-bold text-stone-900">
        المميزات
      </h2>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {features.map(({ feature }) => (
          <div
            key={feature.slug}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
  ✓
</div>

              <div>
                <h3 className="font-semibold text-stone-900">
                  {feature.name}
                </h3>

                {feature.description && (
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const mainImage =
    product.images.find(
      (image) => image.imageType === "MAIN",
    ) ?? product.images[0];

  const additionalImages = product.images.filter(
    (image) => image.id !== mainImage?.id,
  );

  const rankedOffers = product.offers
  .map((offer, originalIndex) => ({
    offer,
    originalIndex,
    ranking: getOfferRankingValue(offer),
  }))
  .sort((firstItem, secondItem) => {
    const publicPriceDifference =
      firstItem.ranking.publicPrice -
      secondItem.ranking.publicPrice;

    if (publicPriceDifference !== 0) {
      return publicPriceDifference;
    }

    const firstConditionalPrice =
      firstItem.ranking.conditionalPrice;

    const secondConditionalPrice =
      secondItem.ranking.conditionalPrice;

    if (
      firstConditionalPrice !== null &&
      secondConditionalPrice !== null &&
      firstConditionalPrice !== secondConditionalPrice
    ) {
      return (
        firstConditionalPrice -
        secondConditionalPrice
      );
    }

    if (
      firstConditionalPrice !== null &&
      secondConditionalPrice === null
    ) {
      return -1;
    }

    if (
      firstConditionalPrice === null &&
      secondConditionalPrice !== null
    ) {
      return 1;
    }

    return firstItem.originalIndex - secondItem.originalIndex;
  })
  .map((item) => item.offer);

const bestOffer = rankedOffers[0] ?? null;

const firstRankedOfferValue = bestOffer
  ? getOfferRankingValue(bestOffer)
  : null;

const secondRankedOfferValue = rankedOffers[1]
  ? getOfferRankingValue(rankedOffers[1])
  : null;

const hasUniqueBestOffer =
  rankedOffers.length === 1 ||
  (firstRankedOfferValue !== null &&
    secondRankedOfferValue !== null &&
    (firstRankedOfferValue.publicPrice !==
      secondRankedOfferValue.publicPrice ||
      firstRankedOfferValue.conditionalPrice !==
        secondRankedOfferValue.conditionalPrice));

const bestOfferId =
  hasUniqueBestOffer && bestOffer
    ? bestOffer.id
    : null;

const bestOfferMovement = bestOffer
  ? getPriceMovement(bestOffer.priceHistory)
  : "none";

const bestPromotion =
  bestOffer?.promotions.find(
    (promotion) =>
      promotion.discountPercent !== null ||
      promotion.discountAmount !== null,
  ) ?? null;

const bestConditionalPrice =
  bestOffer && bestPromotion
    ? getConditionalPromotionPrice(
        bestOffer.currentPrice,
        bestPromotion,
      )
    : null;

/*
 * Factual price detection used by the comparison badges.
 */
const publicPrices = product.offers.map((offer) =>
  decimalToNumber(offer.currentPrice),
);

const lowestPublicPrice =
  publicPrices.length > 0
    ? Math.min(...publicPrices)
    : null;
    const lowestPublicPriceRetailerCount =
  lowestPublicPrice !== null
    ? product.offers.filter(
        (offer) =>
          decimalToNumber(offer.currentPrice) ===
          lowestPublicPrice,
      ).length
    : 0;

const allPublicPricesEqual =
  publicPrices.length > 1 &&
  publicPrices.every(
    (price) => price === publicPrices[0],
  );

const eligiblePromotionPrices = product.offers.flatMap(
  (offer) =>
    offer.promotions
      .map((promotion) => {
        const price = getConditionalPromotionPrice(
          offer.currentPrice,
          promotion,
        );

        if (price === null) {
          return null;
        }

        return {
          offerId: offer.id,
          price,
        };
      })
      .filter(
        (
          item,
        ): item is {
          offerId: string;
          price: number;
        } => item !== null,
      ),
);

const lowestEligiblePrice =
  eligiblePromotionPrices.length > 0
    ? Math.min(
        ...eligiblePromotionPrices.map(
          (item) => item.price,
        ),
      )
    : null;

const allEligiblePricesEqual =
  eligiblePromotionPrices.length > 1 &&
  eligiblePromotionPrices.every(
    (item) =>
      item.price ===
      eligiblePromotionPrices[0].price,
  );

const lowestConditionalOfferIds =
  lowestEligiblePrice === null
    ? []
    : rankedOffers
        .filter((offer) => {
          const ranking =
            getOfferRankingValue(offer);

          return (
            ranking.conditionalPrice ===
            lowestEligiblePrice
          );
        })
        .map((offer) => offer.id);

const bestConditionalOfferId =
  lowestConditionalOfferIds.length === 1
    ? lowestConditionalOfferIds[0]
    : null;

const hasAnyConditionalPromotion = rankedOffers.some((offer) =>
  offer.promotions.some(
    (promotion) =>
      promotion.discountPercent !== null ||
      promotion.discountAmount !== null,
  ),
);

const productSubtitle =
    product.modelNumber ??
    product.productFamily.name;

  const specificationSections = buildSpecificationSections(
  product.specification,
);

const hasSpecifications = specificationSections.length > 0;
const quickFacts = product.specification
  ? [
      product.specification.machineType
        ? {
            label: "نوع الماكينة",
            value: product.specification.machineType,
            icon: "☕",
          }
        : null,

      product.specification.grinderType
        ? {
            label: "الطاحونة",
            value: product.specification.grinderType,
            icon: "⚙",
          }
        : null,

      product.specification.waterTankL
        ? {
            label: "خزان الماء",
            value: formatSpecificationNumber(
              product.specification.waterTankL,
              "لتر",
            ),
            icon: "◉",
          }
        : null,

      product.specification.pumpPressureBar
        ? {
            label: "ضغط المضخة",
            value: formatSpecificationNumber(
              product.specification.pumpPressureBar,
              "بار",
            ),
            icon: "↗",
          }
        : null,

      product.specification.displayType
        ? {
            label: "الشاشة",
            value: product.specification.displayType,
            icon: "▣",
          }
        : null,

      product.specification.milkSystem
        ? {
            label: "نظام الحليب",
            value: product.specification.milkSystem,
            icon: "◌",
          }
        : null,
    ].filter(
      (
        item,
      ): item is {
        label: string;
        value: string;
        icon: string;
      } => item !== null,
    )
  : [];


const relatedProducts = await getRelatedProducts({
  id: product.id,
  brandId: product.brandId,
  categoryId: product.categoryId,
  productFamilyId: product.productFamilyId,
});

const hasAffiliateOffers = rankedOffers.some(
  (offer) => Boolean(offer.affiliateUrl),
);
const productCanonicalUrl =
  `https://dukancoffee.com/products/${product.slug}`;

const productImages = product.images
  .map((image) => image.url)
  .filter(Boolean);

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",

  name: product.fullName,

  url: productCanonicalUrl,

  brand: {
    "@type": "Brand",
    name: product.brand.name,
  },

  category: product.category.nameAr,

  ...(product.model
    ? {
        model: product.model,
      }
    : {}),

  ...(product.modelNumber
    ? {
        mpn: product.modelNumber,
      }
    : {}),

  ...(productImages.length > 0
    ? {
        image: productImages,
      }
    : {}),

  ...(rankedOffers.length > 0
    ? {
        offers: rankedOffers.map((offer) => ({
          "@type": "Offer",

          price: decimalToNumber(
            offer.currentPrice,
          ),

          priceCurrency: offer.currencyCode,

          url: offer.productUrl,

          seller: {
            "@type": "Organization",
            name: offer.retailer.name,
          },
        })),
      }
    : {}),
};

  return (
    <main
      dir="rtl"
      data-has-specifications={
        hasSpecifications ? "true" : "false"
      }
      className="min-h-screen bg-white text-black"
    >
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(productJsonLd).replace(
      /</g,
      "\\u003c",
    ),
  }}
/>

      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <nav
          aria-label="مسار الصفحة"
          className="flex flex-wrap items-center gap-2 text-sm text-black/50"
        >
          <Link
            href="/"
            className="transition-colors hover:text-black"
          >
            الرئيسية
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href="/products"
            className="transition-colors hover:text-black"
          >
            آلات القهوة
          </Link>

          <span aria-hidden="true">/</span>

          <span className="min-w-0 text-black/70">
            {product.fullName}
          </span>
        </nav>
      </div>

      <section className="border-y border-black/10 bg-[#F8F8F8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-6">
          <div>
<ProductGallery
  productName={product.fullName}
  images={[
    ...(mainImage ? [mainImage] : []),
    ...additionalImages,
  ]}
/>
          </div>

<div className="flex flex-col justify-center">


 <div className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
<div className="border-b border-stone-100 pb-6">
  <h1
    dir="ltr"
    className="text-left text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl"
  >
    {product.fullName}
  </h1>
  <div
  dir="ltr"
  className="mt-3 flex flex-wrap items-center justify-start gap-x-3 gap-y-1 text-left text-sm text-stone-500"
>
  <span className="font-semibold text-stone-700">
    {product.brand.name}
  </span>

  {product.model ? (
    <>
      <span className="text-stone-300">•</span>
      <span>{product.modelNumber}</span>
    </>
  ) : null}
</div>
</div>

  {bestOffer ? (
    <>
      <p className="text-sm font-semibold text-[#C85A1A]">
        أفضل سعر متاح
      </p>

<div className="mt-3">
{hasUniqueBestOffer &&
bestOffer.originalPrice &&
decimalToNumber(bestOffer.originalPrice) >
  decimalToNumber(bestOffer.currentPrice) ? (
    <div
      dir="ltr"
      className="mb-1 flex items-center justify-end gap-2 text-left lg:justify-start"
    >
      <span className="text-base font-medium text-stone-400 line-through">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 0,
        }).format(
          decimalToNumber(bestOffer.originalPrice),
        )}
      </span>

      <span className="text-sm font-medium text-stone-400">
        {bestOffer.currencyCode}
      </span>
    </div>
  ) : null}

  <div
    dir="ltr"
    className="flex items-baseline justify-end gap-3 text-left lg:justify-start"
  >
    <span className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
      {new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(
        decimalToNumber(bestOffer.currentPrice),
      )}
    </span>

    <span className="pb-2 text-lg font-semibold text-stone-500">
      {bestOffer.currencyCode}
    </span>
  </div>
</div>

{bestOfferMovement !== "none" ? (
  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700">
    <span
      className="text-base font-semibold text-stone-700"
      aria-hidden="true"
    >
      {getPriceMovementSymbol(bestOfferMovement)}
    </span>

    <span>
      {getPriceMovementLabel(bestOfferMovement)}
    </span>
  </div>
) : null}

<div className="mt-5 border-t border-stone-100 pt-4">
  <p className="text-sm font-semibold text-stone-900">
    {lowestPublicPriceRetailerCount > 1
      ? `متوفر بهذا السعر لدى ${lowestPublicPriceRetailerCount} متاجر`
      : bestOffer.retailer.name}
  </p>


</div>
{bestPromotion &&
bestConditionalPrice !== null ? (
  <a
    href="#offers"
    className="mt-6 block rounded-2xl border border-orange-200 bg-orange-50 p-5 transition hover:border-orange-300 hover:bg-orange-100/60"
  >
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#C85A1A]">
           عرض خاص
        </span>

        {bestPromotion.discountPercent !== null ? (
          <span className="text-xs font-semibold text-stone-600">
            خصم {bestPromotion.discountPercent}%
          </span>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium text-stone-600">
          يمكن أن يصل السعر إلى
        </p>

        <p
          dir="ltr"
          className="mt-1 text-3xl font-bold text-[#C85A1A]"
        >
          {formatPrice(
            bestConditionalPrice,
            bestOffer.currencyCode,
          )}
        </p>
      </div>

      <div className="rounded-xl bg-white/80 p-4">
        <p className="text-sm font-semibold text-stone-900">
          {bestPromotion.bankName
            ? `مع بطاقات ${bestPromotion.bankName} المؤهلة`
            : bestPromotion.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-stone-500">
          هذا السعر غير متاح لجميع المشترين، ويتطلب
          استيفاء شروط العرض.
        </p>
      </div>

      <p className="text-xs font-bold text-[#C85A1A]">
        عرض التفاصيل والشروط ↓
      </p>
    </div>
  </a>
) : null}
    </>
  ) : (
    <div>
      <p className="text-lg font-semibold">
        لا يوجد سعر متاح حاليًا
      </p>


    </div>
  )}
</div>

            {bestOffer ? (
              <a
                href="#offers"
                className="mt-2 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand px-6 text-base font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                عرض جميع الأسعار ↓
              </a>
            ) : null}

            <p className="mt-4 text-xs leading-5 !text-white/40">
              آخر تحديث للمنتج:{" "}
              {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </section>
{quickFacts.length > 0 ? (
  <section className="border-b border-stone-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-sm font-semibold text-[#C85A1A]">
          نظرة سريعة
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          أهم المواصفات
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {quickFacts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-3xl border border-stone-200 bg-white p-6 min-h-[170px] ..."
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-lg font-semibold text-[#C85A1A]">
              <span aria-hidden="true">
                {fact.icon}
              </span>
            </div>

            <p className="mt-5 text-xs font-medium text-stone-500">
              {fact.label}
            </p>

            <p
              dir="ltr"
              className="mt-3 text-center text-lg font-bold text-stone-900 leading-7"
            >
              {fact.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
) : null}

      <section
  id="offers"
  className="mx-auto max-w-7xl px-4 pt-5 pb-6 sm:px-6 lg:px-8 lg:pt-6 lg:pb-8"
>
  <div className="mb-8 text-center">
  <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
    مقارنة الأسعار
  </h2>

  <p className="mt-3 text-base text-stone-500">
    قارن السعر المتاح للجميع والعروض المشروطة قبل الانتقال إلى المتجر.
  </p>
</div>

 {product.offers.length > 0 ? (
  <>
    {(allPublicPricesEqual ||
      allEligiblePricesEqual) ? (
      <div className="mt-8 space-y-3">
        {allPublicPricesEqual ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
            جميع المتاجر تعرض نفس السعر المتاح للجميع حاليًا.
          </div>
        ) : null}

        {allEligiblePricesEqual ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-600">
            أقل الأسعار المشروطة متساوية لدى المتاجر المؤهلة
            حاليًا.
          </div>
        ) : null}
      </div>
    ) : null}

<div
  className={`overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_10px_35px_rgba(28,25,23,0.06)] ${
    allPublicPricesEqual || allEligiblePricesEqual
      ? "mt-5"
      : "mt-8"
  }`}
>
<div className="overflow-x-auto">
  <table className="w-full min-w-[700px] table-fixed">
    <thead className="border-b border-stone-200 bg-[#fafaf9]">
      <tr>
        <th className="w-1/3 px-5 py-4 text-right text-sm font-semibold text-stone-700">
          المتجر
        </th>

        <th className="w-1/3 px-5 py-4 text-center text-sm font-semibold text-stone-700">
          السعر
        </th>

        {hasAnyConditionalPromotion ? (
          <th className="px-5 py-4 text-right text-sm font-semibold text-stone-700">
            عرض خاص
          </th>
        ) : null}

        <th className="px-5 py-4 text-center text-sm font-semibold text-stone-700">
          زيارة المتجر
        </th>
      </tr>
    </thead>

    <tbody>
      {rankedOffers.map((offer) => {
        const retailerUrl =
          offer.affiliateUrl ?? offer.productUrl;

        const primaryPromotion =
          offer.promotions.find(
            (promotion) =>
              promotion.discountPercent !== null ||
              promotion.discountAmount !== null,
          ) ?? null;

const conditionalPrice = primaryPromotion
  ? getConditionalPromotionPrice(
      offer.currentPrice,
      primaryPromotion,
    )
  : null;

return (
          <tr
            key={offer.id}
            className="border-b border-stone-100 last:border-b-0"
          >
            <td className="px-6 py-6 align-middle">
              <p className="text-xl font-bold text-stone-900">
                {offer.retailer.name}
              </p>

              {offer.id === bestOfferId ? (
                <div className="mt-3">
                  <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-[#C85A1A]">
                    أفضل سعر متاح
                  </span>
                </div>
              ) : null}

              {offer.id === bestConditionalOfferId ? (
                <div className="mt-3">
                  <span className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
                    أفضل سعر مشروط
                  </span>
                </div>
              ) : null}
            </td>

<td className="px-6 py-6 text-center align-middle">
  {offer.originalPrice &&
  Number(offer.originalPrice) >
    Number(offer.currentPrice) ? (
    <p
      dir="ltr"
      className="mb-1 text-center text-sm font-medium text-stone-400 line-through"
    >
      {formatPrice(
        offer.originalPrice,
        offer.currencyCode,
      )}
    </p>
  ) : null}

  <p
    dir="ltr"
    className="text-center text-2xl font-bold text-stone-900"
  >
    {formatPrice(
      offer.currentPrice,
      offer.currencyCode,
    )}
  </p>
</td>

            {hasAnyConditionalPromotion ? (
              <td className="px-6 py-6 align-middle">
                {conditionalPrice !== null &&
                primaryPromotion ? (
                  <div>
                    <p
                      dir="ltr"
                      className="text-xl font-bold text-[#C85A1A]"
                    >
                      {formatPrice(
                        conditionalPrice,
                        offer.currencyCode,
                      )}
                    </p>

                    {primaryPromotion.discountPercent !==
                    null ? (
                      <p className="mt-1 text-xs text-stone-500">
                        خصم{" "}
                        {
                          primaryPromotion.discountPercent
                        }
                        %
                      </p>
                    ) : null}

                    {primaryPromotion.bankName ? (
                      <p className="mt-1 text-xs text-stone-600">
                        مع بطاقات{" "}
                        {primaryPromotion.bankName}
                      </p>
                    ) : null}

                    {primaryPromotion.endsAt ? (
                      <p className="mt-1 text-xs text-stone-400">
                        حتى{" "}
                        {formatDate(
                          primaryPromotion.endsAt,
                        )}
                      </p>
                    ) : null}


                  </div>
                ) : (
                  <span className="text-sm text-stone-400">
                    —
                  </span>
                )}
              </td>
            ) : null}

            <td className="px-6 py-6 text-center align-middle">
              <a
                href={retailerUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                الانتقال للمتجر
              </a>
            </td>
          </tr>
        );
      })}
    </tbody>
</table>
</div>

{hasAffiliateOffers ? (
  <div className="border-t border-stone-100 px-5 py-3">
    <p className="text-xs text-stone-500">
      قد نحصل على عمولة دون تكلفة إضافية على المشتري.
    </p>
  </div>
) : null}

<div className="border-t border-stone-100 bg-stone-50 px-5 py-4">
        <p className="text-xs leading-5 text-stone-500">
          الأسعار المشروطة تتطلب استيفاء شروط العرض، مثل
          استخدام بطاقة بنكية مؤهلة أو رمز خصم. تحقق من
          التفاصيل قبل الشراء.
        </p>
      </div>
    </div>

    </>
  ) : (
    <div className="mt-7 rounded-2xl border border-dashed border-black/15 bg-neutral-50 px-6 py-14 text-center">
      <h3 className="font-semibold text-black">
        لا توجد عروض متاحة
      </h3>

    </div>
  )}
</section>

{hasSpecifications ? (
  <section className="border-y border-stone-200 bg-[#F8F8F8]">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          المواصفات
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          المواصفات الفنية المتوفرة لهذه الماكينة.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
{specificationSections.map((section, index) => (
  <div
    key={section.title}
    className={`overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${
      specificationSections.length % 2 === 1 &&
      index === specificationSections.length - 1
        ? "lg:col-span-2"
        : ""
    }`}
  >
<div className="border-b border-stone-200 bg-[#fafaf9] px-6 py-4">
  <h3 className="text-lg font-bold tracking-tight text-stone-900">
    {section.title}
  </h3>
</div>

            <div>
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between gap-8 px-6 py-5 transition-colors hover:bg-[#fcfcfb] ${
                    index > 0
                      ? "border-t border-stone-200"
                      : ""
                  } ${
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-stone-50/70"
                  }`}
                >
<span className="text-sm font-medium text-stone-600">
  {item.label}
</span>

<span
  dir="ltr"
  className="text-left text-base font-bold text-stone-900"
>
  {item.value}
</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
) : null}

      <ProductFeatures features={product.features} />


      {bestOffer &&
      bestOffer.priceHistory.length > 0 ? (
        <section className="border-y border-stone-200 bg-[#F8F8F8]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-2xl text-center">
<div className="text-center">
 
  <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
    سجل تغير الأسعار
  </h2>

  <p className="mt-3 text-base leading-7 text-stone-500">
    راقب تطور السعر بمرور الوقت لاتخاذ قرار شراء أفضل.
  </p>
</div>
            </div>

<div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
<PriceHistoryChart
  currencyCode={bestOffer.currencyCode}
  data={[
    ...bestOffer.priceHistory.map((item) => ({
      id: item.id,
      price: decimalToNumber(item.price),
      checkedAt: item.checkedAt.toISOString(),
    })),
    {
      id: `current-${bestOffer.id}`,
      price: decimalToNumber(bestOffer.currentPrice),
      checkedAt: bestOffer.checkedAt.toISOString(),
    },
  ]}
/>
</div>
          </div>
        </section>
      ) : null}

    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  {relatedProducts.length > 0 ? (
    <div>
      <div className="mb-7 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          قد يعجبك أيضًا
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          منتجات مشابهة قد تهمك.
        </p>
      </div>

<div
  className={`grid gap-5 ${
    relatedProducts.length === 1
      ? "mx-auto max-w-sm grid-cols-1"
      : relatedProducts.length === 2
        ? "mx-auto w-full max-w-2xl grid-cols-1 md:grid-cols-2"
        : relatedProducts.length === 3
          ? "mx-auto max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
  }`}
>
{relatedProducts.map((item) => {
  const offer = item.offers[0] ?? null;

  return (
    <Link
      key={item.id}
      href={`/products/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
    >
      <div className="flex h-48 items-center justify-center overflow-hidden border-b border-stone-100 bg-[#FAFAF9] p-5 sm:h-56 sm:p-6 lg:h-60 lg:p-8">
        {item.images[0]?.url ? (
          <img
            src={item.images[0].url}
            alt={item.fullName}
            className="max-h-full max-w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="text-sm text-stone-400">
            لا توجد صورة
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p
          dir="ltr"
          className="text-left text-xs font-semibold uppercase tracking-wide text-[#C85A1A]"
        >
          {item.brand.name}
        </p>

        <h3
          dir="ltr"
          className="mt-2 line-clamp-2 min-h-14 text-left text-lg font-bold leading-7 text-stone-900"
        >
          {item.fullName}
        </h3>

        <div className="mt-4 border-t border-stone-100 pt-4">
          <p className="text-xs font-medium text-stone-500">
            السعر الحالي
          </p>

          {offer ? (
            <p
              dir="ltr"
              className="mt-1 text-left text-xl font-bold text-[#C85A1A]"
            >
              {formatPrice(
                offer.currentPrice,
                offer.currencyCode,
              )}
            </p>
          ) : (
            <p className="mt-1 text-sm font-medium text-stone-500">
              السعر غير متوفر حاليًا
            </p>
          )}
        </div>

        <div className="mt-auto pt-5">
          <span className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:bg-brand-hover group-hover:shadow-md">
            عرض المنتج
          </span>
        </div>
      </div>
    </Link>
  );
})}
      </div>
    </div>
  ) : null}

  <div
    className={
      relatedProducts.length > 0
        ? "mt-8 pt-2"
        : ""
    }
  >
<Link
  href="/products"
  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:text-[#C85A1A] hover:shadow-md"
>
  <span aria-hidden="true">←</span>
  <span>العودة إلى جميع آلات القهوة</span>
</Link>
  </div>
</section>
    </main>
  );
}