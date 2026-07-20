-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('MANUFACTURER_PAGE', 'OFFICIAL_MANUAL', 'SPECIFICATION_SHEET', 'WARRANTY_DOCUMENT', 'RETAILER_PAGE', 'AFFILIATE_API', 'PRODUCT_FEED');

-- CreateTable
CREATE TABLE "sources" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "source_type" "SourceType" NOT NULL,
    "source_url" TEXT NOT NULL,
    "information_covered" TEXT,
    "verified_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sources_product_id_idx" ON "sources"("product_id");

-- CreateIndex
CREATE INDEX "sources_source_type_idx" ON "sources"("source_type");

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
