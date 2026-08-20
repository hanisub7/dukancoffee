import Link from "next/link";

export type ProductPriceMovement =
  | "down"
  | "up"
  | "same"
  | "none";

type ProductQuickSpec = {
  label: string;
  value: string;
};

type ProductDrink = {
  nameEn: string;
  nameAr: string;
};

type ProductCardProps = {
  slug: string;
  name: string;
  brandName: string;
  imageUrl?: string | null;
  subtitle?: string | null;
  price?: number | string | null;
  currencyCode?: string;
  priceMovement?: ProductPriceMovement;
  priceMovementText?: string | null;
  isLowestPrice?: boolean;
  quickSpecs?: ProductQuickSpec[];
  drinks?: ProductDrink[];
};

function formatPrice(
  price: number | string,
  currencyCode: string,
): string {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return `${price} ${currencyCode}`;
  }

  const formattedNumber = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericPrice);

  return `${formattedNumber} ${currencyCode}`;
}

function getMovementSymbol(
  movement: ProductPriceMovement,
): string {
  switch (movement) {
    case "down":
      return "↓";

    case "up":
      return "↑";

    case "same":
      return "→";

    default:
      return "";
  }
}

function getDefaultMovementText(
  movement: ProductPriceMovement,
): string {
  switch (movement) {
    case "down":
      return "أقل من السعر السابق";

    case "up":
      return "أعلى من السعر السابق";

    case "same":
      return "لا يوجد تغير في السعر";

    default:
      return "";
  }
}

function getQuickSpecIcon(label: string): string {
  switch (label) {
    case "نوع الماكينة":
      return "☕";

    case "الطاحونة":
      return "⚙️";

    case "خزان الماء":
      return "💧";

    case "الشاشة":
      return "🖥️";

    case "ضغط المضخة":
      return "🔧";

    case "نظام الحليب":
      return "🥛";

    default:
      return "•";
  }
}

export default function ProductCard({
  slug,
  name,
  brandName,
  imageUrl,
  subtitle,
  price,
  currencyCode = "SAR",
  priceMovement = "none",
  priceMovementText,
  isLowestPrice = false,
  quickSpecs = [],
  drinks = [],
}: ProductCardProps) {
  const productUrl = `/products/${slug}`;

  const movementSymbol =
    getMovementSymbol(priceMovement);

  const movementText =
    priceMovementText ??
    getDefaultMovementText(priceMovement);

  const hasPrice =
    price !== null &&
    price !== undefined;

  const visibleDrinks = drinks.slice(0, 4);
  const remainingDrinksCount =
    Math.max(0, drinks.length - visibleDrinks.length);

  return (
    <article
      dir="rtl"
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
    >
      {isLowestPrice ? (
        <div className="absolute right-4 top-4 z-10">
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#C85A1A] shadow-sm">
            أقل سعر مسجل
          </span>
        </div>
      ) : null}

      <Link
        href={productUrl}
        aria-label={`عرض تفاصيل ${name}`}
        className="relative flex h-72 items-center justify-center overflow-hidden border-b border-stone-100 bg-[#F8F8F8] p-3"
      >
        {imageUrl ? (
          // Product images may come from manufacturer
          // and retailer domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="!h-full !w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-stone-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              fill="none"
              className="h-12 w-12"
            >
              <path
                d="M10 13h24v23H10V13Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="m14 31 7-8 5 5 4-4 4 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="29"
                cy="19"
                r="2"
                fill="currentColor"
              />
            </svg>

            <span className="text-sm">
              ستتوفر صورة المنتج قريبًا
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        <div>
          <p
            dir="ltr"
            className="text-left text-xs font-bold uppercase tracking-wide text-[#C85A1A]"
          >
            {brandName}
          </p>

          <Link
            href={productUrl}
            className="block"
          >
            <h2
              dir="ltr"
              className="mt-3 line-clamp-2 min-h-14 text-left text-xl font-bold leading-7 text-stone-900 transition-colors duration-200 group-hover:text-[#C85A1A]"
            >
              {name}
            </h2>
          </Link>

          {quickSpecs.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {quickSpecs.slice(0, 3).map((specification) => (
                <span
                  key={`${specification.label}-${specification.value}`}
                  title={`${specification.label}: ${specification.value}`}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[13px]"
                  >
                    {getQuickSpecIcon(specification.label)}
                  </span>

                  <span className="truncate">
                    {specification.value}
                  </span>
                </span>
              ))}
            </div>
          ) : null}

          {drinks.length > 0 ? (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="text-sm"
                >
                  ☕
                </span>

                <p className="text-xs font-bold text-stone-600">
                  المشروبات
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {visibleDrinks.map((drink) => (
                  <span
                    key={drink.nameEn}
                    title={drink.nameEn}
                    className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#C85A1A]"
                  >
                    {drink.nameAr}
                  </span>
                ))}

                {remainingDrinksCount > 0 ? (
                  <span
                    title={`${remainingDrinksCount} مشروبات إضافية`}
                    className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-600"
                  >
                    +{remainingDrinksCount}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-5 border-t border-stone-100 pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-stone-500">
                السعر الحالي
              </p>

              {hasPrice ? (
                <p
                  dir="ltr"
                  className="mt-2 text-left text-3xl font-extrabold tracking-tight text-[#C85A1A]"
                >
                  {formatPrice(price, currencyCode)}
                </p>
              ) : (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-stone-700">
                    السعر غير متوفر حاليًا
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    تحقق من تفاصيل المنتج لمعرفة أحدث الأسعار.
                  </p>
                </div>
              )}
            </div>
          </div>

          {movementText ? (
            <div className="mt-3 flex min-h-8 items-center gap-2 rounded-lg bg-stone-50 px-3 py-1.5 text-xs text-stone-600">
              {movementSymbol ? (
                <span
                  aria-hidden="true"
                  className="text-base font-semibold leading-none text-stone-700"
                >
                  {movementSymbol}
                </span>
              ) : null}

              <span>{movementText}</span>
            </div>
          ) : hasPrice ? (
            <div
              className="mt-3 min-h-11"
              aria-hidden="true"
            />
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={productUrl}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            <span>عرض التفاصيل</span>

            <span
              aria-hidden="true"
              className="text-base transition-transform duration-200 group-hover:translate-x-1"
            >
              ←
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}