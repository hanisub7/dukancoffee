import { createDrink } from "../../../actions/drink";

export default function NewDrinkPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Drink</h1>

        <p className="mt-2 text-gray-600">
          Create a drink that can be supported by coffee machines.
        </p>
      </div>

      <form
        action={createDrink}
        className="rounded-xl border bg-white p-8 shadow-sm"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="nameEn"
              className="mb-2 block font-medium"
            >
              English Name
            </label>

            <input
              id="nameEn"
              name="nameEn"
              type="text"
              required
              className="w-full rounded-lg border p-3"
              placeholder="Espresso"
            />
          </div>

          <div>
            <label
              htmlFor="nameAr"
              className="mb-2 block font-medium"
            >
              Arabic Name
            </label>

            <input
              id="nameAr"
              name="nameAr"
              type="text"
              required
              dir="rtl"
              className="w-full rounded-lg border p-3"
              placeholder="إسبريسو"
            />
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
              defaultValue="0"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Save Drink
          </button>
        </div>
      </form>
    </div>
  );
}