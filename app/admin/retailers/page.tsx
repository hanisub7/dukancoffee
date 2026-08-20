import Link from "next/link";

import { deleteRetailer } from "@/app/actions/retailer";
import { prisma } from "../../lib/prisma";

export default async function RetailersPage() {
  const retailers = await prisma.retailer.findMany({
    include: {
      country: true,
      _count: {
        select: {
          offers: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retailers</h1>

          <p className="mt-2 text-gray-600">
            Manage coffee machine retailers.
          </p>
        </div>

        <Link
          href="/admin/retailers/new"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          + Add Retailer
        </Link>
      </div>

      {retailers.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No retailers yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first retailer.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Retailer
                </th>

                <th className="px-6 py-4 text-left">
                  Country
                </th>

                <th className="px-6 py-4 text-left">
                  Website
                </th>

                <th className="px-6 py-4 text-left">
                  Affiliate Status
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
              {retailers.map((retailer) => {
                const canDelete = retailer._count.offers === 0;

                const deleteRetailerAction =
                  deleteRetailer.bind(null, retailer.id);

                return (
                  <tr
                    key={retailer.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {retailer.name}
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {retailer._count.offers}{" "}
                        {retailer._count.offers === 1
                          ? "offer"
                          : "offers"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {retailer.country.nameEn}
                    </td>

                    <td className="px-6 py-4">
                      {retailer.websiteUrl}
                    </td>

                    <td className="px-6 py-4">
                      {retailer.affiliateProgramStatus}
                    </td>

                    <td className="px-6 py-4">
                      {retailer.active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/retailers/${retailer.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        {canDelete ? (
                          <form action={deleteRetailerAction}>
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
                            title="Retailers with offers cannot be deleted."
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