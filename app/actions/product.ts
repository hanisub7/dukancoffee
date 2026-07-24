"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../lib/prisma";

const allowedStatuses = [
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;

type ProductStatusValue = (typeof allowedStatuses)[number];

function getRequiredString(
  formData: FormData,
  field: string,
): string {
  return String(formData.get(field) ?? "").trim();
}

function getOptionalString(
  formData: FormData,
  field: string,
): string | null {
  const value = String(formData.get(field) ?? "").trim();

  return value || null;
}

function getOptionalInteger(
  formData: FormData,
  field: string,
): number | null {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue)) {
    throw new Error(`${field} must be a whole number.`);
  }

  return parsedValue;
}

function createSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "product";
}

function parseStatus(value: string): ProductStatusValue {
  if (allowedStatuses.includes(value as ProductStatusValue)) {
    return value as ProductStatusValue;
  }

  return "DRAFT";
}

async function validateProductRelations(input: {
  brandId: string;
  categoryId: string;
  productFamilyId: string | null;
}): Promise<void> {
  const [brand, category, productFamily] = await Promise.all([
    prisma.brand.findFirst({
      where: {
        id: input.brandId,
        active: true,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    }),

    prisma.category.findFirst({
      where: {
        id: input.categoryId,
        active: true,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    }),

    input.productFamilyId
      ? prisma.productFamily.findFirst({
          where: {
            id: input.productFamilyId,
            deletedAt: null,
          },
          select: {
            id: true,
            brandId: true,
            categoryId: true,
          },
        })
      : Promise.resolve(null),
  ]);

  if (!brand) {
    throw new Error(
      "The selected brand does not exist or is inactive.",
    );
  }

  if (!category) {
    throw new Error(
      "The selected category does not exist or is inactive.",
    );
  }

  if (input.productFamilyId && !productFamily) {
    throw new Error(
      "The selected product family does not exist.",
    );
  }

  if (
    productFamily &&
    productFamily.brandId !== input.brandId
  ) {
    throw new Error(
      "The product brand must match the product family brand.",
    );
  }

  if (
    productFamily &&
    productFamily.categoryId !== input.categoryId
  ) {
    throw new Error(
      "The product category must match the product family category.",
    );
  }
}

async function validateUniqueModelNumber(input: {
  brandId: string;
  modelNumber: string | null;
  excludedProductId?: string;
}): Promise<void> {
  if (!input.modelNumber) {
    return;
  }

  const duplicateProduct = await prisma.product.findFirst({
    where: {
      brandId: input.brandId,
      modelNumber: input.modelNumber,
      id: input.excludedProductId
        ? {
            not: input.excludedProductId,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  });

  if (duplicateProduct) {
    throw new Error(
      "A product with this model number already exists for the selected brand.",
    );
  }
}

export async function createProduct(
  formData: FormData,
): Promise<never> {
  const fullName = getRequiredString(
    formData,
    "fullName",
  );

  const model = getRequiredString(
    formData,
    "model",
  );

  const brandId = getRequiredString(
    formData,
    "brandId",
  );

  const categoryId = getRequiredString(
    formData,
    "categoryId",
  );

  const modelNumber = getOptionalString(
    formData,
    "modelNumber",
  );

  const selectedProductFamilyId = getOptionalString(
    formData,
    "productFamilyId",
  );

  const releaseYear = getOptionalInteger(
    formData,
    "releaseYear",
  );

  const officialProductUrl = getOptionalString(
    formData,
    "officialProductUrl",
  );

  const manualUrl = getOptionalString(
    formData,
    "manualUrl",
  );

  const warrantyUrl = getOptionalString(
    formData,
    "warrantyUrl",
  );

  if (!fullName || !model || !brandId || !categoryId) {
    throw new Error(
      "Please complete all required product fields.",
    );
  }

  if (
    releaseYear !== null &&
    (releaseYear < 1900 ||
      releaseYear > new Date().getFullYear() + 1)
  ) {
    throw new Error("Please enter a valid release year.");
  }

  await validateProductRelations({
    brandId,
    categoryId,
    productFamilyId: selectedProductFamilyId,
  });

  await validateUniqueModelNumber({
    brandId,
    modelNumber,
  });

  const productId = randomUUID();

  const productSlugBase = createSlug(
    `${fullName}-${modelNumber || model}`,
  );

  const productSlug = `${productSlugBase}-${productId.slice(
    0,
    8,
  )}`;

  await prisma.$transaction(async (tx) => {
    let productFamilyId = selectedProductFamilyId;

    if (!productFamilyId) {
      const productFamilyRecordId = randomUUID();

      const familySlugBase = createSlug(model);

      const familySlug = `${familySlugBase}-${productFamilyRecordId.slice(
        0,
        8,
      )}`;

      const productFamily = await tx.productFamily.create({
        data: {
          id: productFamilyRecordId,
          brandId,
          categoryId,
          name: model,
          slug: familySlug,
          description: null,
          status: "DRAFT",
        },
        select: {
          id: true,
        },
      });

      productFamilyId = productFamily.id;
    }

    await tx.product.create({
      data: {
        id: productId,
        productFamilyId,
        fullName,
        model,
        modelNumber,
        releaseYear,
        slug: productSlug,
        brandId,
        categoryId,
        officialProductUrl,
        manualUrl,
        warrantyUrl,
        status: "DRAFT",
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<never> {
  const fullName = getRequiredString(
    formData,
    "fullName",
  );

  const model = getRequiredString(
    formData,
    "model",
  );

  const brandId = getRequiredString(
    formData,
    "brandId",
  );

  const categoryId = getRequiredString(
    formData,
    "categoryId",
  );

  const modelNumber = getOptionalString(
    formData,
    "modelNumber",
  );

  const productFamilyId = getOptionalString(
    formData,
    "productFamilyId",
  );

  const releaseYear = getOptionalInteger(
    formData,
    "releaseYear",
  );

  const officialProductUrl = getOptionalString(
    formData,
    "officialProductUrl",
  );

  const manualUrl = getOptionalString(
    formData,
    "manualUrl",
  );

  const warrantyUrl = getOptionalString(
    formData,
    "warrantyUrl",
  );

  const status = parseStatus(
    getRequiredString(formData, "status"),
  );

  if (!id) {
    throw new Error("Product ID is required.");
  }

  if (!fullName || !model || !brandId || !categoryId) {
    throw new Error(
      "Please complete all required product fields.",
    );
  }

  if (
    releaseYear !== null &&
    (releaseYear < 1900 ||
      releaseYear > new Date().getFullYear() + 1)
  ) {
    throw new Error("Please enter a valid release year.");
  }

  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  if (!productFamilyId) {
    throw new Error(
      "A product family is required for every product.",
    );
  }

  await validateProductRelations({
    brandId,
    categoryId,
    productFamilyId,
  });

  await validateUniqueModelNumber({
    brandId,
    modelNumber,
    excludedProductId: id,
  });

  const slugBase = createSlug(
    `${fullName}-${modelNumber || model}`,
  );

  const slug = `${slugBase}-${id.slice(0, 8)}`;

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      fullName,
      model,
      modelNumber,
      releaseYear,
      slug,
      brandId,
      categoryId,
      productFamilyId,
      officialProductUrl,
      manualUrl,
      warrantyUrl,
      status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/admin/products/${id}/edit`);

  redirect("/admin/products");
}