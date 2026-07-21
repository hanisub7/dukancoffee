import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOffer } from "../../../../../../actions/offer";
import { prisma } from "../../../../../../lib/prisma";
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

  const offer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId: id,
    },
    include: {
      product: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const retailers = await prisma.retailer.findMany({
    where: {
      OR: [
        {
          active: true,
        },
        {
          id: offer.retailerId,
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const offersHref = `/admin/products/${offer.product.id}/offers`;

  const updateOfferAction = updateOffer.bind(
    null,
    offer.id,
    offer.product.id
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
        <h2 className="text-2xl font-bold">Edit Offer</h2>

        <p className="mt-2 text-gray-600">
          Update the retailer price for {offer.product.fullName}.
        </p>
      </div>

      <OfferForm
        productId={offer.product.id}
        retailers={retailers}
        action={updateOfferAction}
        cancelHref={offersHref}
        submitLabel="Update Offer"
        defaultValues={{
          retailerId: offer.retailerId,
          currentPrice: offer.currentPrice.toString(),
          originalPrice: offer.originalPrice?.toString() ?? "",
          currencyCode: offer.currencyCode,
          productUrl: offer.productUrl,
          affiliateUrl: offer.affiliateUrl ?? "",
          inStock: offer.inStock,
        }}
      />
    </div>
  );
}