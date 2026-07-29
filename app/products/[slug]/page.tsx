import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";
import PriceHistoryChart from "@/components/products/PriceHistoryChart";

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
      return "لا تتوفر بيانات كافية للمقارنة";
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
          ? { label: "الجهد الكهربائي", value: specification.voltage as string }
          : null,
        hasSpecificationValue(specification.frequencyHz)
          ? { label: "التردد", value: formatSpecificationNumber(specification.frequencyHz as number, "هرتز", 0) }
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
          currencyCode: true,
          checkedAt: true,

          retailer: {
            select: {
              name: true,
              slug: true,
            },
          },

          priceHistory: {
            orderBy: {
              checkedAt: "desc",
            },

            take: 12,

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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود | DukanCoffee",
    };
  }

  return {
    title: `${product.fullName} | DukanCoffee`,
    description: `قارن أسعار ${product.fullName} وتابع تغير السعر عبر DukanCoffee.`,
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
      className="h-full max-h-[520px] w-full object-contain"
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
    <section className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-stone-900">
        المميزات
      </h2>

      <div className="space-y-4">
        {features.map(({ feature }) => (
          <div
            key={feature.slug}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-lg text-stone-600">✓</div>

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

  const bestOffer = product.offers[0] ?? null;

  const bestOfferMovement = bestOffer
    ? getPriceMovement(bestOffer.priceHistory)
    : "none";

  const productSubtitle =
    product.modelNumber ??
    product.model ??
    product.productFamily.name;

  const specificationSections = buildSpecificationSections(
    product.specification,
  );

  const hasSpecifications = specificationSections.length > 0;

  return (
    <main
      dir="rtl"
      data-has-specifications={
        hasSpecifications ? "true" : "false"
      }
      className="min-h-screen bg-white text-black"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

          <span className="max-w-[240px] truncate text-black/70">
            {product.fullName}
          </span>
        </nav>
      </div>

      <section className="border-y border-black/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
          <div>
            <div className="flex min-h-[380px] items-center justify-center rounded-3xl border border-black/10 bg-white p-6 sm:p-10">
              <ProductImage
                imageUrl={mainImage?.url}
                alt={
                  mainImage?.altText ??
                  product.fullName
                }
              />
            </div>

            {additionalImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {additionalImages
                  .slice(0, 5)
                  .map((image) => (
                    <div
                      key={image.id}
                      className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white p-2"
                    >
                      <img
                        src={image.url}
                        alt={
                          image.altText ??
                          product.fullName
                        }
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <Link
              href={`/products?brand=${product.brand.slug}`}
              dir="ltr"
              className="w-fit text-sm font-semibold text-[#C85A1A] transition-colors hover:text-[#A94A14]"
            >
              {product.brand.name}
            </Link>

            <h1
              dir="ltr"
              className="mt-3 text-left text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl"
            >
              {product.fullName}
            </h1>

            {productSubtitle ? (
              <p
                dir="ltr"
                className="mt-3 text-left text-base text-black/55"
              >
                {productSubtitle}
              </p>
            ) : null}

            <div className="mt-7 border-y border-black/10 py-6">
              {bestOffer ? (
                <>
                  <p className="text-sm text-black/50">
                    أفضل سعر متاح
                  </p>

                  <div
                    dir="ltr"
                    className="mt-2 flex items-baseline justify-end gap-2 text-left lg:justify-start"
                  >
                    <span className="text-4xl font-bold tracking-tight text-[#C85A1A] sm:text-5xl">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                      }).format(
                        decimalToNumber(
                          bestOffer.currentPrice,
                        ),
                      )}
                    </span>

                    <span className="text-base font-medium text-black/45">
                      {bestOffer.currencyCode}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-black/60">
                    <span
                      className="text-lg font-semibold text-black/70"
                      aria-hidden="true"
                    >
                      {getPriceMovementSymbol(
                        bestOfferMovement,
                      )}
                    </span>

                    <span>
                      {getPriceMovementLabel(
                        bestOfferMovement,
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-lg font-semibold">
                    لا يوجد سعر متاح حاليًا
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/50">
                    سيظهر السعر هنا عند إضافة عرض متاح
                    لهذا المنتج.
                  </p>
                </div>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <dt className="text-xs text-black/45">
                  التصنيف
                </dt>

                <dd className="mt-2 text-sm font-semibold text-black">
                  {product.category.nameAr ??
                    product.category.nameEn}
                </dd>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <dt className="text-xs text-black/45">
                  رقم الموديل
                </dt>

                <dd
                  dir="ltr"
                  className="mt-2 truncate text-left text-sm font-semibold text-black"
                >
                  {product.modelNumber ??
                    product.model ??
                    "غير متوفر"}
                </dd>
              </div>
            </dl>

            {bestOffer ? (
              <a
                href="#offers"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#F2A064] px-6 text-sm font-bold text-black transition-colors hover:bg-[#E98B48] focus:outline-none focus:ring-2 focus:ring-[#C85A1A] focus:ring-offset-2"
              >
                مقارنة المتاجر
              </a>
            ) : null}

            <p className="mt-4 text-xs leading-5 text-black/40">
              آخر تحديث للمنتج:{" "}
              {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {hasSpecifications ? (
        <section className="border-t border-black/10 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                المواصفات
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/55">
                المواصفات الفنية المتوفرة لهذه الماكينة.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              {specificationSections.map((section) => (
                <div
                  key={section.title}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  <div className="border-b border-black/10 bg-neutral-50 px-6 py-4">
                    <h3 className="text-lg font-semibold">
                      {section.title}
                    </h3>
                  </div>

                  <div>
                    {section.items.map((item, index) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between gap-6 px-6 py-4 ${
                          index > 0
                            ? "border-t border-black/10"
                            : ""
                        }`}
                      >
                        <span className="text-sm text-black/55">
                          {item.label}
                        </span>

                        <span
                          dir="ltr"
                          className="text-left font-medium text-black"
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

      <section
        id="offers"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            الأسعار المتاحة
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/55">
            قارن الأسعار المتاحة قبل الانتقال إلى المتجر.
          </p>
        </div>

        {product.offers.length > 0 ? (
          <div className="mt-7 overflow-hidden rounded-2xl border border-black/10">
            {product.offers.map((offer, index) => {
              const movement = getPriceMovement(
                offer.priceHistory,
              );

              return (
                <article
                  key={offer.id}
                  className={`grid gap-5 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 ${
                    index > 0
                      ? "border-t border-black/10"
                      : ""
                  }`}
                >
                  <div>
                    <p
                      dir="ltr"
                      className="text-left text-base font-semibold text-black"
                    >
                      {offer.retailer.name}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-black/50">
                      <span
                        className="text-base text-black/65"
                        aria-hidden="true"
                      >
                        {getPriceMovementSymbol(
                          movement,
                        )}
                      </span>

                      <span>
                        {getPriceMovementLabel(
                          movement,
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-black/40">
                      تم التحقق في{" "}
                      {formatDate(offer.checkedAt)}
                    </p>
                  </div>

                  <div className="sm:text-left">
                    <p
                      dir="ltr"
                      className="text-2xl font-bold text-[#C85A1A]"
                    >
                      {formatPrice(
                        offer.currentPrice,
                        offer.currencyCode,
                      )}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-black/15 bg-neutral-50 px-6 py-14 text-center">
            <h3 className="font-semibold text-black">
              لا توجد عروض متاحة
            </h3>

            <p className="mt-2 text-sm text-black/50">
              ستظهر عروض المتاجر هنا عند توفرها.
            </p>
          </div>
        )}
      </section>

      {bestOffer &&
      bestOffer.priceHistory.length > 0 ? (
        <section className="border-y border-black/10 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                سجل السعر
              </h2>

              <p className="mt-2 text-sm leading-6 text-black/55">
                أحدث الأسعار المسجلة لدى المتجر صاحب أفضل
                سعر حالي.
              </p>
            </div>

<div className="mt-7 rounded-2xl border border-black/10 bg-white p-6">
  <PriceHistoryChart
    currencyCode={bestOffer.currencyCode}
    data={bestOffer.priceHistory.map((item) => ({
      id: item.id,
      price: decimalToNumber(item.price),
      checkedAt: item.checkedAt.toISOString(),
    }))}
  />
</div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-black/10 p-6">
            <p className="text-xs font-semibold text-[#C85A1A]">
              01
            </p>

            <h2 className="mt-4 text-lg font-bold">
              قارن السعر
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/55">
              راجع جميع الأسعار المتاحة للمنتج في مكان واحد.
            </p>
          </article>

          <article className="rounded-2xl border border-black/10 p-6">
            <p className="text-xs font-semibold text-[#C85A1A]">
              02
            </p>

            <h2 className="mt-4 text-lg font-bold">
              تابع التغير
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/55">
              استخدم السهم المحايد لمعرفة حركة السعر الأخيرة.
            </p>
          </article>

          <article className="rounded-2xl border border-black/10 p-6">
            <p className="text-xs font-semibold text-[#C85A1A]">
              03
            </p>

            <h2 className="mt-4 text-lg font-bold">
              اختر المتجر
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/55">
              اختر العرض الأنسب بعد تحديد الماكينة المناسبة.
            </p>
          </article>
        </div>

        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-semibold text-[#C85A1A] transition-colors hover:text-[#A94A14]"
          >
            العودة إلى جميع آلات القهوة
          </Link>
        </div>
      </section>
    </main>
  );
}