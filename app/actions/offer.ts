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
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
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

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(
      `${fieldName} must be a valid non-negative number.`,
    );
  }

  return value;
}

function validateHttpUrl(
  value: string,
  fieldName: string,
): string {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new Error(
      `${fieldName} must be a valid HTTP or HTTPS URL.`,
    );
  }
}

function validateOptionalHttpUrl(
  value: string | null,
  fieldName: string,
): string | null {
  if (!value) {
    return null;
  }

  return validateHttpUrl(value, fieldName);
}

function calculateDiscountPercent(
  currentPrice: number,
  originalPrice: number | null,
): number | null {
  if (
    originalPrice === null ||
    originalPrice <= 0 ||
    currentPrice >= originalPrice
  ) {
    return null;
  }

  return Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100,
  );
}

function readOfferFormData(formData: FormData) {
  const retailerId = requiredString(
    formData,
    "retailerId",
  );

  const productUrl = validateHttpUrl(
    requiredString(formData, "productUrl"),
    "Product URL",
  );

  const affiliateUrl = validateOptionalHttpUrl(
    optionalString(formData, "affiliateUrl"),
    "Affiliate URL",
  );

  const currencyCode = requiredString(
    formData,
    "currencyCode",
  ).toUpperCase();

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    throw new Error(
      "Currency code must contain exactly three letters.",
    );
  }

  const currentPriceValue = parseRequiredPrice(
    formData,
    "currentPrice",
  );

  const originalPriceValue = parseOptionalPrice(
    formData,
    "originalPrice",
  );

  const currentPrice = Number(currentPriceValue);

  const originalPrice =
    originalPriceValue === null
      ? null
      : Number(originalPriceValue);

  if (
    originalPrice !== null &&
    originalPrice < currentPrice
  ) {
    throw new Error(
      "Original price cannot be lower than the current price.",
    );
  }

  return {
    retailerId,
    productUrl,
    affiliateUrl,
    currencyCode,
    currentPriceValue,
    originalPriceValue,
    discountPercent: calculateDiscountPercent(
      currentPrice,
      originalPrice,
    ),
    inStock: formData.get("inStock") === "true",
  };
}

async function getEditableProduct(productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      deletedAt: null,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status === "ARCHIVED") {
    throw new Error(
      "Archived products cannot be modified.",
    );
  }

  return product;
}

async function validateRetailer(retailerId: string) {
  const retailer = await prisma.retailer.findUnique({
    where: {
      id: retailerId,
    },
    select: {
      id: true,
      active: true,
    },
  });

  if (!retailer) {
    throw new Error("Retailer not found.");
  }

  return retailer;
}

function revalidateOfferPages(productId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/offers`);
}

export async function createOffer(
  formData: FormData,
): Promise<never> {
  const productId = requiredString(
    formData,
    "productId",
  );

  await getEditableProduct(productId);

  const values = readOfferFormData(formData);
  const retailer = await validateRetailer(
    values.retailerId,
  );

  if (!retailer.active) {
    throw new Error(
      "An offer cannot be added for an inactive retailer.",
    );
  }

  const existingOffer = await prisma.offer.findUnique({
    where: {
      productId_retailerId: {
        productId,
        retailerId: values.retailerId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingOffer) {
    throw new Error(
      "This retailer already has an offer for this product.",
    );
  }

  await prisma.offer.create({
    data: {
      productId,
      retailerId: values.retailerId,
      productUrl: values.productUrl,
      affiliateUrl: values.affiliateUrl,
      currencyCode: values.currencyCode,
      currentPrice: values.currentPriceValue,
      originalPrice: values.originalPriceValue,
      discountPercent: values.discountPercent,
      inStock: values.inStock,
      checkedAt: new Date(),
    },
  });

  revalidateOfferPages(productId);

  redirect(`/admin/products/${productId}/offers`);
}

export async function updateOffer(
  offerId: string,
  productId: string,
  formData: FormData,
): Promise<never> {
  if (!offerId) {
    throw new Error("Offer ID is required.");
  }

  await getEditableProduct(productId);

  const existingOffer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId,
    },
    select: {
      id: true,
      retailerId: true,
    },
  });

  if (!existingOffer) {
    throw new Error("Offer not found.");
  }

  const values = readOfferFormData(formData);
  const retailer = await validateRetailer(
    values.retailerId,
  );

  if (
    !retailer.active &&
    values.retailerId !== existingOffer.retailerId
  ) {
    throw new Error(
      "The selected retailer is inactive.",
    );
  }

  const duplicateOffer = await prisma.offer.findFirst({
    where: {
      productId,
      retailerId: values.retailerId,
      id: {
        not: offerId,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateOffer) {
    throw new Error(
      "This retailer already has another offer for this product.",
    );
  }

  await prisma.offer.update({
    where: {
      id: existingOffer.id,
    },
    data: {
      retailerId: values.retailerId,
      productUrl: values.productUrl,
      affiliateUrl: values.affiliateUrl,
      currencyCode: values.currencyCode,
      currentPrice: values.currentPriceValue,
      originalPrice: values.originalPriceValue,
      discountPercent: values.discountPercent,
      inStock: values.inStock,
      checkedAt: new Date(),
    },
  });

  revalidateOfferPages(productId);

  redirect(`/admin/products/${productId}/offers`);
}

export async function deleteOffer(
  productId: string,
  offerId: string,
  _formData: FormData,
): Promise<never> {
  if (!offerId) {
    throw new Error("Offer ID is required.");
  }

  await getEditableProduct(productId);

  const existingOffer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId,
    },
    select: {
      id: true,
    },
  });

  if (!existingOffer) {
    throw new Error("Offer not found.");
  }

  await prisma.offer.delete({
    where: {
      id: existingOffer.id,
    },
  });

  revalidateOfferPages(productId);

  redirect(`/admin/products/${productId}/offers`);
}