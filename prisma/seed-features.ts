import type { PrismaClient } from "../app/generated/prisma/client";

import {
  catalogFeatures,
  catalogProductFeatures,
} from "./catalog/features";

export async function seedFeatures(
  prisma: PrismaClient,
): Promise<{
  featureCount: number;
  productFeatureCount: number;
}> {
  const featureIds = new Map<string, string>();

  for (const feature of catalogFeatures) {
    const savedFeature = await prisma.feature.upsert({
      where: {
        slug: feature.slug,
      },
      update: {
        name: feature.name,
        description: feature.description,
      },
      create: {
        slug: feature.slug,
        name: feature.name,
        description: feature.description,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    featureIds.set(savedFeature.slug, savedFeature.id);
  }

  let productFeatureCount = 0;

  for (const item of catalogProductFeatures) {
    const product = await prisma.product.findUnique({
      where: {
        slug: item.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for features: ${item.productSlug}`,
      );
    }

    for (const featureSlug of item.featureSlugs) {
      const featureId = featureIds.get(featureSlug);

      if (!featureId) {
        throw new Error(
          `Feature not found in catalog: ${featureSlug}`,
        );
      }

      await prisma.productFeature.upsert({
        where: {
          productId_featureId: {
            productId: product.id,
            featureId,
          },
        },
        update: {},
        create: {
          productId: product.id,
          featureId,
        },
      });

      productFeatureCount += 1;
    }
  }

  return {
    featureCount: catalogFeatures.length,
    productFeatureCount,
  };
}