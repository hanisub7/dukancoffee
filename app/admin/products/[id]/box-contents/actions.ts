"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/app/lib/prisma";

export async function createBoxContent(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const itemName = String(formData.get("itemName") ?? "").trim();
  const quantityValue = String(formData.get("quantity") ?? "1").trim();

  const quantity = Number.parseInt(quantityValue, 10);

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!itemName) {
    throw new Error("Item name is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  await prisma.boxContent.create({
    data: {
      productId,
      itemName,
      quantity,
    },
  });

  revalidatePath(`/admin/products/${productId}/box-contents`);
  redirect(`/admin/products/${productId}/box-contents`);
}

export async function deleteBoxContent(formData: FormData) {
  const productId = String(formData.get("productId") ?? "").trim();
  const boxContentId = String(formData.get("boxContentId") ?? "").trim();

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!boxContentId) {
    throw new Error("Box content ID is required.");
  }

  await prisma.boxContent.delete({
    where: {
      id: boxContentId,
    },
  });

  revalidatePath(`/admin/products/${productId}/box-contents`);
}