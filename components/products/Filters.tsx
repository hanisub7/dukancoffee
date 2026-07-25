"use client";

import { useState } from "react";

type FilterOption = {
  value: string;
  label: string;
};

type FiltersProps = {
  brands: FilterOption[];
  categories: FilterOption[];
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSort?: string;
};

const sortOptions: FilterOption[] = [
  {
    value: "updated",
    label: "الأحدث تحديثًا",
  },
  {
    value: "price-asc",
    label: "السعر: من الأقل",
  },
  {
    value: "price-desc",
    label: "السعر: من الأعلى",
  },
  {
    value: "name",
    label: "الاسم",
  },
];

export default function Filters({
  brands,
  categories,
  selectedBrand = "",
  selectedCategory = "",
  selectedSort = "updated",
}: FiltersProps) {
  const [showAdditionalOptions, setShowAdditionalOptions] =
    useState(false);

  const hasSelectedFilters = Boolean(
    selectedBrand ||
      selectedCategory ||
      selectedSort !== "updated",
  );

  return (
    <div dir="rtl" className="w-full">
      <form
        action="/products"
        method="get"
        className="rounded-2xl border border-black/10 bg-white p-3 sm:p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label
              htmlFor="category"
              className="sr-only"
            >
              نوع آلة القهوة
            </label>

            <div className="relative">
              <select
                id="category"
                name="category"
                defaultValue={selectedCategory}
                className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pe-10 text-sm font-medium text-black outline-none transition-colors hover:border-black/25 focus:border-[#C85A1A] focus:ring-2 focus:ring-[#C85A1A]/10"
              >
                <option value="">نوع الآلة</option>

                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>

              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
              >
                <path
                  d="m6 8 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="sr-only"
            >
              العلامة التجارية
            </label>

            <div className="relative">
              <select
                id="brand"
                name="brand"
                defaultValue={selectedBrand}
                className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pe-10 text-sm font-medium text-black outline-none transition-colors hover:border-black/25 focus:border-[#C85A1A] focus:ring-2 focus:ring-[#C85A1A]/10"
              >
                <option value="">العلامة التجارية</option>

                {brands.map((brand) => (
                  <option
                    key={brand.value}
                    value={brand.value}
                  >
                    {brand.label}
                  </option>
                ))}
              </select>

              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
              >
                <path
                  d="m6 8 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="sr-only"
            >
              ترتيب المنتجات
            </label>

            <div className="relative">
              <select
                id="sort"
                name="sort"
                defaultValue={selectedSort}
                className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pe-10 text-sm font-medium text-black outline-none transition-colors hover:border-black/25 focus:border-[#C85A1A] focus:ring-2 focus:ring-[#C85A1A]/10"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45"
              >
                <path
                  d="m6 8 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F2A064] px-5 text-sm font-bold text-black transition-colors hover:bg-[#E98B48] focus:outline-none focus:ring-2 focus:ring-[#C85A1A] focus:ring-offset-2"
          >
            تطبيق
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
          <button
            type="button"
            onClick={() =>
              setShowAdditionalOptions((current) => !current)
            }
            aria-expanded={showAdditionalOptions}
            aria-controls="additional-filter-options"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-black/60 transition-colors hover:text-black"
          >
            <span>خيارات متقدمة</span>

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className={`h-3.5 w-3.5 transition-transform ${
                showAdditionalOptions ? "rotate-180" : ""
              }`}
            >
              <path
                d="m6 8 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {hasSelectedFilters ? (
            <a
              href="/products"
              className="text-xs font-medium text-black/55 transition-colors hover:text-black"
            >
              مسح الاختيارات
            </a>
          ) : null}
        </div>

        {showAdditionalOptions ? (
          <div
            id="additional-filter-options"
            className="mt-3 rounded-xl bg-[#fafaf9] px-4 py-3"
          >
            <p className="text-xs leading-6 text-black/55">
              ستظهر هنا لاحقًا خيارات إضافية مثل نظام
              الحليب والمطحنة ونطاق السعر، دون ازدحام
              الصفحة الرئيسية للفلاتر.
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}