import Link from "next/link";

export type ProductPriceMovement = "down" | "up" | "same" | "none";

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
      return "لم يتغير السعر";
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
  const movementSymbol = getMovementSymbol(priceMovement);

  const movementText =
    priceMovementText ??
    getDefaultMovementText(priceMovement);

  const productUrl = `/products/${slug}`;

  return (
    <article
      dir="rtl"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg"
    >
      {isLowestPrice ? (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[#F2A064] px-2.5 py-1 text-[11px] font-bold text-black">
          أقل سعر
        </span>
      ) : null}

      <Link
        href={productUrl}
        aria-label={`عرض تفاصيل ${name}`}
        className="relative flex h-48 items-center justify-center overflow-hidden border-b border-black/5 bg-[#fafaf9] p-5 sm:h-52"
      >
        {imageUrl ? (
          // Product images may come from different manufacturer
          // and retailer domains.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-black/40">
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              fill="none"
              className="h-10 w-10"
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

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-bold tracking-wide text-black/45">
          {brandName}
        </p>

        <Link
          href={productUrl}
          className="mt-2 transition-opacity hover:opacity-65"
        >
          <h2 className="line-clamp-2 text-base font-bold leading-7 text-black sm:text-lg">
            {name}
          </h2>
        </Link>

        {subtitle ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-black/55">
            {subtitle}
          </p>
        ) : (
          <div className="mt-1.5 h-6" aria-hidden="true" />
        )}

        <div className="mt-auto pt-5">
          {price !== null && price !== undefined ? (
            <p className="text-xl font-bold tracking-tight text-[#C85A1A] sm:text-2xl">
              {formatPrice(price, currencyCode)}
            </p>
          ) : (
            <p className="text-sm font-medium text-black/50">
              السعر غير متوفر حاليًا
            </p>
          )}

          {movementText ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-black/55 sm:text-sm">
              {movementSymbol ? (
                <span
                  aria-hidden="true"
                  className="text-base leading-none text-black/70"
                >
                  {movementSymbol}
                </span>
              ) : null}

              <span>{movementText}</span>
            </p>
          ) : (
            <div className="mt-2 h-5" aria-hidden="true" />
          )}

          <div className="mt-5 flex justify-start">
            <Link
              href={productUrl}
              className="inline-flex min-h-9 items-center justify-center rounded-lg bg-[#F2A064] px-3.5 text-xs font-bold text-black transition-colors hover:bg-[#E98B48] focus:outline-none focus:ring-2 focus:ring-[#C85A1A] focus:ring-offset-2 sm:text-sm"
            >
              عرض التفاصيل
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}