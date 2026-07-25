import Link from "next/link";

type EmptyStateProps = {
  title?: string;
  description?: string;
  showResetButton?: boolean;
};

export default function EmptyState({
  title = "No coffee machines found",
  description = "Try changing your search or filters to see more products.",
  showResetButton = true,
}: EmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
        >
          <path
            d="M4 7.5h16M7 4v3.5M17 4v3.5M5.5 11h13a1.5 1.5 0 0 1 1.5 1.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A1.5 1.5 0 0 1 5.5 11Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 15h6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
        {description}
      </p>

      {showResetButton ? (
        <Link
          href="/products"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#e87524] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#cf651e] focus:outline-none focus:ring-2 focus:ring-[#e87524] focus:ring-offset-2"
        >
          Clear filters
        </Link>
      ) : null}
    </section>
  );
}