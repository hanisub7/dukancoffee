import Link from "next/link";

import ProductCard, {
  type ProductPriceMovement,
} from "./ProductCard";

export type ProductGridItem = {
  id: string;
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

  quickSpecs: Array<{
    label: string;
    value: string;
  }>;

  drinks: Array<{
    nameEn: string;
    nameAr: string;
  }>;
};

type ProductGridProps = {
  products: ProductGridItem[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center"
      >
        <h2 className="text-lg font-semibold text-neutral-900">
          لم نعثر على آلات قهوة
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
          جرّب تغيير كلمات البحث أو خيارات التصفية.
        </p>

        <Link
          href="/products"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#F2A064] px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-[#E98B48] focus:outline-none focus:ring-2 focus:ring-[#C85A1A] focus:ring-offset-2"
        >
          عرض جميع المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={
        products.length === 1
          ? "mx-auto grid w-full max-w-[620px] grid-cols-1 gap-6"
          : products.length === 2
            ? "grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
            : "grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          slug={product.slug}
          name={product.name}
          brandName={product.brandName}
          imageUrl={product.imageUrl}
          subtitle={product.subtitle}
          price={product.price}
          currencyCode={product.currencyCode}
          priceMovement={product.priceMovement}
          priceMovementText={product.priceMovementText}
          isLowestPrice={product.isLowestPrice}
          quickSpecs={product.quickSpecs}
          drinks={product.drinks}
        />
      ))}
    </div>
  );
}