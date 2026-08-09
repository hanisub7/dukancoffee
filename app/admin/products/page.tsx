import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      specification: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="mt-2 text-gray-600">
            Manage all coffee machines in your catalog.
          </p>
        </div>

 <Link
  href="/admin/products/new"
  className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-md"
>
  + Add Product
</Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">No products yet</h2>

          <p className="mt-2 text-gray-500">
            Add your first coffee machine to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="border-b bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Brand</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Model</th>
                <th className="px-6 py-4 font-semibold">Specifications</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    {product.fullName}
                  </td>

                  <td className="px-6 py-4">
                    {product.brand.name}
                  </td>

                  <td className="px-6 py-4">
                    {product.category.nameEn}
                  </td>

                  <td className="px-6 py-4">
                    {product.model}
                  </td>

                  <td className="px-6 py-4">
                    {product.specification ? (
                      <span className="font-medium text-green-600">
                        ✓ Complete
                      </span>
                    ) : (
                      <span className="font-medium text-amber-600">
                        Missing
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {product.status}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-5">
                      <Link
                        href={`/admin/products/${product.id}/images`}
                        className="font-medium text-green-600 hover:underline"
                      >
                        Images
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/box-contents`}
                        className="hover:text-orange-700"
                      >
                        Box Contents
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/specifications`}
                        className="font-medium text-purple-600 hover:underline"
                      >
                        Specifications
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
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