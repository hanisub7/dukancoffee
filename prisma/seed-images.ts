import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogImages } from "./catalog/images";

export async function seedImages(
  prisma: PrismaClient,
): Promise<number> {
  for (const catalogImage of catalogImages) {
    const product = await prisma.product.findUnique({
      where: {
        slug: catalogImage.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for image: ${catalogImage.productSlug}`,
      );
    }

    const existingImage = await prisma.productImage.findFirst({
      where: {
        productId: product.id,
        imageType: catalogImage.imageType,
        sortOrder: catalogImage.sortOrder,
      },
      select: {
        id: true,
      },
    });

    if (existingImage) {
      await prisma.productImage.update({
        where: {
          id: existingImage.id,
        },
        data: {
          url: catalogImage.url,
          altText: catalogImage.altText,
          imageType: catalogImage.imageType,
          sortOrder: catalogImage.sortOrder,
          sourceUrl: catalogImage.sourceUrl,
        },
      });

      continue;
    }

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: catalogImage.url,
        altText: catalogImage.altText,
        imageType: catalogImage.imageType,
        sortOrder: catalogImage.sortOrder,
        sourceUrl: catalogImage.sourceUrl,
      },
    });
  }

  return catalogImages.length;
}