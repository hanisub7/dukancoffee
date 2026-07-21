"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

function requiredString(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

function optionalString(formData: FormData, fieldName: string) {
  const value = String(formData.get(fieldName) ?? "").trim();

  return value || null;
}

function requiredDecimal(formData: FormData, fieldName: string) {
  const value = String(formData.get(fieldName) ?? "").trim();

  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(
      `${fieldName} must be a valid positive number.`
    );
  }

  return value;
}

function optionalDecimal(formData: FormData, fieldName: string) {
  const value = String(formData.get(fieldName) ?? "").trim();

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(
      `${fieldName} must be a valid positive number.`
    );
  }

  return value;
}

function calculateDiscountPercent(
  currentPrice: number,
  originalPrice: number | null
) {
  if (
    originalPrice === null ||
    originalPrice <= 0 ||
    currentPrice >= originalPrice
  ) {
    return null;
  }

  return Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
}

function readOfferFormData(formData: FormData) {
  const retailerId = requiredString(formData, "retailerId");
  const productUrl = requiredString(formData, "productUrl");
  const affiliateUrl = optionalString(
    formData,
    "affiliateUrl"
  );

  const currencyCode = requiredString(
    formData,
    "currencyCode"
  ).toUpperCase();

  const currentPriceValue = requiredDecimal(
    formData,
    "currentPrice"
  );

  const originalPriceValue = optionalDecimal(
    formData,
    "originalPrice"
  );

  const inStock = formData.get("inStock") === "true";

  if (!retailerId || !productUrl || !currencyCode) {
    throw new Error(
      "Please complete all required offer fields."
    );
  }

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    throw new Error(
      "Currency code must contain exactly three letters."
    );
  }

  try {
    new URL(productUrl);
  } catch {
    throw new Error("Product URL must be a valid URL.");
  }

  if (affiliateUrl) {
    try {
      new URL(affiliateUrl);
    } catch {
      throw new Error("Affiliate URL must be a valid URL.");
    }
  }

  const currentPrice = Number(currentPriceValue);

  const originalPrice =
    originalPriceValue === null
      ? null
      : Number(originalPriceValue);

  const discountPercent = calculateDiscountPercent(
    currentPrice,
    originalPrice
  );

  return {
    retailerId,
    productUrl,
    affiliateUrl,
    currencyCode,
    currentPriceValue,
    originalPriceValue,
    discountPercent,
    inStock,
  };
}

function revalidateOfferPages(productId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/offers`);
}

export async function createOffer(formData: FormData) {
  const productId = requiredString(formData, "productId");

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const values = readOfferFormData(formData);

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
      "This retailer already has an offer for this product."
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
  formData: FormData
) {
  if (!offerId || !productId) {
    throw new Error(
      "Offer and product IDs are required."
    );
  }

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

  const values = readOfferFormData(formData);

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
      "This retailer already has another offer for this product."
    );
  }

  await prisma.offer.update({
    where: {
      id: offerId,
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
  _formData: FormData
) {
  if (!productId || !offerId) {
    throw new Error(
      "Offer and product IDs are required."
    );
  }

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
      id: offerId,
    },
  });

  revalidateOfferPages(productId);

  redirect(`/admin/products/${productId}/offers`);
}