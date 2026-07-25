-- CreateTable
CREATE TABLE "box_contents" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "box_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "box_contents_product_id_idx" ON "box_contents"("product_id");

-- AddForeignKey
ALTER TABLE "box_contents" ADD CONSTRAINT "box_contents_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
