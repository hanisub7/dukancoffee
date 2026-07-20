-- CreateTable
CREATE TABLE "price_history" (
    "id" UUID NOT NULL,
    "offer_id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "original_price" DECIMAL(10,2),
    "discount_percent" INTEGER,
    "in_stock" BOOLEAN NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_history_offer_id_idx" ON "price_history"("offer_id");

-- CreateIndex
CREATE INDEX "price_history_offer_id_checked_at_idx" ON "price_history"("offer_id", "checked_at");

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
