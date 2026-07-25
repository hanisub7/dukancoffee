import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

type PriceMovement = {
  symbol: "↓" | "↑" | "→";
  text: string;
};

function formatPrice(
  value: number | string | { toString(): string },
  currencyCode = "SAR",
) {
  const numericValue = Number(value.toString());

  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function getPriceMovement(
  histories: Array<{
    price: number | string | { toString(): string };
  }>,
): PriceMovement {
  if (histories.length < 2) {
    return {
      symbol: "→",
      text: "لا تتوفر بيانات كافية للمقارنة",
    };
  }

  const latestPrice = Number(histories[0].price.toString());
  const previousPrice = Number(histories[1].price.toString());
  const difference = Math.abs(latestPrice - previousPrice);

  if (latestPrice < previousPrice) {
    return {
      symbol: "↓",
      text: `أقل من السعر السابق بـ ${formatPrice(difference)}`,
    };
  }

  if (latestPrice > previousPrice) {
    return {
      symbol: "↑",
      text: `أعلى من السعر السابق بـ ${formatPrice(difference)}`,
    };
  }

  return {
    symbol: "→",
    text: "لا يوجد تغير في السعر",
  };
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

function CoffeeMachinePlaceholder() {
  return (
    <svg
      viewBox="0 0 520 520"
      role="img"
      aria-label="رسم توضيحي لماكينة قهوة"
      className="h-auto w-full"
    >
      <rect
        x="117"
        y="70"
        width="286"
        height="344"
        rx="42"
        fill="#F5F5F4"
        stroke="#D6D3D1"
        strokeWidth="4"
      />

      <rect
        x="144"
        y="100"
        width="232"
        height="92"
        rx="24"
        fill="#FFFFFF"
        stroke="#E7E5E4"
        strokeWidth="3"
      />

      <circle cx="190" cy="146" r="12" fill="#C7762B" />
      <circle cx="230" cy="146" r="12" fill="#D6D3D1" />
      <circle cx="270" cy="146" r="12" fill="#D6D3D1" />

      <rect
        x="314"
        y="127"
        width="35"
        height="38"
        rx="10"
        fill="#292524"
      />

      <rect
        x="180"
        y="224"
        width="160"
        height="29"
        rx="14.5"
        fill="#292524"
      />

      <rect
        x="244"
        y="250"
        width="32"
        height="66"
        rx="12"
        fill="#57534E"
      />

      <path
        d="M260 315C260 315 260 339 247 350"
        fill="none"
        stroke="#57534E"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <rect
        x="184"
        y="340"
        width="152"
        height="18"
        rx="9"
        fill="#D6D3D1"
      />

      <path
        d="M211 360H309L294 410H226L211 360Z"
        fill="#FFFFFF"
        stroke="#D6D3D1"
        strokeWidth="4"
      />

      <path
        d="M309 371H326C340 371 350 380 350 393C350 406 340 415 326 415H298"
        fill="none"
        stroke="#D6D3D1"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M235 332C229 320 233 310 242 301"
        fill="none"
        stroke="#C7762B"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path
        d="M262 332C256 318 261 306 270 297"
        fill="none"
        stroke="#C7762B"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path
        d="M289 332C283 321 287 311 295 303"
        fill="none"
        stroke="#C7762B"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />

      <ellipse
        cx="260"
        cy="445"
        rx="160"
        ry="25"
        fill="#E7E5E4"
        opacity="0.65"
      />
    </svg>
  );
}

function ProductVisual({
  imageUrl,
  alt,
}: {
  imageUrl?: string | null;
  alt: string;
}) {
  if (!imageUrl) {
    return (
      <div className="mx-auto w-full max-w-[260px]">
        <CoffeeMachinePlaceholder />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.025]"
    />
  );
}

async function getHomepageData() {
  const publishedProductWhere = {
    status: "PUBLISHED" as const,
    deletedAt: null,
    brand: {
      active: true,
      deletedAt: null,
    },
    category: {
      active: true,
      deletedAt: null,
    },
  };

  const [products, recentOffers, brands] = await Promise.all([
    prisma.product.findMany({
      where: publishedProductWhere,
      orderBy: {
        updatedAt: "desc",
      },
      take: 12,
      select: {
        id: true,
        slug: true,
        fullName: true,
        model: true,
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
            slug: true,
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
            altText: true,
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
              take: 2,
              select: {
                price: true,
                checkedAt: true,
              },
            },
          },
        },
      },
    }),

    prisma.offer.findMany({
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
        product: publishedProductWhere,
        priceHistory: {
          some: {},
        },
      },
      orderBy: {
        checkedAt: "desc",
      },
      take: 24,
      select: {
        id: true,
        currentPrice: true,
        currencyCode: true,
        checkedAt: true,
        product: {
          select: {
            slug: true,
            fullName: true,
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
        retailer: {
          select: {
            name: true,
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
    }),

    prisma.brand.findMany({
      where: {
        active: true,
        deletedAt: null,
        products: {
          some: {
            status: "PUBLISHED",
            deletedAt: null,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
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
    }),
  ]);

  const productsWithOffers = products.filter(
    (product) => product.offers.length > 0,
  );

  const heroProduct =
    productsWithOffers.find((product) => product.images.length > 0) ??
    productsWithOffers[0] ??
    products[0] ??
    null;

  const popularProducts = productsWithOffers.slice(0, 3);

  const latestPriceDrops = recentOffers
    .map((offer) => {
      if (offer.priceHistory.length < 2) {
        return null;
      }

      const latestPrice = Number(offer.priceHistory[0].price.toString());
      const previousPrice = Number(offer.priceHistory[1].price.toString());

      if (latestPrice >= previousPrice) {
        return null;
      }

      return {
        ...offer,
        latestPrice,
        previousPrice,
        difference: previousPrice - latestPrice,
      };
    })
    .filter((offer): offer is NonNullable<typeof offer> => offer !== null)
    .slice(0, 3);

  const popularBrands = brands
    .sort((firstBrand, secondBrand) => {
      return secondBrand._count.products - firstBrand._count.products;
    })
    .slice(0, 6);

  return {
    heroProduct,
    popularProducts,
    latestPriceDrops,
    popularBrands,
  };
}

const benefits = [
  {
    number: "01",
    title: "تابع الأسعار",
    description:
      "شاهد السعر الحالي وتاريخ تغيره بوضوح قبل اتخاذ قرار الشراء.",
  },
  {
    number: "02",
    title: "اشترِ في الوقت المناسب",
    description:
      "قارن السعر الحالي بالأسعار السابقة المسجلة للمنتج.",
  },
  {
    number: "03",
    title: "اعثر على الماكينة المناسبة",
    description:
      "استعرض المواصفات والصور والمعلومات الأساسية بطريقة واضحة ومنظمة.",
  },
];

export default async function Home() {
  const {
    heroProduct,
    popularProducts,
    latestPriceDrops,
    popularBrands,
  } = await getHomepageData();

  const heroOffer = heroProduct?.offers[0] ?? null;
  const heroImage = heroProduct?.images[0] ?? null;

  const heroMovement = heroOffer
    ? getPriceMovement(heroOffer.priceHistory)
    : null;

  return (
    <main dir="rtl" className="min-h-screen bg-background text-text-primary">
      <header className="border-b border-border bg-white">
        <div className="site-container flex min-h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="DukanCoffee"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand"
              aria-hidden="true"
            >
              <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
                <path
                  d="M10 7H19.5C27.5 7 33 12.2 33 20C33 27.8 27.5 33 19.5 33H10V7Z"
                  stroke="white"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />

                <path
                  d="M20.2 13.4C24.3 16.4 24.8 22.8 20 27.1C16.2 23.9 15.8 17.6 20.2 13.4Z"
                  fill="white"
                />

                <path
                  d="M20 16.6C18.7 19.4 18.7 22.1 20.1 24.7"
                  stroke="#C7762B"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span
              dir="ltr"
              className="text-lg font-semibold tracking-tight text-stone-900"
            >
              DukanCoffee
            </span>
          </Link>

          <nav
            className="hidden items-center gap-8 text-sm font-medium text-text-secondary md:flex"
            aria-label="التنقل الرئيسي"
          >
            <Link href="/products" className="transition hover:text-brand">
              ماكينات القهوة
            </Link>

            <Link href="/brands" className="transition hover:text-brand">
              العلامات التجارية
            </Link>

            <Link href="/price-drops" className="transition hover:text-brand">
              انخفاضات الأسعار
            </Link>
          </nav>

          <Link
            href="/products"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition hover:border-brand hover:text-brand"
            aria-label="البحث"
          >
            <SearchIcon />
          </Link>
        </div>
      </header>

      <section className="border-b border-border bg-white">
        <div className="site-container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand">
              تتبع أسعار ماكينات القهوة في السعودية
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.2] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              تابع أسعار ماكينات القهوة.
              <span className="mt-2 block text-brand">
                واشترِ في الوقت المناسب.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              اكتشف السعر الحالي، راجع تاريخ تغير السعر، وقارن المعلومات
              الأساسية قبل الانتقال للشراء من Amazon.sa.
            </p>

            <form action="/products" method="get" className="mt-9 max-w-2xl">
              <label htmlFor="homepage-search" className="sr-only">
                ابحث عن ماكينة قهوة
              </label>

              <div className="flex items-center rounded-2xl border border-border bg-white p-2 shadow-card">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <SearchIcon className="h-5 w-5 shrink-0 text-text-muted" />

                  <input
                    id="homepage-search"
                    type="search"
                    name="q"
                    placeholder="ابحث عن ماكينة أو علامة تجارية"
                    className="min-h-12 w-full border-0 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-12 shrink-0 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  بحث
                </button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">✓</span>
                تاريخ السعر
              </span>

              <span className="flex items-center gap-2">
                <span aria-hidden="true">✓</span>
                أسعار Amazon.sa
              </span>

              <span className="flex items-center gap-2">
                <span aria-hidden="true">✓</span>
                جاهز لدول الخليج
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-[2rem] border border-border bg-surface-soft p-7 sm:p-10">
              <div className="flex h-[320px] items-center justify-center">
                <ProductVisual
                  imageUrl={heroImage?.url}
                  alt={
                    heroImage?.altText ??
                    heroProduct?.fullName ??
                    "ماكينة قهوة"
                  }
                />
              </div>

              <div className="mt-4 border-t border-border pt-6">
                {heroProduct ? (
                  <>
                    <p className="text-sm text-text-muted">ماكينة مختارة</p>

                    <div className="mt-2 flex items-end justify-between gap-5">
                      <div>
                        <p
                          dir="ltr"
                          className="text-left text-lg font-semibold text-stone-900"
                        >
                          {heroProduct.fullName}
                        </p>

                        <p className="mt-1 text-sm text-text-muted">
                          {heroProduct.category.nameAr}
                        </p>
                      </div>

                      {heroOffer ? (
                        <div className="shrink-0 text-left">
                          <p className="text-xs text-text-muted">
                            السعر الحالي
                          </p>

                          <p className="mt-1 text-xl font-semibold text-brand">
                            {formatPrice(
                              heroOffer.currentPrice,
                              heroOffer.currencyCode,
                            )}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {heroMovement ? (
                      <p className="price-movement mt-4">
                        <span
                          className="price-movement-arrow"
                          aria-hidden="true"
                        >
                          {heroMovement.symbol}
                        </span>

                        {heroMovement.text}
                      </p>
                    ) : null}

                    <Link
                      href={`/products/${heroProduct.slug}`}
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                    >
                      عرض تفاصيل الماكينة
                    </Link>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="font-semibold text-stone-900">
                      لا توجد منتجات منشورة بعد
                    </p>

                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      ستظهر الماكينة المختارة هنا تلقائيًا بعد نشر أول منتج
                      وإضافة سعر له.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">الأكثر بحثًا</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              ماكينات قهوة شائعة
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
              استعرض أحدث الماكينات المنشورة وتابع السعر الحالي لكل ماكينة.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-semibold text-brand transition hover:text-brand-hover"
          >
            عرض جميع الماكينات ←
          </Link>
        </div>

        {popularProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {popularProducts.map((product) => {
              const offer = product.offers[0];
              const image = product.images[0];
              const movement = getPriceMovement(offer.priceHistory);

              return (
                <article
                  key={product.id}
                  className="premium-card group overflow-hidden"
                >
                  <div className="flex h-64 items-center justify-center bg-surface-soft p-8">
                    <ProductVisual
                      imageUrl={image?.url}
                      alt={image?.altText ?? product.fullName}
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-text-muted">
                      {product.category.nameAr}
                    </p>

                    <h3
                      dir="ltr"
                      className="mt-2 text-left text-xl font-semibold tracking-tight text-stone-900"
                    >
                      {product.fullName}
                    </h3>

                    <p
                      dir="ltr"
                      className="mt-1 text-left text-sm text-text-muted"
                    >
                      {product.brand.name}
                    </p>

                    <div className="mt-6 border-t border-border pt-5">
                      <p className="text-xs text-text-muted">السعر الحالي</p>

                      <p className="mt-1 text-2xl font-semibold text-brand">
                        {formatPrice(
                          offer.currentPrice,
                          offer.currencyCode,
                        )}
                      </p>

                      <p className="price-movement mt-3">
                        <span
                          className="price-movement-arrow"
                          aria-hidden="true"
                        >
                          {movement.symbol}
                        </span>

                        {movement.text}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border-strong px-4 text-sm font-semibold text-text-primary transition hover:border-brand hover:text-brand"
                    >
                      عرض تفاصيل السعر
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-14 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد ماكينات منشورة بأسعار متاحة
            </p>

            <p className="mt-2 text-sm text-text-muted">
              ستظهر المنتجات هنا تلقائيًا بعد نشرها وإضافة عروض متاحة لها.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-surface-soft">
        <div className="site-container py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-brand">
                تحديثات حديثة
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                أحدث انخفاضات الأسعار
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
                أحدث الانخفاضات المسجلة فعليًا في تاريخ أسعار المنتجات.
              </p>
            </div>

            <Link
              href="/price-drops"
              className="text-sm font-semibold text-brand transition hover:text-brand-hover"
            >
              عرض جميع التغيرات ←
            </Link>
          </div>

          {latestPriceDrops.length > 0 ? (
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {latestPriceDrops.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <p
                    dir="ltr"
                    className="text-left font-semibold text-stone-900"
                  >
                    {item.product.fullName}
                  </p>

                  <p
                    dir="ltr"
                    className="mt-1 text-left text-sm text-text-muted"
                  >
                    {item.product.brand.name}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-5">
                    <div>
                      <p className="text-xs text-text-muted">
                        السعر السابق
                      </p>

                      <p className="mt-1 text-sm text-text-muted line-through">
                        {formatPrice(
                          item.previousPrice,
                          item.currencyCode,
                        )}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-text-muted">
                        السعر الحالي
                      </p>

                      <p className="mt-1 text-xl font-semibold text-brand">
                        {formatPrice(
                          item.latestPrice,
                          item.currencyCode,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-4">
                    <p className="price-movement">
                      <span
                        className="price-movement-arrow"
                        aria-hidden="true"
                      >
                        ↓
                      </span>

                      أقل من السعر السابق بـ{" "}
                      {formatPrice(
                        item.difference,
                        item.currencyCode,
                      )}
                    </p>

                    <p className="mt-2 text-xs text-text-muted">
                      لدى {item.retailer.name}
                    </p>
                  </div>

                  <Link
                    href={`/products/${item.product.slug}`}
                    className="mt-5 inline-flex text-sm font-semibold text-brand transition hover:text-brand-hover"
                  >
                    عرض سجل السعر ←
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
              <p className="font-semibold text-stone-900">
                لا توجد انخفاضات سعرية مسجلة بعد
              </p>

              <p className="mt-2 text-sm text-text-muted">
                سيظهر هذا القسم تلقائيًا عند تسجيل سعر أقل من السعر السابق.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="site-container py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold text-brand">
            العلامات التجارية
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            علامات تجارية شائعة
          </h2>
        </div>

        {popularBrands.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {popularBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                dir="ltr"
                className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-border bg-white px-4 text-center transition hover:border-brand"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="mb-3 h-9 max-w-[120px] object-contain"
                  />
                ) : null}

                <span className="font-semibold text-text-secondary transition hover:text-brand">
                  {brand.name}
                </span>

                <span className="mt-1 text-xs text-text-muted">
                  {brand._count.products} منتج
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-soft px-6 py-14 text-center">
            <p className="font-semibold text-stone-900">
              لا توجد علامات تجارية بمنتجات منشورة
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-border bg-white">
        <div className="site-container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand">
              لماذا DukanCoffee؟
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              معلومات واضحة لقرار شراء أفضل
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-t border-border pt-6"
              >
                <p
                  dir="ltr"
                  className="text-sm font-semibold text-brand"
                >
                  {benefit.number}
                </p>

                <h3 className="mt-5 text-xl font-semibold text-stone-900">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-text-secondary">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 text-white">
        <div className="site-container py-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Link
                href="/"
                dir="ltr"
                className="text-xl font-semibold tracking-tight"
              >
                DukanCoffee
              </Link>

              <p className="mt-4 max-w-md leading-7 text-stone-400">
                منصة لمتابعة أسعار ماكينات القهوة وتاريخ تغيرها في السعودية،
                مع الاستعداد للتوسع في دول الخليج.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <p className="font-semibold text-white">استكشف</p>

                <Link
                  href="/products"
                  className="block text-stone-400 transition hover:text-white"
                >
                  ماكينات القهوة
                </Link>

                <Link
                  href="/brands"
                  className="block text-stone-400 transition hover:text-white"
                >
                  العلامات التجارية
                </Link>

                <Link
                  href="/categories"
                  className="block text-stone-400 transition hover:text-white"
                >
                  التصنيفات
                </Link>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-white">DukanCoffee</p>

                <Link
                  href="/about"
                  className="block text-stone-400 transition hover:text-white"
                >
                  من نحن
                </Link>

                <Link
                  href="/contact"
                  className="block text-stone-400 transition hover:text-white"
                >
                  تواصل معنا
                </Link>

                <Link
                  href="/privacy"
                  className="block text-stone-400 transition hover:text-white"
                >
                  سياسة الخصوصية
                </Link>

                <Link
                  href="/terms"
                  className="block text-stone-400 transition hover:text-white"
                >
                  الشروط والأحكام
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-stone-800 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p dir="ltr">
              © {new Date().getFullYear()} DukanCoffee
            </p>

            <p>الأسعار قابلة للتغير لدى المتجر دون إشعار مسبق.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}