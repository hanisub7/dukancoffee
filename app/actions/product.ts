"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const modelNumber = String(formData.get("modelNumber") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!fullName || !model || !brandId || !categoryId) {
    throw new Error("Please complete all required product fields.");
  }

  const baseSlug = createSlug(`${fullName}-${modelNumber || model}`);
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  await prisma.product.create({
    data: {
      fullName,
      model,
      modelNumber: modelNumber || null,
      slug: uniqueSlug,
      brandId,
      categoryId,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  formData: FormData
) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const modelNumber = String(formData.get("modelNumber") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!fullName || !model || !brandId || !categoryId || !status) {
    throw new Error("Please complete all required product fields.");
  }

  const slug = createSlug(`${fullName}-${modelNumber || model}-${id}`);

  await prisma.product.update({
    where: {
      id,
    },
    data: {
      fullName,
      model,
      modelNumber: modelNumber || null,
      slug,
      brandId,
      categoryId,
      status:
        status === "PUBLISHED" ||
        status === "ARCHIVED" ||
        status === "DRAFT"
          ? status
          : "DRAFT",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);

  redirect("/admin/products");
}