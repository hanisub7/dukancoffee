-- CreateTable
CREATE TABLE "product_specifications" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "machine_type" TEXT,
    "pump_pressure_bar" DECIMAL(5,2),
    "water_tank_l" DECIMAL(6,2),
    "bean_hopper_g" INTEGER,
    "grounds_container_capacity" INTEGER,
    "grinder_type" TEXT,
    "grinder_material" TEXT,
    "grind_settings" INTEGER,
    "milk_system" TEXT,
    "milk_container_capacity_l" DECIMAL(6,2),
    "display_type" TEXT,
    "power_w" INTEGER,
    "voltage" TEXT,
    "frequency_hz" INTEGER,
    "width_mm" INTEGER,
    "height_mm" INTEGER,
    "depth_mm" INTEGER,
    "weight_kg" DECIMAL(6,2),
    "removable_water_tank" BOOLEAN,
    "removable_brew_group" BOOLEAN,
    "water_filter_compatible" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_specifications_product_id_key" ON "product_specifications"("product_id");

-- AddForeignKey
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
