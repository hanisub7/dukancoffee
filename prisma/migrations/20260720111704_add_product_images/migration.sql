-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('MAIN', 'FRONT', 'SIDE', 'BACK', 'LIFESTYLE', 'PACKAGE');

-- CreateTable
CREATE TABLE "product_images" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "image_type" "ImageType" NOT NULL DEFAULT 'MAIN',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "source_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_images_product_id_idx" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "product_images_image_type_idx" ON "product_images"("image_type");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
