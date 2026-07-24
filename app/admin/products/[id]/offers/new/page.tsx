import Link from "next/link";
import { notFound } from "next/navigation";

import { createOffer } from "../../../../../actions/offer";
import { prisma } from "../../../../../lib/prisma";
import OfferForm from "../components/OfferForm";

type NewProductOfferPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewProductOfferPage({
  params,
}: NewProductOfferPageProps) {
  const { id } = await params;

  const [product, retailers] = await Promise.all([
    prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        status: true,
        offers: {
          select: {
            retailerId: true,
          },
        },
      },
    }),

    prisma.retailer.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const offersHref = `/admin/products/${product.id}/offers`;

  if (product.status === "ARCHIVED") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link
            href={offersHref}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back to Offers
          </Link>
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-50 p-8 text-amber-800">
          <h2 className="text-xl font-semibold">
            Product is archived
          </h2>

          <p className="mt-2">
            New offers cannot be added until this product is restored.
          </p>
        </div>
      </div>
    );
  }

  const usedRetailerIds = new Set(
    product.offers.map((offer) => offer.retailerId),
  );

  const availableRetailers = retailers.filter(
    (retailer) => !usedRetailerIds.has(retailer.id),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href={offersHref}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Offers
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          Add Offer
        </h2>

        <p className="mt-2 text-gray-600">
          Add a retailer price for{" "}
          <strong>{product.fullName}</strong>.
        </p>
      </div>

      {availableRetailers.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold">
            No available retailers
          </h3>

          <p className="mt-2 text-gray-500">
            Every active retailer already has an offer for this
            product, or no active retailers have been created.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={offersHref}
              className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
            >
              Return to Offers
            </Link>

            <Link
              href="/admin/retailers/new"
              className="rounded-lg bg-black px-4 py-2 font-medium text-white hover:bg-gray-800"
            >
              Add Retailer
            </Link>
          </div>
        </div>
      ) : (
        <OfferForm
          productId={product.id}
          retailers={availableRetailers}
          action={createOffer}
          cancelHref={offersHref}
          submitLabel="Save Offer"
        />
      )}
    </div>
  );
}