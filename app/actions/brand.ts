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

export async function createBrand(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (!name) {
    throw new Error("Brand name is required.");
  }

  const slug = createSlug(name);

  const existing = await prisma.brand.findUnique({
    where: {
      slug,
    },
  });

  if (existing) {
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

  revalidatePath("/admin/brands");
  revalidatePath("/admin/products/new");

  redirect("/admin/brands");
}