"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { ImageType } from "../generated/prisma/client";

export async function createProductImage(
  productId: string,
  formData: FormData
) {
  const url = String(formData.get("url") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const imageTypeValue = String(
    formData.get("imageType") ?? ""
  ).trim();
  const sortOrderValue = String(
    formData.get("sortOrder") ?? ""
  ).trim();
  const sourceUrl = String(
    formData.get("sourceUrl") ?? ""
  ).trim();

  if (!url) {
    throw new Error("Image URL is required.");
  }

  const sortOrder = Number(sortOrderValue || 0);

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error(
      "Sort order must be a positive whole number."
    );
  }

  let imageType: ImageType = ImageType.FRONT;

  if (imageTypeValue === "MAIN") {
    imageType = ImageType.MAIN;
  } else if (imageTypeValue === "SIDE") {
    imageType = ImageType.SIDE;
  } else if (imageTypeValue === "BACK") {
    imageType = ImageType.BACK;
  } else if (imageTypeValue === "LIFESTYLE") {
    imageType = ImageType.LIFESTYLE;
  } else if (imageTypeValue === "PACKAGE") {
    imageType = ImageType.PACKAGE;
  }

  await prisma.productImage.create({
    data: {
      productId,
      url,
      altText: altText || null,
      imageType,
      sortOrder,
      sourceUrl: sourceUrl || null,
    },
  });

  revalidatePath(`/admin/products/${productId}/images`);

  redirect(`/admin/products/${productId}/images`);
}

export async function deleteProductImage(
  productId: string,
  imageId: string
) {
  await prisma.productImage.delete({
    where: {
      id: imageId,
    },
  });

  revalidatePath(`/admin/products/${productId}/images`);
}