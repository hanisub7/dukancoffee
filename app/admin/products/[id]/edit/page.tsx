import { notFound } from "next/navigation";

import { updateProduct } from "../../../../actions/product";
import { prisma } from "../../../../lib/prisma";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!product) {
    notFound();
  }

  const [brands, categories, productFamilies] =
    await Promise.all([
      prisma.brand.findMany({
        where: {
          OR: [
            {
              active: true,
              deletedAt: null,
            },
            {
              id: product.brandId,
            },
          ],
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          active: true,
        },
      }),

      prisma.category.findMany({
        where: {
          OR: [
            {
              active: true,
              deletedAt: null,
            },
            {
              id: product.categoryId,
            },
          ],
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
          active: true,
        },
      }),

      prisma.productFamily.findMany({
        where: {
          OR: [
            {
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
            {
              id: product.productFamilyId,
            },
          ],
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
          brandId: true,
          categoryId: true,
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

  const updateProductWithId = updateProduct.bind(
    null,
    product.id,
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Product Variant
        </h1>

        <p className="mt-2 text-gray-600">
          Update this exact product variant, its product family,
          and publication status.
        </p>
      </div>

      <form
        action={updateProductWithId}
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
              defaultValue={product.fullName}
              className="w-full rounded-lg border p-3"
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
              defaultValue={product.model}
              className="w-full rounded-lg border p-3"
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
              defaultValue={product.modelNumber ?? ""}
              className="w-full rounded-lg border p-3"
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
              defaultValue={product.releaseYear ?? ""}
              className="w-full rounded-lg border p-3"
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
              defaultValue={product.brandId}
              className="w-full rounded-lg border p-3"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                  {!brand.active ? " — Inactive" : ""}
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
              defaultValue={product.categoryId}
              className="w-full rounded-lg border p-3"
            >
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.nameEn}
                  {!category.active ? " — Inactive" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="productFamilyId"
              className="mb-2 block font-medium"
            >
              Product Family
            </label>

            <select
              id="productFamilyId"
              name="productFamilyId"
              required
              defaultValue={product.productFamilyId}
              className="w-full rounded-lg border p-3"
            >
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
              A product family is required. It must match the
              selected brand and category.
            </p>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              required
              defaultValue={product.status}
              className="w-full rounded-lg border p-3"
            >
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
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
              defaultValue={product.officialProductUrl ?? ""}
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
              defaultValue={product.manualUrl ?? ""}
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
              defaultValue={product.warrantyUrl ?? ""}
              className="w-full rounded-lg border p-3"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}