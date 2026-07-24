import { notFound } from "next/navigation";

import {
  createProductImage,
  deleteProductImage,
  updateProductImage,
} from "../../../../actions/product-image";
import { prisma } from "../../../../lib/prisma";

type ProductImagesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const imageTypeOptions = [
  {
    value: "MAIN",
    label: "Main",
  },
  {
    value: "FRONT",
    label: "Front",
  },
  {
    value: "SIDE",
    label: "Side",
  },
  {
    value: "BACK",
    label: "Back",
  },
  {
    value: "LIFESTYLE",
    label: "Lifestyle",
  },
  {
    value: "PACKAGE",
    label: "Package",
  },
] as const;

export default async function ProductImagesPage({
  params,
}: ProductImagesPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
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

  const isArchived = product.status === "ARCHIVED";

  const createAction = createProductImage.bind(
    null,
    product.id,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Product Images
        </h1>

        <p className="mt-2 text-gray-600">
          Manage images for{" "}
          <strong>{product.fullName}</strong>
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Status:{" "}
          <span className="font-medium text-gray-700">
            {product.status}
          </span>
        </p>
      </div>

      {isArchived && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          This product is archived. Images cannot be added,
          edited, or deleted until the product is restored.
        </div>
      )}

      <section className="rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">
          Add Image
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add a hosted product image and record its source.
        </p>

        <form
          action={createAction}
          className="mt-6"
        >
          <fieldset
            disabled={isArchived}
            className="grid gap-6 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <label
                htmlFor="url"
                className="mb-2 block font-medium"
              >
                Image URL
              </label>

              <input
                id="url"
                name="url"
                type="url"
                required
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="altText"
                className="mb-2 block font-medium"
              >
                Alt Text
              </label>

              <input
                id="altText"
                name="altText"
                type="text"
                placeholder="Front view of the coffee machine"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="imageType"
                className="mb-2 block font-medium"
              >
                Image Type
              </label>

              <select
                id="imageType"
                name="imageType"
                defaultValue="FRONT"
                required
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {imageTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm text-gray-500">
                Adding a new Main image changes the previous Main
                image to Front.
              </p>
            </div>

            <div>
              <label
                htmlFor="sortOrder"
                className="mb-2 block font-medium"
              >
                Sort Order
              </label>

              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                step="1"
                defaultValue={0}
                required
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="sourceUrl"
                className="mb-2 block font-medium"
              >
                Source URL
              </label>

              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                placeholder="https://manufacturer.com/product"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div className="flex justify-end md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add Image
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Current Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product.images.length}{" "}
              {product.images.length === 1
                ? "image"
                : "images"}
            </p>
          </div>
        </div>

        {product.images.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed bg-white p-10 text-center">
            <p className="text-gray-500">
              No images have been added yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {product.images.map((image) => {
              const updateAction =
                updateProductImage.bind(
                  null,
                  product.id,
                  image.id,
                );

              const deleteAction =
                deleteProductImage.bind(
                  null,
                  product.id,
                  image.id,
                );

              return (
                <article
                  key={image.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <div className="grid lg:grid-cols-[320px_1fr]">
                    <div className="border-b bg-gray-50 p-6 lg:border-b-0 lg:border-r">
                      <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-lg border bg-white">
                        {/* External URLs are intentionally rendered
                            with a native image element. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={
                            image.altText ??
                            product.fullName
                          }
                          className="max-h-72 w-full object-contain p-4"
                        />

                        {image.imageType === "MAIN" && (
                          <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                            Main Image
                          </span>
                        )}
                      </div>

                      <a
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 block break-all text-sm text-blue-600 hover:underline"
                      >
                        Open full image
                      </a>
                    </div>

                    <div className="p-6">
                      <form action={updateAction}>
                        <fieldset
                          disabled={isArchived}
                          className="grid gap-5 md:grid-cols-2"
                        >
                          <div className="md:col-span-2">
                            <label
                              htmlFor={`url-${image.id}`}
                              className="mb-2 block font-medium"
                            >
                              Image URL
                            </label>

                            <input
                              id={`url-${image.id}`}
                              name="url"
                              type="url"
                              required
                              defaultValue={image.url}
                              className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`altText-${image.id}`}
                              className="mb-2 block font-medium"
                            >
                              Alt Text
                            </label>

                            <input
                              id={`altText-${image.id}`}
                              name="altText"
                              type="text"
                              defaultValue={
                                image.altText ?? ""
                              }
                              className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`imageType-${image.id}`}
                              className="mb-2 block font-medium"
                            >
                              Image Type
                            </label>

                            <select
                              id={`imageType-${image.id}`}
                              name="imageType"
                              required
                              defaultValue={
                                image.imageType
                              }
                              className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                            >
                              {imageTypeOptions.map(
                                (option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`sortOrder-${image.id}`}
                              className="mb-2 block font-medium"
                            >
                              Sort Order
                            </label>

                            <input
                              id={`sortOrder-${image.id}`}
                              name="sortOrder"
                              type="number"
                              min="0"
                              step="1"
                              required
                              defaultValue={
                                image.sortOrder
                              }
                              className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`sourceUrl-${image.id}`}
                              className="mb-2 block font-medium"
                            >
                              Source URL
                            </label>

                            <input
                              id={`sourceUrl-${image.id}`}
                              name="sourceUrl"
                              type="url"
                              defaultValue={
                                image.sourceUrl ?? ""
                              }
                              className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-4 md:col-span-2">
                            <div className="text-sm text-gray-500">
                              Added{" "}
                              {image.createdAt.toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </div>

                            <button
                              type="submit"
                              className="rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                              Save Changes
                            </button>
                          </div>
                        </fieldset>
                      </form>

                      <div className="mt-6 border-t pt-5">
                        <div className="flex items-center justify-between gap-4">
                          {image.sourceUrl ? (
                            <a
                              href={image.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Source
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">
                              No source URL
                            </span>
                          )}

                          <form action={deleteAction}>
                            <button
                              type="submit"
                              disabled={isArchived}
                              className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                            >
                              Delete Image
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}