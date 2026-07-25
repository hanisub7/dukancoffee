"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const normalizedSearch = searchValue.trim();

    if (normalizedSearch) {
      params.set("search", normalizedSearch);
    } else {
      params.delete("search");
    }

    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function handleClear() {
    setSearchValue("");

    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.delete("page");

    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto w-full max-w-3xl"
    >
      <div className="flex min-h-12 items-center gap-2 rounded-xl border border-black/15 bg-white p-1.5 transition-colors focus-within:border-black/40">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="mr-2 h-5 w-5 shrink-0 text-black/50"
        >
          <path
            d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <label htmlFor="product-search" className="sr-only">
          ابحث عن آلة قهوة
        </label>

        <input
          id="product-search"
          name="search"
          type="search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="ابحث باسم الآلة أو الموديل"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-black outline-none placeholder:text-black/40 sm:text-base"
        />

        {searchValue ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="مسح البحث"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-black/50 transition-colors hover:bg-black/5 hover:text-black"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="m7 7 10 10M17 7 7 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : null}

        <button
          type="submit"
          className="min-h-9 shrink-0 rounded-lg bg-[#F2A064] px-4 text-sm font-bold text-black transition-colors hover:bg-[#E98B48] sm:px-5"
        >
          بحث
        </button>
      </div>
    </form>
  );
}