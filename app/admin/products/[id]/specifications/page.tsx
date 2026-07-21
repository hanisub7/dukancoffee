import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { saveProductSpecification } from "../../../../actions/product-specification";

type ProductSpecificationsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductSpecificationsPage({
  params,
}: ProductSpecificationsPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      specification: true,
    },
  });

  if (!product) {
    notFound();
  }

  const specification = product.specification;

  const saveSpecificationWithId =
    saveProductSpecification.bind(null, product.id);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Product Specifications
        </h1>

        <p className="mt-2 text-gray-600">
          Manage specifications for{" "}
          <strong>{product.fullName}</strong>
        </p>
      </div>

      <form
        action={saveSpecificationWithId}
        className="rounded-xl border bg-white p-8 shadow-sm"
      >
        <section>
          <h2 className="mb-6 text-xl font-semibold">
            General
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="machineType"
                className="mb-2 block font-medium"
              >
                Machine Type
              </label>

              <input
                id="machineType"
                name="machineType"
                type="text"
                defaultValue={specification?.machineType ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="Automatic espresso machine"
              />
            </div>

            <div>
              <label
                htmlFor="pumpPressureBar"
                className="mb-2 block font-medium"
              >
                Pump Pressure (Bar)
              </label>

              <input
                id="pumpPressureBar"
                name="pumpPressureBar"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  specification?.pumpPressureBar?.toString() ?? ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="15"
              />
            </div>

            <div>
              <label
                htmlFor="waterTankL"
                className="mb-2 block font-medium"
              >
                Water Tank Capacity (L)
              </label>

              <input
                id="waterTankL"
                name="waterTankL"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  specification?.waterTankL?.toString() ?? ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="1.8"
              />
            </div>

            <div>
              <label
                htmlFor="beanHopperG"
                className="mb-2 block font-medium"
              >
                Bean Hopper Capacity (g)
              </label>

              <input
                id="beanHopperG"
                name="beanHopperG"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.beanHopperG ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="250"
              />
            </div>

            <div>
              <label
                htmlFor="groundsContainerCapacity"
                className="mb-2 block font-medium"
              >
                Grounds Container Capacity
              </label>

              <input
                id="groundsContainerCapacity"
                name="groundsContainerCapacity"
                type="number"
                min="0"
                step="1"
                defaultValue={
                  specification?.groundsContainerCapacity ?? ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="12"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="mb-6 text-xl font-semibold">
            Grinder
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="grinderType"
                className="mb-2 block font-medium"
              >
                Grinder Type
              </label>

              <input
                id="grinderType"
                name="grinderType"
                type="text"
                defaultValue={specification?.grinderType ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="Conical burr"
              />
            </div>

            <div>
              <label
                htmlFor="grinderMaterial"
                className="mb-2 block font-medium"
              >
                Grinder Material
              </label>

              <input
                id="grinderMaterial"
                name="grinderMaterial"
                type="text"
                defaultValue={
                  specification?.grinderMaterial ?? ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="Ceramic"
              />
            </div>

            <div>
              <label
                htmlFor="grindSettings"
                className="mb-2 block font-medium"
              >
                Grind Settings
              </label>

              <input
                id="grindSettings"
                name="grindSettings"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.grindSettings ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="12"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="mb-6 text-xl font-semibold">
            Milk System
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="milkSystem"
                className="mb-2 block font-medium"
              >
                Milk System Type
              </label>

              <input
                id="milkSystem"
                name="milkSystem"
                type="text"
                defaultValue={specification?.milkSystem ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="Automatic milk frother"
              />
            </div>

            <div>
              <label
                htmlFor="milkContainerCapacityL"
                className="mb-2 block font-medium"
              >
                Milk Container Capacity (L)
              </label>

              <input
                id="milkContainerCapacityL"
                name="milkContainerCapacityL"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  specification?.milkContainerCapacityL?.toString() ??
                  ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="0.5"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="mb-6 text-xl font-semibold">
            Display and Electrical
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="displayType"
                className="mb-2 block font-medium"
              >
                Display Type
              </label>

              <input
                id="displayType"
                name="displayType"
                type="text"
                defaultValue={specification?.displayType ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="Touchscreen"
              />
            </div>

            <div>
              <label
                htmlFor="powerW"
                className="mb-2 block font-medium"
              >
                Power (W)
              </label>

              <input
                id="powerW"
                name="powerW"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.powerW ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="1500"
              />
            </div>

            <div>
              <label
                htmlFor="voltage"
                className="mb-2 block font-medium"
              >
                Voltage
              </label>

              <input
                id="voltage"
                name="voltage"
                type="text"
                defaultValue={specification?.voltage ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="220–240 V"
              />
            </div>

            <div>
              <label
                htmlFor="frequencyHz"
                className="mb-2 block font-medium"
              >
                Frequency (Hz)
              </label>

              <input
                id="frequencyHz"
                name="frequencyHz"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.frequencyHz ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="60"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="mb-6 text-xl font-semibold">
            Dimensions and Weight
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="widthMm"
                className="mb-2 block font-medium"
              >
                Width (mm)
              </label>

              <input
                id="widthMm"
                name="widthMm"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.widthMm ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="250"
              />
            </div>

            <div>
              <label
                htmlFor="heightMm"
                className="mb-2 block font-medium"
              >
                Height (mm)
              </label>

              <input
                id="heightMm"
                name="heightMm"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.heightMm ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="370"
              />
            </div>

            <div>
              <label
                htmlFor="depthMm"
                className="mb-2 block font-medium"
              >
                Depth (mm)
              </label>

              <input
                id="depthMm"
                name="depthMm"
                type="number"
                min="0"
                step="1"
                defaultValue={specification?.depthMm ?? ""}
                className="w-full rounded-lg border p-3"
                placeholder="430"
              />
            </div>

            <div>
              <label
                htmlFor="weightKg"
                className="mb-2 block font-medium"
              >
                Weight (kg)
              </label>

              <input
                id="weightKg"
                name="weightKg"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  specification?.weightKg?.toString() ?? ""
                }
                className="w-full rounded-lg border p-3"
                placeholder="9.5"
              />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t pt-8">
          <h2 className="mb-6 text-xl font-semibold">
            Removable Parts and Compatibility
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="removableWaterTank"
                className="mb-2 block font-medium"
              >
                Removable Water Tank
              </label>

              <select
                id="removableWaterTank"
                name="removableWaterTank"
                defaultValue={
                  specification?.removableWaterTank === true
                    ? "true"
                    : specification?.removableWaterTank === false
                      ? "false"
                      : ""
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Not specified</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="removableBrewGroup"
                className="mb-2 block font-medium"
              >
                Removable Brew Group
              </label>

              <select
                id="removableBrewGroup"
                name="removableBrewGroup"
                defaultValue={
                  specification?.removableBrewGroup === true
                    ? "true"
                    : specification?.removableBrewGroup === false
                      ? "false"
                      : ""
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Not specified</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="waterFilterCompatible"
                className="mb-2 block font-medium"
              >
                Water Filter Compatible
              </label>

              <select
                id="waterFilterCompatible"
                name="waterFilterCompatible"
                defaultValue={
                  specification?.waterFilterCompatible === true
                    ? "true"
                    : specification?.waterFilterCompatible === false
                      ? "false"
                      : ""
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">Not specified</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </section>

        <div className="mt-10 flex justify-end border-t pt-8">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Save Specifications
          </button>
        </div>
      </form>
    </div>
  );
}