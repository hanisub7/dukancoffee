import "dotenv/config";
import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("Starting ProductFamily backfill...\n");

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  let createdFamilies = 0;
  let linkedProducts = 0;
  let skippedProducts = 0;

  for (const product of products) {
    if (product.productFamilyId) {
      skippedProducts++;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const family = await tx.productFamily.create({
        data: {
          brandId: product.brandId,
          categoryId: product.categoryId,
          name: product.fullName,
          slug: product.slug,
          description: null,
          status: product.status,
        },
      });

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          productFamilyId: family.id,
        },
      });
    });

    createdFamilies++;
    linkedProducts++;

    console.log(`Linked: ${product.fullName}`);
  }

  console.log("\n====================================");
  console.log(`Products scanned : ${products.length}`);
  console.log(`Families created : ${createdFamilies}`);
  console.log(`Products linked  : ${linkedProducts}`);
  console.log(`Skipped          : ${skippedProducts}`);
  console.log("====================================");
}

main()
  .catch((error: unknown) => {
    console.error("\nProductFamily backfill failed:");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });