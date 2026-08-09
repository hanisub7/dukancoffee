import { notFound } from "next/navigation";

import {
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "../../../../../../actions/promotion";
import { prisma } from "../../../../../../lib/prisma";

type OfferPromotionsPageProps = {
  params: Promise<{
    id: string;
    offerId: string;
  }>;
};

const promotionTypes = [
  "BANK_CARD_DISCOUNT",
  "COUPON_CODE",
  "CASHBACK",
  "FREE_GIFT",
  "FREE_SHIPPING",
  "INSTALLMENT",
  "GENERAL_DISCOUNT",
  "OTHER",
] as const;

function formatDateInput(value: Date | null): string {
  if (!value) {
    return "";
  }

  return value.toISOString().split("T")[0];
}

export default async function OfferPromotionsPage({
  params,
}: OfferPromotionsPageProps) {
  const { id, offerId } = await params;

  const offer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId: id,
      product: {
        deletedAt: null,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          fullName: true,
          status: true,
        },
      },
      retailer: {
        select: {
          name: true,
        },
      },
      promotions: {
        orderBy: [
          {
            active: "desc",
          },
          {
            endsAt: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const archived = offer.product.status === "ARCHIVED";

  const createAction = createPromotion.bind(
    null,
    offer.product.id,
    offer.id,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Offer Promotions
        </h1>

        <p className="mt-2 text-gray-600">
          Manage promotions for{" "}
          <strong>{offer.product.fullName}</strong> at{" "}
          <strong>{offer.retailer.name}</strong>.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Product status: {offer.product.status}
        </p>
      </div>

      {archived && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          Archived products cannot be modified.
        </div>
      )}

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold">
          Add Promotion
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a bank-card discount, coupon, cashback,
          installment plan, gift, shipping offer, or other
          promotion.
        </p>

        <form action={createAction} className="mt-6">
          <fieldset
            disabled={archived}
            className="grid gap-6 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block font-medium">
                Promotion Type
              </label>

              <select
                name="promotionType"
                required
                defaultValue="GENERAL_DISCOUNT"
                className="w-full rounded-lg border p-3"
              >
                {promotionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Title
              </label>

              <input
                name="title"
                type="text"
                required
                className="w-full rounded-lg border p-3"
                placeholder="20% discount with selected bank cards"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={3}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Coupon Code
              </label>

              <input
                name="couponCode"
                type="text"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Bank Name
              </label>

              <input
                name="bankName"
                type="text"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Discount Percent
              </label>

              <input
                name="discountPercent"
                type="number"
                min="0"
                max="100"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Discount Amount
              </label>

              <input
                name="discountAmount"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Cashback Percent
              </label>

              <input
                name="cashbackPercent"
                type="number"
                min="0"
                max="100"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Cashback Amount
              </label>

              <input
                name="cashbackAmount"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Minimum Spend
              </label>

              <input
                name="minimumSpend"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Installment Months
              </label>

              <input
                name="installmentMonths"
                type="number"
                min="1"
                max="120"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Free Gift Description
              </label>

              <textarea
                name="freeGiftDescription"
                rows={2}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Starts At
              </label>

              <input
                name="startsAt"
                type="date"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Ends At
              </label>

              <input
                name="endsAt"
                type="date"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Terms and Conditions
              </label>

              <textarea
                name="terms"
                rows={4}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked
                  className="h-4 w-4"
                />

                <span className="font-medium">
                  Active promotion
                </span>
              </label>

              <button
                type="submit"
                className="rounded-lg bg-brand px-6 py-3 font-medium !text-white shadow-sm transition hover:bg-brand-hover hover:shadow-md"
              >
                Add Promotion
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">
            Current Promotions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {offer.promotions.length}{" "}
            {offer.promotions.length === 1
              ? "promotion"
              : "promotions"}
          </p>
        </div>

        {offer.promotions.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
            No promotions have been added yet.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {offer.promotions.map((promotion) => {
              const updateAction = updatePromotion.bind(
                null,
                offer.product.id,
                offer.id,
                promotion.id,
              );

              const deleteAction = deletePromotion.bind(
                null,
                offer.product.id,
                offer.id,
                promotion.id,
              );

              return (
                <article
                  key={promotion.id}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <form action={updateAction}>
                    <fieldset
                      disabled={archived}
                      className="grid gap-5 md:grid-cols-2"
                    >
                      <div>
                        <label className="mb-2 block font-medium">
                          Promotion Type
                        </label>

                        <select
                          name="promotionType"
                          defaultValue={promotion.promotionType}
                          className="w-full rounded-lg border p-3"
                        >
                          {promotionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Title
                        </label>

                        <input
                          name="title"
                          type="text"
                          required
                          defaultValue={promotion.title}
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block font-medium">
                          Description
                        </label>

                        <textarea
                          name="description"
                          rows={3}
                          defaultValue={
                            promotion.description ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Coupon Code
                        </label>

                        <input
                          name="couponCode"
                          type="text"
                          defaultValue={
                            promotion.couponCode ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Bank Name
                        </label>

                        <input
                          name="bankName"
                          type="text"
                          defaultValue={
                            promotion.bankName ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Discount Percent
                        </label>

                        <input
                          name="discountPercent"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={
                            promotion.discountPercent ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Discount Amount
                        </label>

                        <input
                          name="discountAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={
                            promotion.discountAmount
                              ? Number(
                                  promotion.discountAmount,
                                )
                              : ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Cashback Percent
                        </label>

                        <input
                          name="cashbackPercent"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={
                            promotion.cashbackPercent ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Cashback Amount
                        </label>

                        <input
                          name="cashbackAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={
                            promotion.cashbackAmount
                              ? Number(
                                  promotion.cashbackAmount,
                                )
                              : ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Minimum Spend
                        </label>

                        <input
                          name="minimumSpend"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={
                            promotion.minimumSpend
                              ? Number(
                                  promotion.minimumSpend,
                                )
                              : ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Installment Months
                        </label>

                        <input
                          name="installmentMonths"
                          type="number"
                          min="1"
                          max="120"
                          defaultValue={
                            promotion.installmentMonths ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block font-medium">
                          Free Gift Description
                        </label>

                        <textarea
                          name="freeGiftDescription"
                          rows={2}
                          defaultValue={
                            promotion.freeGiftDescription ?? ""
                          }
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Starts At
                        </label>

                        <input
                          name="startsAt"
                          type="date"
                          defaultValue={formatDateInput(
                            promotion.startsAt,
                          )}
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-medium">
                          Ends At
                        </label>

                        <input
                          name="endsAt"
                          type="date"
                          defaultValue={formatDateInput(
                            promotion.endsAt,
                          )}
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block font-medium">
                          Terms and Conditions
                        </label>

                        <textarea
                          name="terms"
                          rows={4}
                          defaultValue={promotion.terms ?? ""}
                          className="w-full rounded-lg border p-3"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-between gap-4">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="active"
                            defaultChecked={promotion.active}
                            className="h-4 w-4"
                          />

                          <span className="font-medium">
                            Active promotion
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="rounded-lg bg-brand px-5 py-2.5 font-medium !text-white shadow-sm transition hover:bg-brand-hover hover:shadow-md"
                        >
                          Save Changes
                        </button>
                      </div>
                    </fieldset>
                  </form>

                  <form
                    action={deleteAction}
                    className="mt-5 border-t pt-5"
                  >
                    <button
                      type="submit"
                      disabled={archived}
                      className="text-sm font-medium text-red-600 hover:underline disabled:text-gray-400"
                    >
                      Delete Promotion
                    </button>
                  </form>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}