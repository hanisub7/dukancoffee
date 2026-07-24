import Link from "next/link";
import { notFound } from "next/navigation";

import {
  createPriceHistory,
  deletePriceHistory,
  updatePriceHistory,
} from "../../../../../../actions/price-history";
import { prisma } from "../../../../../../lib/prisma";

type PriceHistoryPageProps = {
  params: Promise<{
    id: string;
    offerId: string;
  }>;
};

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDateTimeInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default async function PriceHistoryPage({
  params,
}: PriceHistoryPageProps) {
  const { id: productId, offerId } = await params;

  const offer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId,
      product: {
        deletedAt: null,
      },
    },
    select: {
      id: true,
      productId: true,
      currencyCode: true,
      currentPrice: true,
      originalPrice: true,
      discountPercent: true,
      inStock: true,
      checkedAt: true,
      product: {
        select: {
          id: true,
          fullName: true,
          status: true,
        },
      },
      retailer: {
        select: {
          id: true,
          name: true,
        },
      },
      priceHistory: {
        orderBy: [
          {
            checkedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          price: true,
          originalPrice: true,
          discountPercent: true,
          inStock: true,
          checkedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const isArchived = offer.product.status === "ARCHIVED";

  const createAction = createPriceHistory.bind(
    null,
    productId,
    offerId,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/admin/products/${productId}/offers`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to offers
          </Link>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
            Price History
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {offer.product.fullName}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Retailer: {offer.retailer.name}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Current offer
          </p>

          <p className="mt-1 text-xl font-bold text-gray-950">
            {offer.currentPrice.toString()} {offer.currencyCode}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {offer.inStock ? "In stock" : "Out of stock"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Checked {formatDateTime(offer.checkedAt)}
          </p>
        </div>
      </div>

      {isArchived ? (
        <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          This product is archived. Price history cannot be added,
          edited, or deleted.
        </div>
      ) : (
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-950">
              Add price history entry
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Record a price check for this retailer offer.
            </p>
          </div>

          <form
            action={createAction}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-5"
          >
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Current price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={offer.currentPrice.toString()}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="originalPrice"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Original price
              </label>

              <input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  offer.originalPrice?.toString() ?? ""
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="inStock"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Stock status
              </label>

              <select
                id="inStock"
                name="inStock"
                defaultValue={offer.inStock ? "true" : "false"}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="true">In stock</option>
                <option value="false">Out of stock</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="checkedAt"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Checked at
              </label>

              <input
                id="checkedAt"
                name="checkedAt"
                type="datetime-local"
                defaultValue={formatDateTimeInput(new Date())}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-950 px-4 py-2 font-medium text-white transition hover:bg-gray-800"
              >
                Add entry
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-950">
            Recorded history
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {offer.priceHistory.length}{" "}
            {offer.priceHistory.length === 1
              ? "entry"
              : "entries"}
          </p>
        </div>

        {offer.priceHistory.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-medium text-gray-800">
              No price history entries yet.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add the first price check using the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {offer.priceHistory.map((entry) => {
              const updateAction = updatePriceHistory.bind(
                null,
                productId,
                offerId,
                entry.id,
              );

              const deleteAction = deletePriceHistory.bind(
                null,
                productId,
                offerId,
                entry.id,
              );

              return (
                <div key={entry.id} className="p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-950">
                        {entry.price.toString()}{" "}
                        {offer.currencyCode}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Checked {formatDateTime(entry.checkedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          entry.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.inStock
                          ? "In stock"
                          : "Out of stock"}
                      </span>

                      {entry.discountPercent !== null ? (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          {entry.discountPercent}% discount
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {isArchived ? (
                    <dl className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {entry.price.toString()}{" "}
                          {offer.currencyCode}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Original price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {entry.originalPrice
                            ? `${entry.originalPrice.toString()} ${
                                offer.currencyCode
                              }`
                            : "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Created
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDateTime(entry.createdAt)}
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <form
                      action={updateAction}
                      className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
                    >
                      <div>
                        <label
                          htmlFor={`price-${entry.id}`}
                          className="mb-2 block text-sm font-medium text-gray-800"
                        >
                          Current price
                        </label>

                        <input
                          id={`price-${entry.id}`}
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          defaultValue={entry.price.toString()}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`originalPrice-${entry.id}`}
                          className="mb-2 block text-sm font-medium text-gray-800"
                        >
                          Original price
                        </label>

                        <input
                          id={`originalPrice-${entry.id}`}
                          name="originalPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={
                            entry.originalPrice?.toString() ?? ""
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`inStock-${entry.id}`}
                          className="mb-2 block text-sm font-medium text-gray-800"
                        >
                          Stock status
                        </label>

                        <select
                          id={`inStock-${entry.id}`}
                          name="inStock"
                          defaultValue={
                            entry.inStock ? "true" : "false"
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="true">In stock</option>
                          <option value="false">
                            Out of stock
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`checkedAt-${entry.id}`}
                          className="mb-2 block text-sm font-medium text-gray-800"
                        >
                          Checked at
                        </label>

                        <input
                          id={`checkedAt-${entry.id}`}
                          name="checkedAt"
                          type="datetime-local"
                          defaultValue={formatDateTimeInput(
                            entry.checkedAt,
                          )}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          type="submit"
                          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                        >
                          Save
                        </button>

                        <button
                          type="submit"
                          formAction={deleteAction}
                          className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}