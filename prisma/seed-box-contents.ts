import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogBoxContents } from "./catalog/box-contents";

export async function seedBoxContents(
  prisma: PrismaClient,
): Promise<number> {
  let total = 0;

  for (const entry of catalogBoxContents) {
    const product = await prisma.product.findUnique({
      where: {
        slug: entry.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for box contents: ${entry.productSlug}`,
      );
    }

    for (const itemName of entry.items) {
      const existing = await prisma.boxContent.findFirst({
        where: {
          productId: product.id,
          itemName,
        },
        select: {
          id: true,
        },
      });

      if (existing) {
        await prisma.boxContent.update({
          where: {
            id: existing.id,
          },
          data: {
            quantity: 1,
          },
        });

        continue;
      }

      await prisma.boxContent.create({
        data: {
          productId: product.id,
          itemName,
          quantity: 1,
        },
      });

      total += 1;
    }
  }

  return total;
}