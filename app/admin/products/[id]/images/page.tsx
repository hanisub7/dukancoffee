import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import {
  createProductImage,
  deleteProductImage,
} from "../../../../actions/product-image";

type ProductImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductImagesPage({
  params,
}: ProductImagesPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const createProductImageWithId = createProductImage.bind(
    null,
    product.id
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Images</h1>

        <p className="mt-2 text-gray-600">
          Manage images for <strong>{product.fullName}</strong>
        </p>
      </div>

      <form
        action={createProductImageWithId}
        className="rounded-xl border bg-white p-8 shadow-sm"
      >
        <h2 className="text-xl font-semibold">Add Image</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="url" className="mb-2 block font-medium">
              Image URL
            </label>

            <input
              id="url"
              name="url"
              type="url"
              required
              className="w-full rounded-lg border p-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="altText" className="mb-2 block font-medium">
              Alt Text
            </label>

            <input
              id="altText"
              name="altText"
              type="text"
              className="w-full rounded-lg border p-3"
              placeholder="Front view of the coffee machine"
            />
          </div>

          <div>
            <label htmlFor="imageType" className="mb-2 block font-medium">
              Image Type
            </label>

            <select
              id="imageType"
              name="imageType"
              defaultValue="FRONT"
              className="w-full rounded-lg border p-3"
            >
              <option value="MAIN">Main</option>
              <option value="FRONT">Front</option>
              <option value="SIDE">Side</option>
              <option value="BACK">Back</option>
              <option value="LIFESTYLE">Lifestyle</option>
              <option value="PACKAGE">Package</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder" className="mb-2 block font-medium">
              Sort Order
            </label>

            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              defaultValue={0}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label htmlFor="sourceUrl" className="mb-2 block font-medium">
              Source URL
            </label>

            <input
              id="sourceUrl"
              name="sourceUrl"
              type="url"
              className="w-full rounded-lg border p-3"
              placeholder="https://manufacturer.com/product"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Add Image
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Current Images</h2>

        {product.images.length === 0 ? (
          <div className="mt-4 rounded-lg border bg-white p-10 text-center">
            <p className="text-gray-500">
              No images have been added yet.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {product.images.map((image) => {
              const deleteAction = deleteProductImage.bind(
                null,
                product.id,
                image.id
              );

              return (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <img
                    src={image.url}
                    alt={image.altText ?? product.fullName}
                    className="h-56 w-full object-contain bg-white p-4"
                  />

                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {image.imageType}
                      </span>

                      <span className="text-sm text-gray-500">
                        #{image.sortOrder}
                      </span>
                    </div>

                    {image.altText && (
                      <p className="mt-2 text-sm text-gray-600">
                        {image.altText}
                      </p>
                    )}

                    {image.sourceUrl && (
                      <a
                        href={image.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-sm text-blue-600 hover:underline"
                      >
                        View Source
                      </a>
                    )}

                    <form action={deleteAction} className="mt-4">
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Delete Image
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}