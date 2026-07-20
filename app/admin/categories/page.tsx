import Link from "next/link";
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
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">No categories yet</h2>

          <p className="mt-2 text-gray-500">
            Create your first category.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">English Name</th>
                <th className="px-6 py-4 text-left">Arabic Name</th>
                <th className="px-6 py-4 text-left">Sort Order</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{category.nameEn}</td>
                  <td className="px-6 py-4">{category.nameAr}</td>
                  <td className="px-6 py-4">{category.sortOrder}</td>
                  <td className="px-6 py-4">
                    {category.active ? "Active" : "Inactive"}
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