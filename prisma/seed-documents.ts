import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogDocuments } from "./catalog/documents";

export async function seedDocuments(
  prisma: PrismaClient,
): Promise<number> {
  let createdCount = 0;

  for (const catalogDocument of catalogDocuments) {
    const product = await prisma.product.findUnique({
      where: {
        slug: catalogDocument.productSlug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error(
        `Product not found for document: ${catalogDocument.productSlug}`,
      );
    }

    const existingDocument = await prisma.document.findFirst({
      where: {
        productId: product.id,
        url: catalogDocument.url,
      },
      select: {
        id: true,
      },
    });

    if (existingDocument) {
      await prisma.document.update({
        where: {
          id: existingDocument.id,
        },
        data: {
          title: catalogDocument.title,
          documentType: catalogDocument.documentType,
          language: catalogDocument.language,
        },
      });

      continue;
    }

    await prisma.document.create({
      data: {
        productId: product.id,
        title: catalogDocument.title,
        url: catalogDocument.url,
        documentType: catalogDocument.documentType,
        language: catalogDocument.language,
      },
    });

    createdCount += 1;
  }

  return createdCount;
}