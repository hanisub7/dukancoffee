import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "../../../../lib/prisma";

type ProductOffersPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatPrice(
  value: unknown,
  currencyCode: string,
): string {
  const numberValue = Number(value);

  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(numberValue);
}

function formatCheckedAt(value: Date): string {
  return new Intl.DateTimeFormat("en-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function ProductOffersPage({
  params,
}: ProductOffersPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      status: true,
      offers: {
        include: {
          retailer: {
            select: {
              id: true,
              name: true,
              active: true,
            },
          },
        },
        orderBy: [
          {
            inStock: "desc",
          },
          {
            currentPrice: "asc",
          },
          {
            checkedAt: "desc",
          },
        ],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const isArchived = product.status === "ARCHIVED";

  const inStockOffers = product.offers.filter(
    (offer) => offer.inStock,
  );

  const lowestPriceOffer =
    inStockOffers.length > 0
      ? inStockOffers.reduce((lowest, offer) =>
          Number(offer.currentPrice) <
          Number(lowest.currentPrice)
            ? offer
            : lowest,
        )
      : null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Offers
          </h2>

          <p className="mt-1 text-gray-600">
            Manage retailer prices for{" "}
            <strong>{product.fullName}</strong>.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Status:{" "}
            <span className="font-medium text-gray-700">
              {product.status}
            </span>
          </p>
        </div>

        {!isArchived && (
          <Link
            href={`/admin/products/${product.id}/offers/new`}
            className="inline-flex w-fit rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
          >
            + Add Offer
          </Link>
        )}
      </div>

      {isArchived && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          This product is archived. Offers cannot be added,
          edited, or deleted until the product is restored.
        </div>
      )}

      {product.offers.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Offers
            </p>

            <p className="mt-2 text-2xl font-bold">
              {product.offers.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              In Stock
            </p>

            <p className="mt-2 text-2xl font-bold">
              {inStockOffers.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Lowest Available Price
            </p>

            <p className="mt-2 text-2xl font-bold">
              {lowestPriceOffer
                ? formatPrice(
                    lowestPriceOffer.currentPrice,
                    lowestPriceOffer.currencyCode,
                  )
                : "—"}
            </p>

            {lowestPriceOffer && (
              <p className="mt-1 text-sm text-gray-500">
                {lowestPriceOffer.retailer.name}
              </p>
            )}
          </div>
        </div>
      )}

      {product.offers.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold">
            No offers yet
          </h3>

          <p className="mt-2 text-gray-500">
            Add the first retailer price for this
            product.
          </p>

          {!isArchived && (
            <Link
              href={`/admin/products/${product.id}/offers/new`}
              className="mt-6 inline-flex rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
            >
              Add First Offer
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Retailer
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Current Price
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Original Price
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Discount
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Stock
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Affiliate
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Last Checked
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.offers.map((offer) => {
                  const isLowestPrice =
                    lowestPriceOffer?.id === offer.id;

                  return (
                    <tr
                      key={offer.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {offer.retailer.name}
                          </span>

                          {!offer.retailer.active && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              Inactive
                            </span>
                          )}

                          {isLowestPrice && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Lowest
                            </span>
                          )}
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
                          offer.currencyCode,
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {offer.originalPrice
                          ? formatPrice(
                              offer.originalPrice,
                              offer.currencyCode,
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        {offer.discountPercent !== null ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            {offer.discountPercent}% off
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            —
                          </span>
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

                      <td className="px-6 py-4">
                        {offer.affiliateUrl ? (
                          <a
                            href={offer.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Open link
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatCheckedAt(offer.checkedAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/admin/products/${product.id}/offers/${offer.id}/history`}
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            History
                          </Link>

                          {isArchived ? (
                            <span className="text-gray-400">
                              Locked
                            </span>
                          ) : (
                            <Link
                              href={`/admin/products/${product.id}/offers/${offer.id}/edit`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}