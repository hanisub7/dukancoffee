import Link from "next/link";

export type ProductPriceMovement =
  | "down"
  | "up"
  | "same"
  | "none";

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
};

function formatPrice(
  price: number | string,
  currencyCode: string,
): string {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return `${price} ${currencyCode}`;
  }

  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numericPrice);
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

  return (
    <article
      dir="rtl"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
    >
      {isLowestPrice ? (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
          أقل سعر مسجل
        </span>
      ) : null}

      <Link
        href={productUrl}
        aria-label={`عرض تفاصيل ${name}`}
        className="relative flex h-52 items-center justify-center overflow-hidden border-b border-stone-100 bg-stone-50 p-6 sm:h-56"
      >
        {imageUrl ? (
          // Product images may come from several manufacturer
          // and retailer domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-stone-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              fill="none"
              className="h-11 w-11"
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

            <span className="text-xs">
              ستتوفر صورة المنتج قريبًا
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p
          dir="ltr"
          className="text-left text-xs font-semibold tracking-wide text-orange-700"
        >
          {brandName}
        </p>

        <Link
          href={productUrl}
          className="mt-2 transition hover:text-orange-700"
        >
          <h2
            dir="ltr"
            className="line-clamp-2 text-left text-lg font-bold leading-7 text-stone-900"
          >
            {name}
          </h2>
        </Link>

        {subtitle ? (
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-stone-500">
            {subtitle}
          </p>
        ) : (
          <div
            className="mt-2 min-h-12"
            aria-hidden="true"
          />
        )}

        <div className="mt-auto border-t border-stone-100 pt-5">
          <p className="text-xs text-stone-500">
            السعر الحالي
          </p>

          {hasPrice ? (
            <p className="mt-1 text-2xl font-bold tracking-tight text-orange-700">
              {formatPrice(price, currencyCode)}
            </p>
          ) : (
            <p className="mt-2 text-sm font-medium text-stone-500">
              السعر غير متوفر حاليًا
            </p>
          )}

          {movementText ? (
            <p className="mt-3 flex min-h-6 items-center gap-2 text-sm text-stone-600">
              {movementSymbol ? (
                <span
                  aria-hidden="true"
                  className="text-lg leading-none text-stone-700"
                >
                  {movementSymbol}
                </span>
              ) : null}

              <span>{movementText}</span>
            </p>
          ) : (
            <div
              className="mt-3 min-h-6"
              aria-hidden="true"
            />
          )}

          <Link
            href={productUrl}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-900 transition hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}