"use server";

import { PromotionType } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function parsePromotionType(
  formData: FormData,
): PromotionType {
  const value = String(
    formData.get("promotionType") ?? "",
  ).trim();

  if (
    !Object.values(PromotionType).includes(
      value as PromotionType,
    )
  ) {
    throw new Error(
      "A valid promotion type is required.",
    );
  }

  return value as PromotionType;
}

function parseOptionalInteger(
  formData: FormData,
  fieldName: string,
  options?: {
    minimum?: number;
    maximum?: number;
  },
): number | null {
  const rawValue = String(
    formData.get(fieldName) ?? "",
  ).trim();

  if (!rawValue) {
    return null;
  }

  const value = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(value)) {
    throw new Error(
      `${fieldName} must be a whole number.`,
    );
  }

  if (
    options?.minimum !== undefined &&
    value < options.minimum
  ) {
    throw new Error(
      `${fieldName} must be at least ${options.minimum}.`,
    );
  }

  if (
    options?.maximum !== undefined &&
    value > options.maximum
  ) {
    throw new Error(
      `${fieldName} must not exceed ${options.maximum}.`,
    );
  }

  return value;
}

function parseOptionalDecimal(
  formData: FormData,
  fieldName: string,
): number | null {
  const rawValue = String(
    formData.get(fieldName) ?? "",
  ).trim();

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new Error(
      `${fieldName} must be a valid number.`,
    );
  }

  if (value < 0) {
    throw new Error(
      `${fieldName} cannot be negative.`,
    );
  }

  return value;
}

function parseOptionalDate(
  formData: FormData,
  fieldName: string,
): Date | null {
  const rawValue = String(
    formData.get(fieldName) ?? "",
  ).trim();

  if (!rawValue) {
    return null;
  }

  const value = new Date(rawValue);

  if (Number.isNaN(value.getTime())) {
    throw new Error(
      `${fieldName} must be a valid date.`,
    );
  }

  return value;
}

function parseBoolean(
  formData: FormData,
  fieldName: string,
): boolean {
  return formData.get(fieldName) === "on";
}

function validatePromotionDates(
  startsAt: Date | null,
  endsAt: Date | null,
): void {
  if (
    startsAt &&
    endsAt &&
    endsAt.getTime() < startsAt.getTime()
  ) {
    throw new Error(
      "The promotion end date cannot be before the start date.",
    );
  }
}

function validatePromotionValues(values: {
  discountPercent: number | null;
  discountAmount: number | null;
  cashbackPercent: number | null;
  cashbackAmount: number | null;
  installmentMonths: number | null;
}): void {
  if (
    values.discountPercent !== null &&
    values.discountPercent > 100
  ) {
    throw new Error(
      "Discount percent cannot exceed 100.",
    );
  }

  if (
    values.cashbackPercent !== null &&
    values.cashbackPercent > 100
  ) {
    throw new Error(
      "Cashback percent cannot exceed 100.",
    );
  }

  if (
    values.installmentMonths !== null &&
    values.installmentMonths < 1
  ) {
    throw new Error(
      "Installment months must be at least 1.",
    );
  }
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

function getPromotionData(formData: FormData) {
  const startsAt = parseOptionalDate(
    formData,
    "startsAt",
  );

  const endsAt = parseOptionalDate(
    formData,
    "endsAt",
  );

  const discountPercent = parseOptionalInteger(
    formData,
    "discountPercent",
    {
      minimum: 0,
      maximum: 100,
    },
  );

  const discountAmount = parseOptionalDecimal(
    formData,
    "discountAmount",
  );

  const cashbackPercent = parseOptionalInteger(
    formData,
    "cashbackPercent",
    {
      minimum: 0,
      maximum: 100,
    },
  );

  const cashbackAmount = parseOptionalDecimal(
    formData,
    "cashbackAmount",
  );

  const installmentMonths = parseOptionalInteger(
    formData,
    "installmentMonths",
    {
      minimum: 1,
      maximum: 120,
    },
  );

  validatePromotionDates(startsAt, endsAt);

  validatePromotionValues({
    discountPercent,
    discountAmount,
    cashbackPercent,
    cashbackAmount,
    installmentMonths,
  });

  return {
    promotionType: parsePromotionType(formData),
    title: requiredString(formData, "title"),
    description: optionalString(
      formData,
      "description",
    ),
    couponCode: optionalString(
      formData,
      "couponCode",
    ),
    discountPercent,
    discountAmount,
    cashbackPercent,
    cashbackAmount,
    bankName: optionalString(
      formData,
      "bankName",
    ),
    minimumSpend: parseOptionalDecimal(
      formData,
      "minimumSpend",
    ),
    installmentMonths,
    freeGiftDescription: optionalString(
      formData,
      "freeGiftDescription",
    ),
    terms: optionalString(formData, "terms"),
    startsAt,
    endsAt,
    active: parseBoolean(formData, "active"),
  };
}

function revalidatePromotionPaths(
  productId: string,
  offerId: string,
): void {
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(
    `/admin/products/${productId}/offers`,
  );
  revalidatePath(
    `/admin/products/${productId}/offers/${offerId}/promotions`,
  );
}

export async function createPromotion(
  productId: string,
  offerId: string,
  formData: FormData,
): Promise<never> {
  await getEditableOffer(productId, offerId);

  await prisma.promotion.create({
    data: {
      offerId,
      ...getPromotionData(formData),
    },
  });

  revalidatePromotionPaths(productId, offerId);

  redirect(
    `/admin/products/${productId}/offers/${offerId}/promotions`,
  );
}

export async function updatePromotion(
  productId: string,
  offerId: string,
  promotionId: string,
  formData: FormData,
): Promise<never> {
  await getEditableOffer(productId, offerId);

  const promotion = await prisma.promotion.findFirst({
    where: {
      id: promotionId,
      offerId,
      offer: {
        productId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!promotion) {
    throw new Error("Promotion not found.");
  }

  await prisma.promotion.update({
    where: {
      id: promotion.id,
    },
    data: getPromotionData(formData),
  });

  revalidatePromotionPaths(productId, offerId);

  redirect(
    `/admin/products/${productId}/offers/${offerId}/promotions`,
  );
}

export async function deletePromotion(
  productId: string,
  offerId: string,
  promotionId: string,
): Promise<void> {
  await getEditableOffer(productId, offerId);

  const promotion = await prisma.promotion.findFirst({
    where: {
      id: promotionId,
      offerId,
      offer: {
        productId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!promotion) {
    throw new Error("Promotion not found.");
  }

  await prisma.promotion.delete({
    where: {
      id: promotion.id,
    },
  });

  revalidatePromotionPaths(productId, offerId);
}