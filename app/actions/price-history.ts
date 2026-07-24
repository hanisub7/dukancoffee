"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../lib/prisma";

function requiredString(
  formData: FormData,
  fieldName: string,
): string {
  const value = String(formData.get(fieldName) ?? "").trim();

  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
}

function optionalString(
  formData: FormData,
  fieldName: string,
): string | null {
  const value = String(formData.get(fieldName) ?? "").trim();

  return value || null;
}

function parseRequiredPrice(
  formData: FormData,
  fieldName: string,
): string {
  const value = requiredString(formData, fieldName);
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(
      `${fieldName} must be a valid non-negative number.`,
    );
  }

  return value;
}

function parseOptionalPrice(
  formData: FormData,
  fieldName: string,
): string | null {
  const value = optionalString(formData, fieldName);

  if (value === null) {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(
      `${fieldName} must be a valid non-negative number.`,
    );
  }

  return value;
}

function parseCheckedAt(formData: FormData): Date {
  const value = String(
    formData.get("checkedAt") ?? "",
  ).trim();

  if (!value) {
    return new Date();
  }

  const checkedAt = new Date(value);

  if (Number.isNaN(checkedAt.getTime())) {
    throw new Error("Checked date is invalid.");
  }

  return checkedAt;
}

function calculateDiscountPercent(
  price: number,
  originalPrice: number | null,
): number | null {
  if (
    originalPrice === null ||
    originalPrice <= 0 ||
    price >= originalPrice
  ) {
    return null;
  }

  return Math.round(
    ((originalPrice - price) / originalPrice) * 100,
  );
}

function readPriceHistoryFormData(formData: FormData) {
  const priceValue = parseRequiredPrice(
    formData,
    "price",
  );

  const originalPriceValue = parseOptionalPrice(
    formData,
    "originalPrice",
  );

  const price = Number(priceValue);

  const originalPrice =
    originalPriceValue === null
      ? null
      : Number(originalPriceValue);

  if (
    originalPrice !== null &&
    originalPrice < price
  ) {
    throw new Error(
      "Original price cannot be lower than the current price.",
    );
  }

  return {
    priceValue,
    originalPriceValue,
    discountPercent: calculateDiscountPercent(
      price,
      originalPrice,
    ),
    inStock: formData.get("inStock") === "true",
    checkedAt: parseCheckedAt(formData),
  };
}

async function getEditableOffer(
  productId: string,
  offerId: string,
) {
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
      product: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!offer) {
    throw new Error("Offer not found.");
  }

  if (offer.product.status === "ARCHIVED") {
    throw new Error(
      "Archived products cannot be modified.",
    );
  }

  return offer;
}

function revalidatePriceHistoryPages(
  productId: string,
  offerId: string,
) {
  revalidatePath("/admin");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(
    `/admin/products/${productId}/offers`,
  );
  revalidatePath(
    `/admin/products/${productId}/offers/${offerId}/history`,
  );
}

export async function createPriceHistory(
  productId: string,
  offerId: string,
  formData: FormData,
): Promise<never> {
  const offer = await getEditableOffer(
    productId,
    offerId,
  );

  const values = readPriceHistoryFormData(formData);

  await prisma.priceHistory.create({
    data: {
      offerId: offer.id,
      price: values.priceValue,
      originalPrice: values.originalPriceValue,
      discountPercent: values.discountPercent,
      inStock: values.inStock,
      checkedAt: values.checkedAt,
    },
  });

  revalidatePriceHistoryPages(
    productId,
    offerId,
  );

  redirect(
    `/admin/products/${productId}/offers/${offerId}/history`,
  );
}

export async function updatePriceHistory(
  productId: string,
  offerId: string,
  priceHistoryId: string,
  formData: FormData,
): Promise<never> {
  const offer = await getEditableOffer(
    productId,
    offerId,
  );

  const existingEntry =
    await prisma.priceHistory.findFirst({
      where: {
        id: priceHistoryId,
        offerId: offer.id,
      },
      select: {
        id: true,
      },
    });

  if (!existingEntry) {
    throw new Error(
      "Price history entry not found.",
    );
  }

  const values = readPriceHistoryFormData(formData);

  await prisma.priceHistory.update({
    where: {
      id: existingEntry.id,
    },
    data: {
      price: values.priceValue,
      originalPrice: values.originalPriceValue,
      discountPercent: values.discountPercent,
      inStock: values.inStock,
      checkedAt: values.checkedAt,
    },
  });

  revalidatePriceHistoryPages(
    productId,
    offerId,
  );

  redirect(
    `/admin/products/${productId}/offers/${offerId}/history`,
  );
}

export async function deletePriceHistory(
  productId: string,
  offerId: string,
  priceHistoryId: string,
  _formData: FormData,
): Promise<never> {
  const offer = await getEditableOffer(
    productId,
    offerId,
  );

  const existingEntry =
    await prisma.priceHistory.findFirst({
      where: {
        id: priceHistoryId,
        offerId: offer.id,
      },
      select: {
        id: true,
      },
    });

  if (!existingEntry) {
    throw new Error(
      "Price history entry not found.",
    );
  }

  await prisma.priceHistory.delete({
    where: {
      id: existingEntry.id,
    },
  });

  revalidatePriceHistoryPages(
    productId,
    offerId,
  );

  redirect(
    `/admin/products/${productId}/offers/${offerId}/history`,
  );
}