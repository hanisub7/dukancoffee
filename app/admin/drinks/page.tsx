import Link from "next/link";

import { deleteDrink } from "@/app/actions/drink";
import { prisma } from "../../lib/prisma";

export default async function DrinksPage() {
  const drinks = await prisma.drink.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        nameEn: "asc",
      },
    ],
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
      sortOrder: true,
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
          <h1 className="text-3xl font-bold">Drinks</h1>

          <p className="mt-2 text-gray-600">
            Manage drinks supported by coffee machines.
          </p>
        </div>

        <Link
          href="/admin/drinks/new"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          + Add Drink
        </Link>
      </div>

      {drinks.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No drinks yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first drink.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  English Name
                </th>

                <th className="px-6 py-4 text-left">
                  Arabic Name
                </th>

                <th className="px-6 py-4 text-left">
                  Sort Order
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
              {drinks.map((drink) => {
                const canDelete =
                  drink._count.products === 0;

                const deleteDrinkAction =
                  deleteDrink.bind(null, drink.id);

                return (
                  <tr
                    key={drink.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {drink.nameEn}
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {drink._count.products}{" "}
                        {drink._count.products === 1
                          ? "product"
                          : "products"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {drink.nameAr}
                    </td>

                    <td className="px-6 py-4">
                      {drink.sortOrder}
                    </td>

                    <td className="px-6 py-4">
                      {drink.active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/drinks/${drink.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        {canDelete ? (
                          <form action={deleteDrinkAction}>
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
                            title="Drinks assigned to products cannot be deleted."
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