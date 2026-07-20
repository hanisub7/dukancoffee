import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { updateProduct } from "../../../../actions/product";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id,
      },
    }),
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

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>

        <p className="mt-2 text-gray-600">
          Update the product information and publication status.
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
              Product Name
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
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
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
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
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