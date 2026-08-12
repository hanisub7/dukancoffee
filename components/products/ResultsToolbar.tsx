"use client";

import type { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ResultsToolbarProps = {
  totalProducts: number;
  selectedSort: string;
};

const sortOptions = [
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

export default function ResultsToolbar({
  totalProducts,
  selectedSort,
}: ResultsToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const nextParams = new URLSearchParams(
      searchParams.toString(),
    );

    const nextSort = event.target.value;

    if (nextSort === "updated") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", nextSort);
    }

    nextParams.delete("page");

    const queryString = nextParams.toString();

    router.push(
      queryString
        ? `/products?${queryString}`
        : "/products",
    );
  }

  return (
    <div
      dir="rtl"
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-xs font-semibold text-brand">
          النتائج
        </p>

<p className="mt-1 text-lg font-bold text-stone-900">
  {totalProducts === 0
    ? "لم يتم العثور على آلات قهوة"
    : totalProducts === 1
      ? "تم العثور على آلة قهوة واحدة"
      : `تم العثور على ${totalProducts} آلات قهوة`}
</p>
      </div>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
        <label
          htmlFor="results-sort"
          className="text-sm font-medium text-stone-600"
        >
          ترتيب حسب
        </label>

        <div className="relative min-w-[210px]">
          <select
            id="results-sort"
            value={selectedSort}
            onChange={handleSortChange}
            className="h-9 w-full appearance-none rounded-lg border border-stone-200 bg-white px-3 pe-9 text-sm font-medium text-stone-900 outline-none transition-colors hover:border-stone-300 focus:border-brand focus:ring-2 focus:ring-brand/10"
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
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
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
    </div>
  );
}