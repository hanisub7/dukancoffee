import { notFound } from "next/navigation";
import { updateBrand } from "../../../../actions/brand";
import { prisma } from "../../../../lib/prisma";
type EditBrandPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBrandPage({
  params,
}: EditBrandPageProps) {
  const { id } = await params;

  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  if (!brand) {
    notFound();
  }

  const updateBrandWithId = updateBrand.bind(null, brand.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Brand</h1>

        <p className="mt-2 text-gray-600">
          Update this coffee machine brand.
        </p>
      </div>

      <form
        action={updateBrandWithId}
        className="rounded-xl border bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-medium"
            >
              Brand Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={brand.name}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="mb-2 block font-medium"
            >
              Official Website
            </label>

            <input
              id="website"
              name="website"
              type="url"
              defaultValue={brand.officialWebsiteUrl ?? ""}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              name="active"
              type="checkbox"
              defaultChecked={brand.active}
              className="h-4 w-4"
            />

            <span className="font-medium">Active Brand</span>
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Update Brand
          </button>
        </div>
      </form>
    </div>
  );
}