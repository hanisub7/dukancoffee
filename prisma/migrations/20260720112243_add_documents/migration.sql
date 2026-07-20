-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MANUAL', 'QUICK_START', 'WARRANTY', 'SPEC_SHEET', 'ENERGY_LABEL', 'CLEANING_GUIDE');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL DEFAULT 'MANUAL',
    "language" TEXT DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_product_id_idx" ON "documents"("product_id");

-- CreateIndex
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
