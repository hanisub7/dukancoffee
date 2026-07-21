import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

type ProductOverviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductOverviewPage({
  params,
}: ProductOverviewPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      brand: true,
      category: true,
      specification: true,
      _count: {
        select: {
          images: true,
          features: true,
          offers: true,
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
              : "Add the machine specification data."}
          </p>
        </Link>

        <Link
          href={`/admin/products/${product.id}/features`}
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
        >
          <p className="text-sm font-medium text-gray-500">Features</p>

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
          <p className="text-sm font-medium text-gray-500">Images</p>

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
          <p className="text-sm font-medium text-gray-500">Offers</p>

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
              Core factual catalog information for this coffee machine.
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
            <dd className="mt-1 font-medium">{product.fullName}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Brand</dt>
            <dd className="mt-1 font-medium">{product.brand.name}</dd>
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
            <dt className="text-sm font-medium text-gray-500">Model</dt>
            <dd className="mt-1 font-medium">{product.model}</dd>
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
              Status
            </dt>
            <dd className="mt-1 font-medium">{product.status}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Slug</dt>
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
        </dl>
      </div>
    </>
  );
}