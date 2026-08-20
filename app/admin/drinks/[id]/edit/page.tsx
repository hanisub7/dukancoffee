import { notFound } from "next/navigation";

import { updateDrink } from "@/app/actions/drink";
import { prisma } from "@/app/lib/prisma";

type EditDrinkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDrinkPage({
  params,
}: EditDrinkPageProps) {
  const { id } = await params;

  const drink = await prisma.drink.findUnique({
    where: {
      id,
    },
  });

  if (!drink) {
    notFound();
  }

  const updateDrinkAction = updateDrink.bind(null, drink.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Drink</h1>

        <p className="mt-2 text-gray-600">
          Update this coffee machine drink.
        </p>
      </div>

      <form
        action={updateDrinkAction}
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
              defaultValue={drink.nameEn}
              className="w-full rounded-lg border p-3"
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
              defaultValue={drink.nameAr}
              className="w-full rounded-lg border p-3"
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
              required
              defaultValue={drink.sortOrder}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              name="active"
              type="checkbox"
              defaultChecked={drink.active}
              className="h-4 w-4"
            />

            <span className="font-medium">
              Active
            </span>
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}