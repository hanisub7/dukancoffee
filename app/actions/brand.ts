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

export async function createBrand(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name) {
    throw new Error("Brand name is required.");
  }

  const slug = createSlug(name);

  const existingBrand = await prisma.brand.findUnique({
    where: {
      slug,
    },
  });

  if (existingBrand) {
    throw new Error("A brand with this name already exists.");
  }

  await prisma.brand.create({
    data: {
      name,
      slug,
      officialWebsiteUrl: website || null,
      active: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products/new");

  redirect("/admin/brands");
}

export async function updateBrand(brandId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!brandId) {
    throw new Error("Brand ID is required.");
  }

  if (!name) {
    throw new Error("Brand name is required.");
  }

  const slug = createSlug(name);

  const existingBrand = await prisma.brand.findFirst({
    where: {
      slug,
      id: {
        not: brandId,
      },
    },
  });

  if (existingBrand) {
    throw new Error("A brand with this name already exists.");
  }

  await prisma.brand.update({
    where: {
      id: brandId,
    },
    data: {
      name,
      slug,
      officialWebsiteUrl: website || null,
      active,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products/new");
  revalidatePath(`/admin/brands/${brandId}/edit`);

  redirect("/admin/brands");
}