import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";

type ProductOffersPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(value: unknown, currencyCode: string) {
  const numberValue = Number(value);

  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

export default async function ProductOffersPage({
  params,
}: ProductOffersPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      offers: {
        include: {
          retailer: true,
        },
        orderBy: {
          checkedAt: "desc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Offers</h2>

          <p className="mt-1 text-gray-600">
            Manage retailer prices for {product.fullName}.
          </p>
        </div>

        <Link
          href={`/admin/products/${product.id}/offers/new`}
          className="inline-flex w-fit rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
        >
          + Add Offer
        </Link>
      </div>

      {product.offers.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold">No offers yet</h3>

          <p className="mt-2 text-gray-500">
            Add the first retailer price for this product.
          </p>

          <Link
            href={`/admin/products/${product.id}/offers/new`}
            className="mt-6 inline-flex rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            Add First Offer
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold">Retailer</th>
                  <th className="px-6 py-4 font-semibold">Current Price</th>
                  <th className="px-6 py-4 font-semibold">Original Price</th>
                  <th className="px-6 py-4 font-semibold">Discount</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Last Checked</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.offers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {offer.retailer.name}
                      </div>

                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                      >
                        View retailer page
                      </a>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {formatPrice(
                        offer.currentPrice,
                        offer.currencyCode
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {offer.originalPrice
                        ? formatPrice(
                            offer.originalPrice,
                            offer.currencyCode
                          )
                        : "—"}
                    </td>

                    <td className="px-6 py-4">
                      {offer.discountPercent !== null ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          {offer.discountPercent}% off
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {offer.inStock ? (
                        <span className="font-medium text-green-600">
                          ✓ In Stock
                        </span>
                      ) : (
                        <span className="font-medium text-red-600">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {offer.checkedAt.toLocaleDateString("en-SA")}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}/offers/${offer.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}