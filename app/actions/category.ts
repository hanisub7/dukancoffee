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

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");

  redirect("/admin/categories");
}