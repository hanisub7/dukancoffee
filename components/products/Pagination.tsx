import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
};

function buildPageUrl(
  page: number,
  query: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const queryString = searchParams.toString();

  return queryString ? `/products?${queryString}` : "/products";
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  query = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(
    currentPage,
    totalPages,
  );

  const previousPage = Math.max(currentPage - 1, 1);
  const nextPage = Math.min(currentPage + 1, totalPages);

  return (
    <nav
      aria-label="Products pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(previousPage, query)}
          className="flex min-h-11 items-center justify-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#e87524] focus:ring-offset-2"
        >
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-5 text-sm font-medium text-neutral-400"
        >
          Previous
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {visiblePages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="flex h-11 min-w-11 items-center justify-center px-2 text-sm text-neutral-400"
              >
                …
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return isCurrentPage ? (
            <span
              key={page}
              aria-current="page"
              className="flex h-11 min-w-11 items-center justify-center rounded-full bg-[#e87524] px-3 text-sm font-semibold text-white"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildPageUrl(page, query)}
              aria-label={`Go to page ${page}`}
              className="flex h-11 min-w-11 items-center justify-center rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#e87524] focus:ring-offset-2"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(nextPage, query)}
          className="flex min-h-11 items-center justify-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#e87524] focus:ring-offset-2"
        >
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-5 text-sm font-medium text-neutral-400"
        >
          Next
        </span>
      )}
    </nav>
  );
}