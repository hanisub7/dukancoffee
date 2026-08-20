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

export async function createDrink(formData: FormData) {
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

  const existingDrink = await prisma.drink.findUnique({
    where: {
      slug,
    },
  });

  if (existingDrink) {
    throw new Error("A drink with this name already exists.");
  }

  await prisma.drink.create({
    data: {
      nameEn,
      nameAr,
      slug,
      sortOrder,
      active: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/drinks");

  redirect("/admin/drinks");
}

export async function updateDrink(
  drinkId: string,
  formData: FormData,
) {
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const active = formData.get("active") === "on";

  if (!drinkId) {
    throw new Error("Drink ID is required.");
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

  const existingDrink = await prisma.drink.findFirst({
    where: {
      slug,
      id: {
        not: drinkId,
      },
    },
  });

  if (existingDrink) {
    throw new Error("A drink with this name already exists.");
  }

  await prisma.drink.update({
    where: {
      id: drinkId,
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
  revalidatePath("/admin/drinks");
  revalidatePath(`/admin/drinks/${drinkId}/edit`);

  redirect("/admin/drinks");
}

export async function deleteDrink(drinkId: string) {
  if (!drinkId) {
    throw new Error("Drink ID is required.");
  }

  const drink = await prisma.drink.findUnique({
    where: {
      id: drinkId,
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

  if (!drink) {
    throw new Error("Drink not found.");
  }

  if (drink._count.products > 0) {
    throw new Error(
      "This drink cannot be deleted because it is assigned to one or more products.",
    );
  }

  await prisma.drink.delete({
    where: {
      id: drinkId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/drinks");
}