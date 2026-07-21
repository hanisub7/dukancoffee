"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";

function optionalString(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  return value || null;
}

function optionalInteger(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be a whole number.`);
  }

  return number;
}

function optionalDecimal(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return number;
}

function optionalBoolean(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    return null;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${name} must be true or false.`);
}

export async function saveProductSpecification(
  productId: string,
  formData: FormData
) {
  await prisma.productSpecification.upsert({
    where: {
      productId,
    },
    create: {
      productId,
      machineType: optionalString(formData, "machineType"),
      pumpPressureBar: optionalDecimal(
        formData,
        "pumpPressureBar"
      ),
      waterTankL: optionalDecimal(formData, "waterTankL"),
      beanHopperG: optionalInteger(formData, "beanHopperG"),
      groundsContainerCapacity: optionalInteger(
        formData,
        "groundsContainerCapacity"
      ),
      grinderType: optionalString(formData, "grinderType"),
      grinderMaterial: optionalString(
        formData,
        "grinderMaterial"
      ),
      grindSettings: optionalInteger(formData, "grindSettings"),
      milkSystem: optionalString(formData, "milkSystem"),
      milkContainerCapacityL: optionalDecimal(
        formData,
        "milkContainerCapacityL"
      ),
      displayType: optionalString(formData, "displayType"),
      powerW: optionalInteger(formData, "powerW"),
      voltage: optionalString(formData, "voltage"),
      frequencyHz: optionalInteger(formData, "frequencyHz"),
      widthMm: optionalInteger(formData, "widthMm"),
      heightMm: optionalInteger(formData, "heightMm"),
      depthMm: optionalInteger(formData, "depthMm"),
      weightKg: optionalDecimal(formData, "weightKg"),
      removableWaterTank: optionalBoolean(
        formData,
        "removableWaterTank"
      ),
      removableBrewGroup: optionalBoolean(
        formData,
        "removableBrewGroup"
      ),
      waterFilterCompatible: optionalBoolean(
        formData,
        "waterFilterCompatible"
      ),
    },
    update: {
      machineType: optionalString(formData, "machineType"),
      pumpPressureBar: optionalDecimal(
        formData,
        "pumpPressureBar"
      ),
      waterTankL: optionalDecimal(formData, "waterTankL"),
      beanHopperG: optionalInteger(formData, "beanHopperG"),
      groundsContainerCapacity: optionalInteger(
        formData,
        "groundsContainerCapacity"
      ),
      grinderType: optionalString(formData, "grinderType"),
      grinderMaterial: optionalString(
        formData,
        "grinderMaterial"
      ),
      grindSettings: optionalInteger(formData, "grindSettings"),
      milkSystem: optionalString(formData, "milkSystem"),
      milkContainerCapacityL: optionalDecimal(
        formData,
        "milkContainerCapacityL"
      ),
      displayType: optionalString(formData, "displayType"),
      powerW: optionalInteger(formData, "powerW"),
      voltage: optionalString(formData, "voltage"),
      frequencyHz: optionalInteger(formData, "frequencyHz"),
      widthMm: optionalInteger(formData, "widthMm"),
      heightMm: optionalInteger(formData, "heightMm"),
      depthMm: optionalInteger(formData, "depthMm"),
      weightKg: optionalDecimal(formData, "weightKg"),
      removableWaterTank: optionalBoolean(
        formData,
        "removableWaterTank"
      ),
      removableBrewGroup: optionalBoolean(
        formData,
        "removableBrewGroup"
      ),
      waterFilterCompatible: optionalBoolean(
        formData,
        "waterFilterCompatible"
      ),
    },
  });

  revalidatePath(`/admin/products/${productId}/specifications`);

  redirect(`/admin/products/${productId}/specifications`);
}