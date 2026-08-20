-- CreateTable
CREATE TABLE "drinks" (
    "id" UUID NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "drinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_drinks" (
    "product_id" UUID NOT NULL,
    "drink_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_drinks_pkey" PRIMARY KEY ("product_id","drink_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drinks_slug_key" ON "drinks"("slug");

-- CreateIndex
CREATE INDEX "drinks_active_idx" ON "drinks"("active");

-- CreateIndex
CREATE INDEX "drinks_sort_order_idx" ON "drinks"("sort_order");

-- CreateIndex
CREATE INDEX "product_drinks_drink_id_idx" ON "product_drinks"("drink_id");

-- CreateIndex
CREATE INDEX "product_drinks_product_id_sort_order_idx" ON "product_drinks"("product_id", "sort_order");

-- AddForeignKey
ALTER TABLE "product_drinks" ADD CONSTRAINT "product_drinks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_drinks" ADD CONSTRAINT "product_drinks_drink_id_fkey" FOREIGN KEY ("drink_id") REFERENCES "drinks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
