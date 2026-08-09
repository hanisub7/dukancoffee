import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogSpecifications } from "./catalog/specifications";

export async function seedSpecifications(
  prisma: PrismaClient,
): Promise<number> {
  for (const specification of catalogSpecifications) {
    const product = await prisma.product.findUnique({
      where: {
        slug: specification.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for specification: ${specification.productSlug}`,
      );
    }

    await prisma.productSpecification.upsert({
      where: {
        productId: product.id,
      },
      update: {
        machineType: specification.machineType,
        pumpPressureBar: specification.pumpPressureBar,
        waterTankL: specification.waterTankL,
        beanHopperG: specification.beanHopperG,
        groundsContainerCapacity:
          specification.groundsContainerCapacity,

        grinderType: specification.grinderType,
        grinderMaterial: specification.grinderMaterial,
        grindSettings: specification.grindSettings,

        milkSystem: specification.milkSystem,
        milkContainerCapacityL:
          specification.milkContainerCapacityL,

        displayType: specification.displayType,

        powerW: specification.powerW,
        voltage: specification.voltage,
        frequencyHz: specification.frequencyHz,

        widthMm: specification.widthMm,
        heightMm: specification.heightMm,
        depthMm: specification.depthMm,
        weightKg: specification.weightKg,

        removableWaterTank:
          specification.removableWaterTank,
        removableBrewGroup:
          specification.removableBrewGroup,
        waterFilterCompatible:
          specification.waterFilterCompatible,
      },
      create: {
        productId: product.id,

        machineType: specification.machineType,
        pumpPressureBar: specification.pumpPressureBar,
        waterTankL: specification.waterTankL,
        beanHopperG: specification.beanHopperG,
        groundsContainerCapacity:
          specification.groundsContainerCapacity,

        grinderType: specification.grinderType,
        grinderMaterial: specification.grinderMaterial,
        grindSettings: specification.grindSettings,

        milkSystem: specification.milkSystem,
        milkContainerCapacityL:
          specification.milkContainerCapacityL,

        displayType: specification.displayType,

        powerW: specification.powerW,
        voltage: specification.voltage,
        frequencyHz: specification.frequencyHz,

        widthMm: specification.widthMm,
        heightMm: specification.heightMm,
        depthMm: specification.depthMm,
        weightKg: specification.weightKg,

        removableWaterTank:
          specification.removableWaterTank,
        removableBrewGroup:
          specification.removableBrewGroup,
        waterFilterCompatible:
          specification.waterFilterCompatible,
      },
    });
  }

  return catalogSpecifications.length;
}