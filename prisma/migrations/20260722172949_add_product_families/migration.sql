-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_family_id" UUID;

-- CreateTable
CREATE TABLE "product_families" (
    "id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_families_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_families_slug_key" ON "product_families"("slug");

-- CreateIndex
CREATE INDEX "product_families_brand_id_idx" ON "product_families"("brand_id");

-- CreateIndex
CREATE INDEX "product_families_category_id_idx" ON "product_families"("category_id");

-- CreateIndex
CREATE INDEX "product_families_status_idx" ON "product_families"("status");

-- CreateIndex
CREATE INDEX "products_product_family_id_idx" ON "products"("product_family_id");

-- AddForeignKey
ALTER TABLE "product_families" ADD CONSTRAINT "product_families_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_families" ADD CONSTRAINT "product_families_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_family_id_fkey" FOREIGN KEY ("product_family_id") REFERENCES "product_families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
