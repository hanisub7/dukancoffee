import { createCategory } from "../../../actions/category";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Category</h1>

        <p className="mt-2 text-gray-600">
          Create a coffee machine category.
        </p>
      </div>

      <form
        action={createCategory}
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
              placeholder="Automatic Coffee Machines"
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
              placeholder="ماكينات القهوة الأوتوماتيكية"
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
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
}