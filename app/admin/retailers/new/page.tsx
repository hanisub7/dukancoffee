import { prisma } from "../../../lib/prisma";
import { createRetailer } from "../../../actions/retailer";

export default async function NewRetailerPage() {
  const countries = await prisma.country.findMany({
    orderBy: {
      nameEn: "asc",
    },
  });

  return (
    <>
      <h1 className="text-3xl font-bold">New Retailer</h1>

      <form action={createRetailer} className="mt-8 max-w-2xl space-y-6">
        <div>
          <label className="mb-2 block font-medium">
            Retailer Name
          </label>

          <input
            type="text"
            name="name"
            required
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
            className="w-full rounded-lg border p-3"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Country
          </label>

          <select
            name="countryId"
            required
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select a country</option>

            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.nameEn}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Create Retailer
        </button>
      </form>
    </>
  );
}