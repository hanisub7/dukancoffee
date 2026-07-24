import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "../../../lib/prisma";

type ProductWorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function getStatusClasses(status: string): string {
  if (status === "PUBLISHED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "REVIEW") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "ARCHIVED") {
    return "bg-gray-200 text-gray-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default async function ProductWorkspaceLayout({
  children,
  params,
}: ProductWorkspaceLayoutProps) {
  const { id } = await params;

  /*
   * Prevent static product routes such as /products/new
   * from being sent to Prisma as UUID values.
   */
  if (id === "new") {
    return children;
  }

  if (!isUuid(id)) {
    notFound();
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      model: true,
      modelNumber: true,
      status: true,
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          nameEn: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const tabs = [
    {
      label: "Overview",
      href: `/admin/products/${product.id}`,
    },
    {
      label: "Specifications",
      href: `/admin/products/${product.id}/specifications`,
    },
    {
      label: "Features",
      href: `/admin/products/${product.id}/features`,
    },
    {
      label: "Images",
      href: `/admin/products/${product.id}/images`,
    },
    {
      label: "Offers",
      href: `/admin/products/${product.id}/offers`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">
              {product.fullName}
            </h1>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(
                product.status,
              )}`}
            >
              {product.status}
            </span>
          </div>

          <p className="mt-2 text-gray-600">
            {product.brand.name} · {product.category.nameEn}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Model: {product.model}
            {product.modelNumber
              ? ` · Model Number: ${product.modelNumber}`
              : ""}
          </p>
        </div>

        <Link
          href={`/admin/products/${product.id}/edit`}
          className="inline-flex rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Edit Product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border-b">
        <nav className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className="border-b-2 border-transparent px-4 py-3 font-medium text-gray-500 hover:border-gray-300 hover:text-black"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}