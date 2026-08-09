import type { PrismaClient } from "../app/generated/prisma/client";

import { catalogProducts } from "./catalog/products";

export async function seedProducts(
  prisma: PrismaClient,
): Promise<number> {
  for (const catalogProduct of catalogProducts) {
    const brand = await prisma.brand.findUnique({
      where: {
        slug: catalogProduct.brandSlug,
      },
      select: {
        id: true,
      },
    });

    if (!brand) {
      throw new Error(
        `Brand not found for product: ${catalogProduct.brandSlug}`,
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        slug: catalogProduct.categorySlug,
      },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new Error(
        `Category not found for product: ${catalogProduct.categorySlug}`,
      );
    }

    const productFamily = await prisma.productFamily.findUnique({
      where: {
        slug: catalogProduct.familySlug,
      },
      select: {
        id: true,
        brandId: true,
        categoryId: true,
      },
    });

    if (!productFamily) {
      throw new Error(
        `Product family not found: ${catalogProduct.familySlug}`,
      );
    }

    if (productFamily.brandId !== brand.id) {
      throw new Error(
        `Brand mismatch for product family: ${catalogProduct.familySlug}`,
      );
    }

    if (productFamily.categoryId !== category.id) {
      throw new Error(
        `Category mismatch for product family: ${catalogProduct.familySlug}`,
      );
    }

    const existingProduct = catalogProduct.modelNumber
      ? await prisma.product.findFirst({
          where: {
            brandId: brand.id,
            modelNumber: catalogProduct.modelNumber,
          },
          select: {
            id: true,
          },
        })
      : await prisma.product.findUnique({
          where: {
            slug: catalogProduct.slug,
          },
          select: {
            id: true,
          },
        });

    if (existingProduct) {
      await prisma.product.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          productFamilyId: productFamily.id,
          brandId: brand.id,
          categoryId: category.id,
          model: catalogProduct.model,
          fullName: catalogProduct.fullName,
          slug: catalogProduct.slug,
          modelNumber: catalogProduct.modelNumber,
          officialProductUrl:
            catalogProduct.officialProductUrl,
          status: "DRAFT",
          deletedAt: null,
        },
      });

      continue;
    }

    await prisma.product.create({
      data: {
        productFamilyId: productFamily.id,
        brandId: brand.id,
        categoryId: category.id,
        model: catalogProduct.model,
        fullName: catalogProduct.fullName,
        slug: catalogProduct.slug,
        modelNumber: catalogProduct.modelNumber,
        officialProductUrl:
          catalogProduct.officialProductUrl,
        status: "DRAFT",
      },
    });
  }

  return catalogProducts.length;
}