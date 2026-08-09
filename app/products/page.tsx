import type { Metadata } from "next";

import EmptyState from "@/components/products/EmptyState";
import Filters from "@/components/products/Filters";
import Pagination from "@/components/products/Pagination";
import ProductGrid from "@/components/products/ProductGrid";
import ResultsToolbar from "@/components/products/ResultsToolbar";
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
const selectedBrandLabel =
  brands.find(
    (brand) => brand.value === selectedBrand,
  )?.label ?? selectedBrand;

const selectedCategoryLabel =
  categories.find(
    (category) =>
      category.value === selectedCategory,
  )?.label ?? selectedCategory;


  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background text-text-primary"
    >
      <section className="border-b border-border bg-[#fffaf4]">
        <div className="site-container py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl">
<p className="text-lg font-semibold text-[#C85A1A] sm:text-xl">
  دليل آلات القهوة
</p>

<h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
  اعثر على ماكينة القهوة المناسبة
</h1>

<p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
  تصفح الماكينات المنشورة، قارن الأسعار الحالية،
  تابع تغير السعر قبل اتخاذ قرار الشراء.
</p>
          </div>

          <div className="mt-8 max-w-3xl">
            <SearchBar />
          </div>
        </div>
      </section>

<section className="site-container py-7 sm:py-8 lg:py-9">
<Filters
  brands={brands}
  categories={categories}
  selectedBrand={selectedBrand}
  selectedCategory={selectedCategory}
/>

  <div className="mt-4">
    <ResultsToolbar
      totalProducts={totalProducts}
      selectedSort={selectedSort}
    />
  </div>
{hasActiveFilters ? (
  <div className="mt-4 flex flex-wrap items-center gap-2">
    {search ? (
      <a
        href={`/products${
          selectedBrand || selectedCategory
            ? `?${new URLSearchParams({
                ...(selectedBrand
                  ? { brand: selectedBrand }
                  : {}),
                ...(selectedCategory
                  ? { category: selectedCategory }
                  : {}),
                ...(selectedSort !== "updated"
                  ? { sort: selectedSort }
                  : {}),
              }).toString()}`
            : ""
        }`}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-orange-200 hover:text-[#C85A1A]"
      >
        <span>البحث: {search}</span>
        <span aria-hidden="true">×</span>
      </a>
    ) : null}

    {selectedBrand ? (
      <a
        href={`/products?${new URLSearchParams({
          ...(search ? { search } : {}),
          ...(selectedCategory
            ? { category: selectedCategory }
            : {}),
          ...(selectedSort !== "updated"
            ? { sort: selectedSort }
            : {}),
        }).toString()}`}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-orange-200 hover:text-[#C85A1A]"
      >
        <span>{selectedBrandLabel}</span>
        <span aria-hidden="true">×</span>
      </a>
    ) : null}

    {selectedCategory ? (
      <a
        href={`/products?${new URLSearchParams({
          ...(search ? { search } : {}),
          ...(selectedBrand
            ? { brand: selectedBrand }
            : {}),
          ...(selectedSort !== "updated"
            ? { sort: selectedSort }
            : {}),
        }).toString()}`}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-orange-200 hover:text-[#C85A1A]"
      >
        <span>{selectedCategoryLabel}</span>
        <span aria-hidden="true">×</span>
      </a>
    ) : null}

    <a
      href="/products"
      className="px-2 py-1.5 text-sm font-semibold text-[#C85A1A] transition-colors hover:text-orange-700"
    >
      مسح الكل
    </a>
  </div>
) : null}

        {totalPages > 1 ? (
          <div className="mt-4 flex justify-end">
            <div className="inline-flex w-fit items-center rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600">
              الصفحة
              <span className="mx-1 font-bold text-stone-900">
                {currentPage}
              </span>
              من
              <span className="mr-1 font-bold text-stone-900">
                {totalPages}
              </span>
            </div>
          </div>
        ) : null}

<div className="mt-8 w-full">
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
          ? "جرّب تغيير عبارة البحث أو خيارات التصفية."
          : "ستظهر آلات القهوة المنشورة هنا عند إضافتها."
      }
      showResetButton={hasActiveFilters}
    />
  )}
</div>

{products.length > 0 ? (
  <div className="mt-10 pt-4">
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
    </main>
  );
}