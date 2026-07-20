import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
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
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
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
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {brand.name}
                  </td>

                  <td className="px-6 py-4">
                    {brand.officialWebsiteUrl ?? "-"}
                  </td>

                  <td className="px-6 py-4">
                    {brand.active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}