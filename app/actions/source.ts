"use server";

import { SourceType } from "../generated/prisma/client";
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

function validateUrl(
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

function parseSourceType(
  formData: FormData,
): SourceType {
  const value = String(
    formData.get("sourceType") ?? "",
  ).trim();

  if (
    !Object.values(SourceType).includes(
      value as SourceType,
    )
  ) {
    throw new Error(
      "A valid source type is required.",
    );
  }

  return value as SourceType;
}

function parseVerifiedAt(
  formData: FormData,
): Date | null {
  const value = String(
    formData.get("verifiedAt") ?? "",
  ).trim();

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid verification date.");
  }

  return date;
}

async function getEditableProduct(
  productId: string,
) {
  const product =
    await prisma.product.findFirst({
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

function revalidateSourcePaths(
  productId: string,
) {
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/admin/products/${productId}/sources`);
}

export async function createSource(
  productId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  await prisma.source.create({
    data: {
      productId,
      sourceType: parseSourceType(formData),
      sourceUrl: validateUrl(
        requiredString(formData, "sourceUrl"),
        "Source URL",
      ),
      informationCovered: optionalString(
        formData,
        "informationCovered",
      ),
      verifiedAt: parseVerifiedAt(formData),
      notes: optionalString(formData, "notes"),
    },
  });

  revalidateSourcePaths(productId);

  redirect(`/admin/products/${productId}/sources`);
}

export async function updateSource(
  productId: string,
  sourceId: string,
  formData: FormData,
): Promise<never> {
  await getEditableProduct(productId);

  const source =
    await prisma.source.findFirst({
      where: {
        id: sourceId,
        productId,
      },
      select: {
        id: true,
      },
    });

  if (!source) {
    throw new Error("Source not found.");
  }

  await prisma.source.update({
    where: {
      id: source.id,
    },
    data: {
      sourceType: parseSourceType(formData),
      sourceUrl: validateUrl(
        requiredString(formData, "sourceUrl"),
        "Source URL",
      ),
      informationCovered: optionalString(
        formData,
        "informationCovered",
      ),
      verifiedAt: parseVerifiedAt(formData),
      notes: optionalString(formData, "notes"),
    },
  });

  revalidateSourcePaths(productId);

  redirect(`/admin/products/${productId}/sources`);
}

export async function deleteSource(
  productId: string,
  sourceId: string,
): Promise<void> {
  await getEditableProduct(productId);

  const source =
    await prisma.source.findFirst({
      where: {
        id: sourceId,
        productId,
      },
      select: {
        id: true,
      },
    });

  if (!source) {
    throw new Error("Source not found.");
  }

  await prisma.source.delete({
    where: {
      id: source.id,
    },
  });

  revalidateSourcePaths(productId);
}