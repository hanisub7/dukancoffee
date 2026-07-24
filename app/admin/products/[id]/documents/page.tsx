import { notFound } from "next/navigation";

import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "../../../../actions/document";
import { prisma } from "../../../../lib/prisma";

type ProductDocumentsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const documentTypeOptions = [
  {
    value: "MANUAL",
    label: "Manual",
  },
  {
    value: "QUICK_START",
    label: "Quick Start",
  },
  {
    value: "WARRANTY",
    label: "Warranty",
  },
  {
    value: "SPEC_SHEET",
    label: "Specification Sheet",
  },
  {
    value: "ENERGY_LABEL",
    label: "Energy Label",
  },
  {
    value: "CLEANING_GUIDE",
    label: "Cleaning Guide",
  },
] as const;

export default async function ProductDocumentsPage({
  params,
}: ProductDocumentsPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      documents: {
        orderBy: [
          {
            documentType: "asc",
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

  const createAction = createDocument.bind(
    null,
    product.id,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Product Documents
        </h1>

        <p className="mt-2 text-gray-600">
          Manage official documents for{" "}
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
          This product is archived. Documents cannot be added,
          edited, or deleted until the product is restored.
        </div>
      )}

      <section className="rounded-xl border bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">
          Add Document
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Add an official manual, warranty document, guide, or
          specification sheet.
        </p>

        <form action={createAction} className="mt-6">
          <fieldset
            disabled={isArchived}
            className="grid gap-6 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-medium"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="User Manual"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="documentType"
                className="mb-2 block font-medium"
              >
                Document Type
              </label>

              <select
                id="documentType"
                name="documentType"
                defaultValue="MANUAL"
                required
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {documentTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="url"
                className="mb-2 block font-medium"
              >
                Document URL
              </label>

              <input
                id="url"
                name="url"
                type="url"
                required
                placeholder="https://manufacturer.com/manual.pdf"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="language"
                className="mb-2 block font-medium"
              >
                Language
              </label>

              <input
                id="language"
                name="language"
                type="text"
                defaultValue="en"
                placeholder="en, ar, en-US, ar-SA"
                className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <p className="mt-2 text-sm text-gray-500">
                Use a language code such as en, ar, en-US, or
                ar-SA.
              </p>
            </div>

            <div className="flex items-end justify-end">
              <button
                type="submit"
                className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Add Document
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">
            Current Documents
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {product.documents.length}{" "}
            {product.documents.length === 1
              ? "document"
              : "documents"}
          </p>
        </div>

        {product.documents.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed bg-white p-10 text-center">
            <p className="text-gray-500">
              No documents have been added yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {product.documents.map((document) => {
              const updateAction = updateDocument.bind(
                null,
                product.id,
                document.id,
              );

              const deleteAction = deleteDocument.bind(
                null,
                product.id,
                document.id,
              );

              return (
                <article
                  key={document.id}
                  className="rounded-xl border bg-white p-6 shadow-sm"
                >
                  <form action={updateAction}>
                    <fieldset
                      disabled={isArchived}
                      className="grid gap-5 md:grid-cols-2"
                    >
                      <div>
                        <label
                          htmlFor={`title-${document.id}`}
                          className="mb-2 block font-medium"
                        >
                          Title
                        </label>

                        <input
                          id={`title-${document.id}`}
                          name="title"
                          type="text"
                          required
                          defaultValue={document.title}
                          className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`documentType-${document.id}`}
                          className="mb-2 block font-medium"
                        >
                          Document Type
                        </label>

                        <select
                          id={`documentType-${document.id}`}
                          name="documentType"
                          required
                          defaultValue={document.documentType}
                          className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          {documentTypeOptions.map(
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

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`url-${document.id}`}
                          className="mb-2 block font-medium"
                        >
                          Document URL
                        </label>

                        <input
                          id={`url-${document.id}`}
                          name="url"
                          type="url"
                          required
                          defaultValue={document.url}
                          className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`language-${document.id}`}
                          className="mb-2 block font-medium"
                        >
                          Language
                        </label>

                        <input
                          id={`language-${document.id}`}
                          name="language"
                          type="text"
                          defaultValue={document.language ?? "en"}
                          className="w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                      </div>

                      <div className="flex items-end justify-end">
                        <button
                          type="submit"
                          className="rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          Save Changes
                        </button>
                      </div>
                    </fieldset>
                  </form>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t pt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {document.documentType}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {document.language ?? "en"}
                      </span>

                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Open Document
                      </a>
                    </div>

                    <form action={deleteAction}>
                      <button
                        type="submit"
                        disabled={isArchived}
                        className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                      >
                        Delete Document
                      </button>
                    </form>
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