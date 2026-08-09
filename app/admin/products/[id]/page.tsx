import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "../../../lib/prisma";

type ProductOverviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type HealthItem = {
  label: string;
  complete: boolean;
  value: string;
  href: string;
};

function ExternalLink({
  href,
  label,
}: {
  href: string | null;
  label: string;
}) {
  if (!href) {
    return <span className="text-gray-500">Not provided</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-all font-medium text-blue-600 hover:underline"
    >
      {label}
    </a>
  );
}

function getCompletionColor(completion: number): string {
  if (completion === 100) {
    return "text-green-700";
  }

  if (completion >= 70) {
    return "text-orange-700";
  }

  return "text-red-700";
}

function getCompletionBackground(completion: number): string {
  if (completion === 100) {
    return "bg-green-600";
  }

  if (completion >= 70) {
    return "bg-orange-500";
  }

  return "bg-red-500";
}

export default async function ProductOverviewPage({
  params,
}: ProductOverviewPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      brand: true,
      category: true,

      productFamily: {
        select: {
          id: true,
          name: true,
        },
      },

      specification: true,

      _count: {
        select: {
          images: true,
          features: true,
          boxContents: true,
          offers: true,
          documents: true,
          sources: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const healthItems: HealthItem[] = [
    {
      label: "Specifications",
      complete: Boolean(product.specification),
      value: product.specification ? "Complete" : "Missing",
      href: `/admin/products/${product.id}/specifications`,
    },
    {
      label: "Features",
      complete: product._count.features > 0,
      value: `${product._count.features}`,
      href: `/admin/products/${product.id}/features`,
    },
    {
      label: "Images",
      complete: product._count.images > 0,
      value: `${product._count.images}`,
      href: `/admin/products/${product.id}/images`,
    },
    {
      label: "Box Contents",
      complete: product._count.boxContents > 0,
      value: `${product._count.boxContents}`,
      href: `/admin/products/${product.id}/box-contents`,
    },
    {
      label: "Documents",
      complete: product._count.documents > 0,
      value: `${product._count.documents}`,
      href: `/admin/products/${product.id}/documents`,
    },
    {
      label: "Sources",
      complete: product._count.sources > 0,
      value: `${product._count.sources}`,
      href: `/admin/products/${product.id}/sources`,
    },
    {
      label: "Offers",
      complete: product._count.offers > 0,
      value: `${product._count.offers}`,
      href: `/admin/products/${product.id}/offers`,
    },
  ];

  const completedHealthItems = healthItems.filter(
    (item) => item.complete,
  ).length;

  const completionPercentage = Math.round(
    (completedHealthItems / healthItems.length) * 100,
  );

  return (
    <>
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-orange-700">
              Product Health
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-900">
              Catalog completeness
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Review the product information required before
              publication and retailer promotion.
            </p>
          </div>

          <div className="rounded-2xl bg-stone-50 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Overall completion
            </p>

            <p
              className={`mt-2 text-4xl font-bold ${getCompletionColor(
                completionPercentage,
              )}`}
            >
              {completionPercentage}%
            </p>

            <p className="mt-1 text-xs text-stone-500">
              {completedHealthItems} of {healthItems.length} areas
              complete
            </p>
          </div>
        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full transition-all ${getCompletionBackground(
              completionPercentage,
            )}`}
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {healthItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-stone-900">
                  {item.label}
                </p>

                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    item.complete
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-100 text-stone-400"
                  }`}
                  aria-label={
                    item.complete ? "Complete" : "Incomplete"
                  }
                >
                  {item.complete ? "✓" : "○"}
                </span>
              </div>

              <p
                className={`mt-4 text-2xl font-bold ${
                  item.complete
                    ? "text-stone-900"
                    : "text-stone-400"
                }`}
              >
                {item.value}
              </p>

              <p className="mt-2 text-xs text-stone-500 transition-colors group-hover:text-orange-700">
                Open section →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={`/admin/products/${product.id}/specifications`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Specifications
            </p>

            <p className="mt-3 text-2xl font-bold">
              {product.specification ? "Complete" : "Missing"}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {product.specification
                ? "Specification data has been added."
                : "Add the product specification data."}
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/features`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Features
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.features}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Factual manufacturer features.
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/images`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Images
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.images}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Product images in the gallery.
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/box-contents`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Box Contents
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.boxContents}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Items included in the product box.
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/documents`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Documents
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.documents}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Manuals, warranties, and official documents.
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/sources`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Sources
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.sources}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Sources used to verify product information.
            </p>
          </Link>

          <Link
            href={`/admin/products/${product.id}/offers`}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Offers
            </p>

            <p className="mt-3 text-3xl font-bold">
              {product._count.offers}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Retailer prices linked to this product.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Product Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Core factual catalog information for this product.
            </p>
          </div>

          <Link
            href={`/admin/products/${product.id}/edit`}
            className="font-medium text-orange-700 hover:underline"
          >
            Edit information
          </Link>
        </div>

        <dl className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Product Name
            </dt>

            <dd className="mt-1 font-medium">
              {product.fullName}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Brand
            </dt>

            <dd className="mt-1 font-medium">
              {product.brand.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Category
            </dt>

            <dd className="mt-1 font-medium">
              {product.category.nameEn}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Product Family
            </dt>

            <dd className="mt-1 font-medium">
              {product.productFamily?.name ?? "Not assigned"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Model
            </dt>

            <dd className="mt-1 font-medium">
              {product.model}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Model Number
            </dt>

            <dd className="mt-1 font-medium">
              {product.modelNumber ?? "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Release Year
            </dt>

            <dd className="mt-1 font-medium">
              {product.releaseYear ?? "Not provided"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Status
            </dt>

            <dd className="mt-1 font-medium">
              {product.status}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Slug
            </dt>

            <dd className="mt-1 break-all font-medium">
              {product.slug}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Last Verified
            </dt>

            <dd className="mt-1 font-medium">
              {product.lastVerifiedAt
                ? product.lastVerifiedAt.toLocaleDateString()
                : "Not verified yet"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Official Product Page
            </dt>

            <dd className="mt-1">
              <ExternalLink
                href={product.officialProductUrl}
                label="Open official page"
              />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Manual
            </dt>

            <dd className="mt-1">
              <ExternalLink
                href={product.manualUrl}
                label="Open manual"
              />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Warranty
            </dt>

            <dd className="mt-1">
              <ExternalLink
                href={product.warrantyUrl}
                label="Open warranty information"
              />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Documents
            </dt>

            <dd className="mt-1 font-medium">
              {product._count.documents}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">
              Sources
            </dt>

            <dd className="mt-1 font-medium">
              {product._count.sources}
            </dd>
          </div>
        </dl>
      </section>
    </>
  );
}