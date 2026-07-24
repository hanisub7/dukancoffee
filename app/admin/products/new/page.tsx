import { createProduct } from "../../../actions/product";
import { prisma } from "../../../lib/prisma";

export default async function NewProductPage() {
  const [brands, categories, productFamilies] =
    await Promise.all([
      prisma.brand.findMany({
        where: {
          active: true,
          deletedAt: null,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.category.findMany({
        where: {
          active: true,
          deletedAt: null,
        },
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            nameEn: "asc",
          },
        ],
        select: {
          id: true,
          nameEn: true,
        },
      }),

      prisma.productFamily.findMany({
        where: {
          deletedAt: null,
          brand: {
            active: true,
            deletedAt: null,
          },
          category: {
            active: true,
            deletedAt: null,
          },
        },
        orderBy: [
          {
            brand: {
              name: "asc",
            },
          },
          {
            name: "asc",
          },
        ],
        select: {
          id: true,
          name: true,
          brand: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              nameEn: true,
            },
          },
        },
      }),
    ]);

  const cannotCreateProduct =
    brands.length === 0 || categories.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Add Product Variant
        </h1>

        <p className="mt-2 text-gray-600">
          Create an exact model variant and connect it to a
          product family.
        </p>
      </div>

      <form
        action={createProduct}
        className="rounded-xl border bg-white p-8 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block font-medium"
            >
              Full Product Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-lg border p-3"
              placeholder="DeLonghi Magnifica Evo ECAM290.81.TB"
            />

            <p className="mt-2 text-sm text-gray-500">
              The complete public name of this exact variant.
            </p>
          </div>

          <div>
            <label
              htmlFor="model"
              className="mb-2 block font-medium"
            >
              Product Family Name
            </label>

            <input
              id="model"
              name="model"
              type="text"
              required
              className="w-full rounded-lg border p-3"
              placeholder="Magnifica Evo"
            />

            <p className="mt-2 text-sm text-gray-500">
              Used as the family name when a new family is
              created automatically.
            </p>
          </div>

          <div>
            <label
              htmlFor="modelNumber"
              className="mb-2 block font-medium"
            >
              Model Number
            </label>

            <input
              id="modelNumber"
              name="modelNumber"
              type="text"
              className="w-full rounded-lg border p-3"
              placeholder="ECAM290.81.TB"
            />
          </div>

          <div>
            <label
              htmlFor="releaseYear"
              className="mb-2 block font-medium"
            >
              Release Year
            </label>

            <input
              id="releaseYear"
              name="releaseYear"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full rounded-lg border p-3"
              placeholder="2025"
            />
          </div>

          <div>
            <label
              htmlFor="brandId"
              className="mb-2 block font-medium"
            >
              Brand
            </label>

            <select
              id="brandId"
              name="brandId"
              required
              defaultValue=""
              className="w-full rounded-lg border p-3"
            >
              <option value="" disabled>
                Select Brand
              </option>

              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="mb-2 block font-medium"
            >
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue=""
              className="w-full rounded-lg border p-3"
            >
              <option value="" disabled>
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="productFamilyId"
              className="mb-2 block font-medium"
            >
              Existing Product Family
            </label>

            <select
              id="productFamilyId"
              name="productFamilyId"
              defaultValue=""
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Create a new Product Family automatically
              </option>

              {productFamilies.map((family) => (
                <option
                  key={family.id}
                  value={family.id}
                >
                  {family.brand.name} — {family.name} —{" "}
                  {family.category.nameEn}
                </option>
              ))}
            </select>

            <p className="mt-2 text-sm text-gray-500">
              Select an existing family for another variant of
              the same machine. Leave this blank to create a new
              family using the Product Family Name above.
            </p>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="officialProductUrl"
              className="mb-2 block font-medium"
            >
              Official Product URL
            </label>

            <input
              id="officialProductUrl"
              name="officialProductUrl"
              type="url"
              className="w-full rounded-lg border p-3"
              placeholder="https://..."
            />
          </div>

          <div>
            <label
              htmlFor="manualUrl"
              className="mb-2 block font-medium"
            >
              Manual URL
            </label>

            <input
              id="manualUrl"
              name="manualUrl"
              type="url"
              className="w-full rounded-lg border p-3"
              placeholder="https://..."
            />
          </div>

          <div>
            <label
              htmlFor="warrantyUrl"
              className="mb-2 block font-medium"
            >
              Warranty URL
            </label>

            <input
              id="warrantyUrl"
              name="warrantyUrl"
              type="url"
              className="w-full rounded-lg border p-3"
              placeholder="https://..."
            />
          </div>
        </div>

        {brands.length === 0 && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active brands exist. Add a brand before creating
            a product.
          </p>
        )}

        {categories.length === 0 && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active categories exist. Add a category before
            creating a product.
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={cannotCreateProduct}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Save Product Variant
          </button>
        </div>
      </form>
    </div>
  );
}