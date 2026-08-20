"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "../lib/prisma";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategory(formData: FormData) {
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!nameEn) {
    throw new Error("English name is required.");
  }

  if (!nameAr) {
    throw new Error("Arabic name is required.");
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a valid non-negative number.");
  }

  const slug = createSlug(nameEn);

  const existing = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (existing) {
    throw new Error("A category with this name already exists.");
  }

  await prisma.category.create({
    data: {
      nameEn,
      nameAr,
      slug,
      sortOrder,
      active: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  revalidatePath("/categories");

  redirect("/admin/categories");
}

export async function updateCategory(
  categoryId: string,
  formData: FormData,
) {
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const active = formData.get("active") === "on";

  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  if (!nameEn) {
    throw new Error("English name is required.");
  }

  if (!nameAr) {
    throw new Error("Arabic name is required.");
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a valid non-negative number.");
  }

  const slug = createSlug(nameEn);

  const existing = await prisma.category.findFirst({
    where: {
      slug,
      id: {
        not: categoryId,
      },
    },
  });

  if (existing) {
    throw new Error("A category with this name already exists.");
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      nameEn,
      nameAr,
      slug,
      sortOrder,
      active,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidatePath("/categories");
  revalidatePath(`/admin/categories/${categoryId}/edit`);

  redirect("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  if (!categoryId) {
    throw new Error("Category ID is required.");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (category._count.products > 0) {
    throw new Error(
      "This category cannot be deleted because it is assigned to one or more products.",
    );
  }

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidatePath("/categories");
}