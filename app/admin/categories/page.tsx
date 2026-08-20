import Link from "next/link";

import { deleteCategory } from "@/app/actions/category";
import { prisma } from "../../lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
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
          <h1 className="text-3xl font-bold">Categories</h1>

          <p className="mt-2 text-gray-600">
            Manage coffee machine categories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No categories yet
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first category.
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
              {categories.map((category) => {
                const canDelete =
                  category._count.products === 0;

                const deleteCategoryAction =
                  deleteCategory.bind(null, category.id);

                return (
                  <tr
                    key={category.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {category.nameEn}
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        {category._count.products}{" "}
                        {category._count.products === 1
                          ? "product"
                          : "products"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {category.nameAr}
                    </td>

                    <td className="px-6 py-4">
                      {category.sortOrder}
                    </td>

                    <td className="px-6 py-4">
                      {category.active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        {canDelete ? (
                          <form action={deleteCategoryAction}>
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
                            title="Categories assigned to products cannot be deleted."
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