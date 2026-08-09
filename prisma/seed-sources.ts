import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogSources } from "./catalog/sources";

export async function seedSources(
  prisma: PrismaClient,
): Promise<number> {
  let createdCount = 0;

  for (const catalogSource of catalogSources) {
    const product = await prisma.product.findUnique({
      where: {
        slug: catalogSource.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for source: ${catalogSource.productSlug}`,
      );
    }

    const existingSource = await prisma.source.findFirst({
      where: {
        productId: product.id,
        sourceType: catalogSource.sourceType,
        sourceUrl: catalogSource.sourceUrl,
      },
      select: {
        id: true,
      },
    });

    const verifiedAt = new Date(catalogSource.verifiedAt);

    if (existingSource) {
      await prisma.source.update({
        where: {
          id: existingSource.id,
        },
        data: {
          informationCovered:
            catalogSource.informationCovered,
          verifiedAt,
          notes: catalogSource.notes,
        },
      });

      continue;
    }

    await prisma.source.create({
      data: {
        productId: product.id,
        sourceType: catalogSource.sourceType,
        sourceUrl: catalogSource.sourceUrl,
        informationCovered:
          catalogSource.informationCovered,
        verifiedAt,
        notes: catalogSource.notes,
      },
    });

    createdCount += 1;
  }

  return createdCount;
}