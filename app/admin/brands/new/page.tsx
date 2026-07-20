import { createBrand } from "../../../actions/brand";

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Add Brand
        </h1>

        <p className="mt-2 text-gray-600">
          Create a coffee machine brand.
        </p>
      </div>

      <form
        action={createBrand}
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
              className="w-full rounded-lg border p-3"
              placeholder="DeLonghi"
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
              className="w-full rounded-lg border p-3"
              placeholder="https://www.delonghi.com"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Save Brand
          </button>
        </div>
      </form>
    </div>
  );
}