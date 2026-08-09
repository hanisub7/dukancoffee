import Link from "next/link";
import { notFound } from "next/navigation";

import { updateOffer } from "@/app/actions/offer";
import { prisma } from "@/app/lib/prisma";

import OfferForm from "../../components/OfferForm";

type EditProductOfferPageProps = {
  params: Promise<{
    id: string;
    offerId: string;
  }>;
};

export default async function EditProductOfferPage({
  params,
}: EditProductOfferPageProps) {
  const { id, offerId } = await params;

  const [product, offer] = await Promise.all([
    prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        status: true,
      },
    }),

    prisma.offer.findFirst({
      where: {
        id: offerId,
        productId: id,
      },
      select: {
        id: true,
        productId: true,
        retailerId: true,
        currentPrice: true,
        originalPrice: true,
        currencyCode: true,
        productUrl: true,
        affiliateUrl: true,
        inStock: true,
      },
    }),
  ]);

  if (!product || !offer) {
    notFound();
  }

  const retailers = await prisma.retailer.findMany({
    where: {
      OR: [
        {
          active: true,
          deletedAt: null,
        },
        {
          id: offer.retailerId,
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

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
            Offers cannot be modified until this product is
            restored.
          </p>
        </div>
      </div>
    );
  }

  const updateOfferAction = updateOffer.bind(
    null,
    offer.id,
    product.id,
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
          Edit Offer
        </h2>

        <p className="mt-2 text-gray-600">
          Update the retailer price for{" "}
          <strong>{product.fullName}</strong>.
        </p>
      </div>

      <OfferForm
        productId={product.id}
        retailers={retailers}
        action={updateOfferAction}
        cancelHref={offersHref}
        submitLabel="Save Changes"
        defaultValues={{
          retailerId: offer.retailerId,
          currentPrice: offer.currentPrice.toString(),
          originalPrice:
            offer.originalPrice?.toString() ?? "",
          currencyCode: offer.currencyCode,
          productUrl: offer.productUrl,
          affiliateUrl: offer.affiliateUrl ?? "",
          inStock: offer.inStock,
        }}
      />
    </div>
  );
}