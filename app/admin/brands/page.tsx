import Link from "next/link";

import { deleteBrand } from "@/app/actions/brand";
import { prisma } from "../../lib/prisma";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      officialWebsiteUrl: true,
      active: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>

          <p className="mt-2 text-gray-600">
            Manage coffee machine brands.
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          + Add Brand
        </Link>
      </div>

      {brands.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No brands yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first brand.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Brand
                </th>

                <th className="px-6 py-4 text-left">
                  Website
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => {
                const canDelete =
                  brand._count.products === 0;

                const deleteBrandAction =
                  deleteBrand.bind(null, brand.id);

                return (
                  <tr
                    key={brand.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4 font-medium">
                      {brand.name}

                      <p className="mt-1 text-xs text-gray-400">
                        {brand._count.products}{" "}
                        {brand._count.products === 1
                          ? "product"
                          : "products"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {brand.officialWebsiteUrl ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      {brand.active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        {canDelete ? (
                          <form action={deleteBrandAction}>
                            <button
                              type="submit"
                              className="font-medium text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </form>
                        ) : (
                          <span
                            className="cursor-not-allowed text-sm text-gray-400"
                            title="Brands assigned to products cannot be deleted."
                          >
                            Delete
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}