import type { Metadata } from "next";

import EmptyState from "@/components/products/EmptyState";
import Filters from "@/components/products/Filters";
import Pagination from "@/components/products/Pagination";
import ProductGrid from "@/components/products/ProductGrid";
import SearchBar from "@/components/products/SearchBar";
import {
  getProductCatalog,
  type ProductCatalogParams,
} from "@/app/lib/products/queries";

export const metadata: Metadata = {
  title: "آلات القهوة | DukanCoffee",
  description:
    "تصفح آلات القهوة وقارن الأسعار الحالية وتابع تغير الأسعار عبر DukanCoffee.",
};

type ProductsPageSearchParams = {
  search?: string | string[];
  q?: string | string[];
  brand?: string | string[];
  category?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

type ProductsPageProps = {
  searchParams: Promise<ProductsPageSearchParams>;
};

function getSingleSearchParam(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function getPageNumber(
  value: string | string[] | undefined,
): number {
  const rawValue = getSingleSearchParam(value);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

function getResultsText(
  totalProducts: number,
  search: string,
): string {
  if (totalProducts === 0) {
    return search
      ? `لم نعثر على نتائج مطابقة لـ “${search}”.`
      : "لا توجد آلات قهوة متاحة حاليًا.";
  }

  if (search) {
    return `${totalProducts} نتيجة مطابقة لـ “${search}”`;
  }

  return `${totalProducts} ${
    totalProducts === 1 ? "آلة قهوة" : "آلة قهوة"
  }`;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const search =
    getSingleSearchParam(resolvedSearchParams.search) ||
    getSingleSearchParam(resolvedSearchParams.q);

  const selectedBrand = getSingleSearchParam(
    resolvedSearchParams.brand,
  );

  const selectedCategory = getSingleSearchParam(
    resolvedSearchParams.category,
  );

  const selectedSort =
    getSingleSearchParam(resolvedSearchParams.sort) ||
    "updated";

  const requestedPage = getPageNumber(
    resolvedSearchParams.page,
  );

  const catalogParams: ProductCatalogParams = {
    search,
    brand: selectedBrand,
    category: selectedCategory,
    sort: selectedSort,
    page: requestedPage,
  };

  const {
    products,
    brands,
    categories,
    currentPage,
    totalPages,
    totalProducts,
  } = await getProductCatalog(catalogParams);

  const hasActiveFilters = Boolean(
    search || selectedBrand || selectedCategory,
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white text-black"
    >
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              آلات القهوة
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/60 sm:text-base">
              اختر الآلة المناسبة وقارن أسعارها.
            </p>
          </div>

          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <Filters
          brands={brands}
          categories={categories}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
        />

        <div className="mt-6 flex flex-col gap-2 border-b border-black/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-black">
            {getResultsText(totalProducts, search)}
          </p>

          {totalPages > 1 ? (
            <p className="text-sm text-black/50">
              الصفحة {currentPage} من {totalPages}
            </p>
          ) : null}
        </div>

        <div className="mt-7">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              title={
                search
                  ? "لا توجد آلات مطابقة"
                  : "لا توجد آلات قهوة"
              }
              description={
                hasActiveFilters
                  ? "جرّب تغيير البحث أو خيارات التصفية."
                  : "ستظهر آلات القهوة المنشورة هنا عند إضافتها."
              }
              showResetButton={hasActiveFilters}
            />
          )}
        </div>

        {products.length > 0 ? (
          <div className="mt-10 border-t border-black/10 pt-7">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              query={{
                search: search || undefined,
                brand: selectedBrand || undefined,
                category: selectedCategory || undefined,
                sort:
                  selectedSort !== "updated"
                    ? selectedSort
                    : undefined,
              }}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}