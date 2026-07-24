"use server";

import { ImageType } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function requiredString(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function optionalString(
  formData: FormData,
  name: string,
): string | null {
  const value = String(formData.get(name) ?? "").trim();

  return value || null;
}

function parseSortOrder(formData: FormData): number {
  const value = String(formData.get("sortOrder") ?? "").trim();

  if (!value) {
    return 0;
  }

  const sortOrder = Number(value);

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error(
      "Sort order must be a non-negative whole number.",
    );
  }

  return sortOrder;
}

function parseImageType(formData: FormData): ImageType {
  const value = String(formData.get("imageType") ?? "").trim();

  if (
    !Object.values(ImageType).includes(value as ImageType)
  ) {
    throw new Error("A valid image type is required.");
  }

  return value as ImageType;
}

function validateUrl(value: string, fieldName: string): string {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new Error(
      `${fieldName} must be a valid HTTP or HTTPS URL.`,
    );
  }
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
    throw new Error("Archived products cannot be modified.");
  }

  return product;
}

function revalidateProductImagePaths(productId: string) {
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/images`);
}

export async function createProductImage(
  productId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  const url = validateUrl(
    requiredString(formData, "url"),
    "Image URL",
  );

  const altText = optionalString(formData, "altText");
  const imageType = parseImageType(formData);
  const sortOrder = parseSortOrder(formData);

  const sourceUrlValue = optionalString(formData, "sourceUrl");
  const sourceUrl = sourceUrlValue
    ? validateUrl(sourceUrlValue, "Source URL")
    : null;

  await prisma.$transaction(async (transaction) => {
    if (imageType === ImageType.MAIN) {
      await transaction.productImage.updateMany({
        where: {
          productId,
          imageType: ImageType.MAIN,
        },
        data: {
          imageType: ImageType.FRONT,
        },
      });
    }

    await transaction.productImage.create({
      data: {
        productId,
        url,
        altText,
        imageType,
        sortOrder,
        sourceUrl,
      },
    });
  });

  revalidateProductImagePaths(productId);

  redirect(`/admin/products/${productId}/images`);
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  const existingImage = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
    select: {
      id: true,
    },
  });

  if (!existingImage) {
    throw new Error("Product image not found.");
  }

  const url = validateUrl(
    requiredString(formData, "url"),
    "Image URL",
  );

  const altText = optionalString(formData, "altText");
  const imageType = parseImageType(formData);
  const sortOrder = parseSortOrder(formData);

  const sourceUrlValue = optionalString(formData, "sourceUrl");
  const sourceUrl = sourceUrlValue
    ? validateUrl(sourceUrlValue, "Source URL")
    : null;

  await prisma.$transaction(async (transaction) => {
    if (imageType === ImageType.MAIN) {
      await transaction.productImage.updateMany({
        where: {
          productId,
          imageType: ImageType.MAIN,
          id: {
            not: imageId,
          },
        },
        data: {
          imageType: ImageType.FRONT,
        },
      });
    }

    await transaction.productImage.update({
      where: {
        id: imageId,
      },
      data: {
        url,
        altText,
        imageType,
        sortOrder,
        sourceUrl,
      },
    });
  });

  revalidateProductImagePaths(productId);

  redirect(`/admin/products/${productId}/images`);
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await getEditableProduct(productId);

  const image = await prisma.productImage.findFirst({
    where: {
      id: imageId,
      productId,
    },
    select: {
      id: true,
    },
  });

  if (!image) {
    throw new Error("Product image not found.");
  }

  await prisma.productImage.delete({
    where: {
      id: image.id,
    },
  });

  revalidateProductImagePaths(productId);
}