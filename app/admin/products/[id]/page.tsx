import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "../../../lib/prisma";

type ProductOverviewPageProps = {
  params: Promise<{
    id: string;
  }>;
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

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href={`/admin/products/${product.id}/specifications`}
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
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
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
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
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
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
          href={`/admin/products/${product.id}/offers`}
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
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

      <div className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
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
            className="font-medium text-blue-600 hover:underline"
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
      </div>
    </>
  );
}