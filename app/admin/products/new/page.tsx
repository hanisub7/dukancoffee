import { createProduct } from "../../../actions/product";
import { prisma } from "../../../lib/prisma";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      where: {
        active: true,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
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
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Product</h1>

        <p className="mt-2 text-gray-600">
          Create a new coffee machine for your catalog.
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
              Product Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-lg border p-3"
              placeholder="DeLonghi Magnifica Evo"
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="mb-2 block font-medium"
            >
              Model
            </label>

            <input
              id="model"
              name="model"
              type="text"
              required
              className="w-full rounded-lg border p-3"
              placeholder="Magnifica Evo"
            />
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
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {brands.length === 0 && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No active brands exist yet. You must add a brand before creating a
            product.
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={brands.length === 0 || categories.length === 0}
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}