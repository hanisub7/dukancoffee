-- CreateTable
CREATE TABLE "offers" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "retailer_id" UUID NOT NULL,
    "product_url" TEXT NOT NULL,
    "affiliate_url" TEXT,
    "currency_code" CHAR(3) NOT NULL,
    "current_price" DECIMAL(10,2) NOT NULL,
    "original_price" DECIMAL(10,2),
    "discount_percent" INTEGER,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offers_product_id_idx" ON "offers"("product_id");

-- CreateIndex
CREATE INDEX "offers_retailer_id_idx" ON "offers"("retailer_id");

-- CreateIndex
CREATE UNIQUE INDEX "offers_product_id_retailer_id_key" ON "offers"("product_id", "retailer_id");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_retailer_id_fkey" FOREIGN KEY ("retailer_id") REFERENCES "retailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
