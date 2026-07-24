"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../lib/prisma";

function requiredString(formData: FormData, name: string): string {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getActiveProduct(productId: string) {
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

export async function addExistingFeatureToProduct(
  productId: string,
  formData: FormData,
): Promise<never> {
  await getActiveProduct(productId);

  const featureId = requiredString(formData, "featureId");

  const feature = await prisma.feature.findUnique({
    where: {
      id: featureId,
    },
    select: {
      id: true,
    },
  });

  if (!feature) {
    throw new Error("Feature not found.");
  }

  await prisma.productFeature.upsert({
    where: {
      productId_featureId: {
        productId,
        featureId,
      },
    },
    create: {
      productId,
      featureId,
    },
    update: {},
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/features`);

  redirect(`/admin/products/${productId}/features`);
}

export async function createAndAddFeatureToProduct(
  productId: string,
  formData: FormData,
): Promise<never> {
  await getActiveProduct(productId);

  const name = requiredString(formData, "name");
  const description =
    String(formData.get("description") ?? "").trim() || null;

  const requestedSlug = String(formData.get("slug") ?? "").trim();
  const slug = createSlug(requestedSlug || name);

  if (!slug) {
    throw new Error("A valid feature slug is required.");
  }

  const existingFeature = await prisma.feature.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  const feature = existingFeature
    ? existingFeature
    : await prisma.feature.create({
        data: {
          name,
          slug,
          description,
        },
        select: {
          id: true,
        },
      });

  await prisma.productFeature.upsert({
    where: {
      productId_featureId: {
        productId,
        featureId: feature.id,
      },
    },
    create: {
      productId,
      featureId: feature.id,
    },
    update: {},
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/features`);

  redirect(`/admin/products/${productId}/features`);
}

export async function removeFeatureFromProduct(
  productId: string,
  featureId: string,
): Promise<never> {
  await getActiveProduct(productId);

  await prisma.productFeature.deleteMany({
    where: {
      productId,
      featureId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/features`);

  redirect(`/admin/products/${productId}/features`);
}