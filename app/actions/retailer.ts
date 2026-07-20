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

export async function createRetailer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const countryId = String(formData.get("countryId") ?? "").trim();

  if (!name) throw new Error("Retailer name is required.");
  if (!websiteUrl) throw new Error("Website URL is required.");
  if (!countryId) throw new Error("Country is required.");

  const slug = createSlug(name);

  const existingRetailer = await prisma.retailer.findFirst({
    where: {
      countryId,
      slug,
    },
  });

  if (existingRetailer) {
    throw new Error("This retailer already exists for the selected country.");
  }

  await prisma.retailer.create({
    data: {
      name,
      slug,
      websiteUrl,
      countryId,
      active: true,
    },
  });

  revalidatePath("/admin/retailers");
  redirect("/admin/retailers");
}

export async function updateRetailer(
  id: string,
  formData: FormData
) {
  const name = String(formData.get("name") ?? "").trim();
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
  const countryId = String(formData.get("countryId") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!name) throw new Error("Retailer name is required.");
  if (!websiteUrl) throw new Error("Website URL is required.");
  if (!countryId) throw new Error("Country is required.");

  const slug = createSlug(name);

  await prisma.retailer.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      websiteUrl,
      countryId,
      active,
    },
  });

  revalidatePath("/admin/retailers");
  redirect("/admin/retailers");
}