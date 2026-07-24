import { notFound } from "next/navigation";

import {
  createSource,
  deleteSource,
  updateSource,
} from "../../../../actions/source";
import { prisma } from "../../../../lib/prisma";

type ProductSourcesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const sourceTypes = [
  "MANUFACTURER_PAGE",
  "OFFICIAL_MANUAL",
  "SPECIFICATION_SHEET",
  "WARRANTY_DOCUMENT",
  "RETAILER_PAGE",
  "AFFILIATE_API",
  "PRODUCT_FEED",
] as const;

export default async function ProductSourcesPage({
  params,
}: ProductSourcesPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      sources: {
        orderBy: [
          {
            sourceType: "asc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });

  if (!product) {
    notFound();
  }

  const archived = product.status === "ARCHIVED";

  const createAction = createSource.bind(
    null,
    product.id,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Product Sources
        </h1>

        <p className="mt-2 text-gray-600">
          Track the official sources used for{" "}
          <strong>{product.fullName}</strong>.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Status: {product.status}
        </p>
      </div>

      {archived && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
          Archived products cannot be modified.
        </div>
      )}

      <section className="rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">
          Add Source
        </h2>

        <form action={createAction} className="mt-6">
          <fieldset
            disabled={archived}
            className="grid gap-6 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block font-medium">
                Source Type
              </label>

              <select
                name="sourceType"
                required
                defaultValue="MANUFACTURER_PAGE"
                className="w-full rounded-lg border p-3"
              >
                {sourceTypes.map((type) => (
                  <option key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Verified At
              </label>

              <input
                type="date"
                name="verifiedAt"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Source URL
              </label>

              <input
                type="url"
                name="sourceUrl"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Information Covered
              </label>

              <textarea
                rows={3}
                name="informationCovered"
                className="w-full rounded-lg border p-3"
                placeholder="Pump pressure, dimensions, water tank..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Notes
              </label>

              <textarea
                rows={3}
                name="notes"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 text-white"
              >
                Add Source
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">
          Current Sources
        </h2>

        {product.sources.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
            No sources have been added.
          </div>
        ) : (
          product.sources.map((source) => {
            const updateAction =
              updateSource.bind(
                null,
                product.id,
                source.id,
              );

            const deleteAction =
              deleteSource.bind(
                null,
                product.id,
                source.id,
              );

            return (
              <article
                key={source.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <form action={updateAction}>
                  <fieldset
                    disabled={archived}
                    className="grid gap-5 md:grid-cols-2"
                  >
                    <div>
                      <label className="mb-2 block font-medium">
                        Source Type
                      </label>

                      <select
                        name="sourceType"
                        defaultValue={source.sourceType}
                        className="w-full rounded-lg border p-3"
                      >
                        {sourceTypes.map((type) => (
                          <option key={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block font-medium">
                        Verified At
                      </label>

                      <input
                        type="date"
                        name="verifiedAt"
                        defaultValue={
                          source.verifiedAt
                            ?.toISOString()
                            .split("T")[0] ?? ""
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block font-medium">
                        Source URL
                      </label>

                      <input
                        type="url"
                        name="sourceUrl"
                        defaultValue={source.sourceUrl}
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block font-medium">
                        Information Covered
                      </label>

                      <textarea
                        rows={3}
                        name="informationCovered"
                        defaultValue={
                          source.informationCovered ?? ""
                        }
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block font-medium">
                        Notes
                      </label>

                      <textarea
                        rows={3}
                        name="notes"
                        defaultValue={source.notes ?? ""}
                        className="w-full rounded-lg border p-3"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between">
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open Source
                      </a>

                      <button
                        type="submit"
                        className="rounded-lg bg-black px-5 py-2.5 text-white"
                      >
                        Save Changes
                      </button>
                    </div>
                  </fieldset>
                </form>

                <form
                  action={deleteAction}
                  className="mt-5 border-t pt-5"
                >
                  <button
                    type="submit"
                    disabled={archived}
                    className="text-red-600 hover:underline disabled:text-gray-400"
                  >
                    Delete Source
                  </button>
                </form>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}