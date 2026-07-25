import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

import { createBoxContent, deleteBoxContent } from "./actions";

type BoxContentsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BoxContentsPage({
  params,
}: BoxContentsPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      boxContents: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          itemName: true,
          quantity: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Link
            href={`/admin/products/${product.id}`}
            className="text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            ← Back to product
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-stone-900">
            Box Contents
          </h1>

          <p className="mt-2 text-stone-600">{product.fullName}</p>
        </div>
      </div>

      <form
        action={createBoxContent}
        className="mb-8 grid gap-4 rounded-xl border border-stone-200 bg-white p-6 md:grid-cols-[1fr_160px_auto]"
      >
        <input type="hidden" name="productId" value={product.id} />

        <div>
          <label
            htmlFor="itemName"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Item name
          </label>

          <input
            id="itemName"
            name="itemName"
            type="text"
            required
            placeholder="Example: Portafilter"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-stone-500"
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Quantity
          </label>

          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            defaultValue="1"
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none focus:border-stone-500"
          />
        </div>

        <button
          type="submit"
          className="self-end rounded-lg bg-stone-900 px-5 py-2 font-medium text-white transition hover:bg-stone-700"
        >
          Add item
        </button>
      </form>

      {product.boxContents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="text-stone-600">No box contents added yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                  Item
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-stone-700">
                  Quantity
                </th>
                <th className="px-5 py-4 text-right text-sm font-semibold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200">
              {product.boxContents.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 text-stone-900">
                    {item.itemName}
                  </td>

                  <td className="px-5 py-4 text-stone-700">
                    {item.quantity}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <form action={deleteBoxContent}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />

                      <input
                        type="hidden"
                        name="boxContentId"
                        value={item.id}
                      />

                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}