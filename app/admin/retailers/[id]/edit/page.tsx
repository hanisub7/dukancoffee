import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { updateRetailer } from "../../../../actions/retailer";

type EditRetailerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRetailerPage({
  params,
}: EditRetailerPageProps) {
  const { id } = await params;

  const [retailer, countries] = await Promise.all([
    prisma.retailer.findUnique({
      where: {
        id,
      },
    }),
    prisma.country.findMany({
      orderBy: {
        nameEn: "asc",
      },
    }),
  ]);

  if (!retailer) {
    notFound();
  }

  const updateRetailerWithId = updateRetailer.bind(
    null,
    retailer.id
  );

  return (
    <>
      <h1 className="text-3xl font-bold">Edit Retailer</h1>

      <form
        action={updateRetailerWithId}
        className="mt-8 max-w-2xl space-y-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Retailer Name
          </label>

          <input
            type="text"
            name="name"
            required
            defaultValue={retailer.name}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Website URL
          </label>

          <input
            type="url"
            name="websiteUrl"
            required
            defaultValue={retailer.websiteUrl}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Country
          </label>

          <select
            name="countryId"
            required
            defaultValue={retailer.countryId}
            className="w-full rounded-lg border p-3"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.nameEn}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="active"
            defaultChecked={retailer.active}
            className="h-4 w-4"
          />

          <span className="font-medium">Active retailer</span>
        </label>

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>
    </>
  );
}