"use client";

type TrackedRetailerLinkProps = {
  href: string;
  retailer: string;
  product: string;
  productId: string;
};

type GtagFunction = (
  command: "event",
  eventName: string,
  params: Record<string, string>,
) => void;

export default function TrackedRetailerLink({
  href,
  retailer,
  product,
  productId,
}: TrackedRetailerLinkProps) {
  function handleClick() {
    const gtag = (
      window as typeof window & {
        gtag?: GtagFunction;
      }
    ).gtag;

    if (typeof gtag === "function") {
      gtag("event", "retailer_click", {
        retailer,
        product,
        product_id: productId,
        destination_url: href,
      });
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
    >
      الانتقال للمتجر
    </a>
  );
}