-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('BANK_CARD_DISCOUNT', 'COUPON_CODE', 'CASHBACK', 'FREE_GIFT', 'FREE_SHIPPING', 'INSTALLMENT', 'GENERAL_DISCOUNT', 'OTHER');

-- CreateTable
CREATE TABLE "promotions" (
    "id" UUID NOT NULL,
    "offer_id" UUID NOT NULL,
    "promotion_type" "PromotionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coupon_code" TEXT,
    "discount_percent" INTEGER,
    "discount_amount" DECIMAL(10,2),
    "cashback_percent" INTEGER,
    "cashback_amount" DECIMAL(10,2),
    "bank_name" TEXT,
    "minimum_spend" DECIMAL(10,2),
    "installment_months" INTEGER,
    "free_gift_description" TEXT,
    "terms" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "promotions_offer_id_idx" ON "promotions"("offer_id");

-- CreateIndex
CREATE INDEX "promotions_promotion_type_idx" ON "promotions"("promotion_type");

-- CreateIndex
CREATE INDEX "promotions_active_idx" ON "promotions"("active");

-- CreateIndex
CREATE INDEX "promotions_ends_at_idx" ON "promotions"("ends_at");

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
