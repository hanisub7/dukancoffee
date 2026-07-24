import { notFound } from "next/navigation";

import {
  addExistingFeatureToProduct,
  createAndAddFeatureToProduct,
  removeFeatureFromProduct,
} from "../../../../actions/product-feature";
import { prisma } from "../../../../lib/prisma";

type ProductFeaturesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductFeaturesPage({
  params,
}: ProductFeaturesPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      features: {
        include: {
          feature: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const isArchived = product.status === "ARCHIVED";

  const selectedFeatureIds = product.features.map(
    (productFeature) => productFeature.featureId,
  );

  const availableFeatures = await prisma.feature.findMany({
    where:
      selectedFeatureIds.length > 0
        ? {
            id: {
              notIn: selectedFeatureIds,
            },
          }
        : undefined,
    orderBy: {
      name: "asc",
    },
  });

  const addExistingFeatureWithId =
    addExistingFeatureToProduct.bind(null, product.id);

  const createFeatureWithId =
    createAndAddFeatureToProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Product Features
        </h1>

        <p className="mt-2 text-gray-600">
          Manage factual features for{" "}
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
          This product is archived. Features cannot be modified until
          the product is restored.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">
            Assigned Features
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Features currently connected to this product.
          </p>

          {product.features.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed p-6 text-center text-gray-500">
              No features have been assigned yet.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {product.features.map(({ feature }) => {
                const removeFeatureWithIds =
                  removeFeatureFromProduct.bind(
                    null,
                    product.id,
                    feature.id,
                  );

                return (
                  <div
                    key={feature.id}
                    className="flex items-start justify-between gap-4 rounded-lg border p-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {feature.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {feature.description ??
                          "No description provided."}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {feature.slug}
                      </p>
                    </div>

                    <form action={removeFeatureWithIds}>
                      <button
                        type="submit"
                        disabled={isArchived}
                        className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="space-y-8">
          <section className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Add Existing Feature
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Connect a feature already available in the catalog.
            </p>

            <form
              action={addExistingFeatureWithId}
              className="mt-6"
            >
              <fieldset disabled={isArchived}>
                <label
                  htmlFor="featureId"
                  className="mb-2 block font-medium"
                >
                  Feature
                </label>

                <select
                  id="featureId"
                  name="featureId"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="" disabled>
                    Select a feature
                  </option>

                  {availableFeatures.map((feature) => (
                    <option
                      key={feature.id}
                      value={feature.id}
                    >
                      {feature.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={
                    isArchived ||
                    availableFeatures.length === 0
                  }
                  className="mt-4 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Add Feature
                </button>
              </fieldset>
            </form>

            {availableFeatures.length === 0 && (
              <p className="mt-4 text-sm text-gray-500">
                All available features are already assigned.
              </p>
            )}
          </section>

          <section className="rounded-xl border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Create New Feature
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a reusable feature and assign it immediately.
            </p>

            <form
              action={createFeatureWithId}
              className="mt-6"
            >
              <fieldset
                disabled={isArchived}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-medium"
                  >
                    Feature Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                    placeholder="Automatic cleaning program"
                  />
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="mb-2 block font-medium"
                  >
                    Slug
                  </label>

                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                    placeholder="automatic-cleaning-program"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Leave empty to generate it from the feature name.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block font-medium"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                    placeholder="Describe the factual manufacturer feature."
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Create and Add Feature
                </button>
              </fieldset>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}