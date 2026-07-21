import Link from "next/link";

type RetailerOption = {
  id: string;
  name: string;
};

type OfferFormValues = {
  retailerId: string;
  currentPrice: string;
  originalPrice: string;
  currencyCode: string;
  productUrl: string;
  affiliateUrl: string;
  inStock: boolean;
};

type OfferFormProps = {
  productId: string;
  retailers: RetailerOption[];
  action: (formData: FormData) => void | Promise<void>;
  cancelHref: string;
  submitLabel: string;
  defaultValues?: OfferFormValues;
};

const emptyValues: OfferFormValues = {
  retailerId: "",
  currentPrice: "",
  originalPrice: "",
  currencyCode: "SAR",
  productUrl: "",
  affiliateUrl: "",
  inStock: true,
};

export default function OfferForm({
  productId,
  retailers,
  action,
  cancelHref,
  submitLabel,
  defaultValues = emptyValues,
}: OfferFormProps) {
  return (
    <form
      action={action}
      className="mt-8 space-y-6 rounded-xl border bg-white p-8 shadow-sm"
    >
      <input type="hidden" name="productId" value={productId} />

      <div>
        <label
          htmlFor="retailerId"
          className="block text-sm font-medium text-gray-700"
        >
          Retailer
        </label>

        <select
          id="retailerId"
          name="retailerId"
          required
          defaultValue={defaultValues.retailerId}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
        >
          <option value="" disabled>
            Select a retailer
          </option>

          {retailers.map((retailer) => (
            <option key={retailer.id} value={retailer.id}>
              {retailer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="currentPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Current Price
          </label>

          <input
            id="currentPrice"
            name="currentPrice"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.currentPrice}
            placeholder="2799.00"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Original Price
          </label>

          <input
            id="originalPrice"
            name="originalPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues.originalPrice}
            placeholder="2999.00"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />

          <p className="mt-2 text-sm text-gray-500">
            Optional. The discount is calculated automatically.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="currencyCode"
          className="block text-sm font-medium text-gray-700"
        >
          Currency
        </label>

        <select
          id="currencyCode"
          name="currencyCode"
          required
          defaultValue={defaultValues.currencyCode}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
        >
          <option value="SAR">SAR — Saudi Riyal</option>
          <option value="AED">AED — UAE Dirham</option>
          <option value="USD">USD — US Dollar</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="productUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Retailer Product URL
        </label>

        <input
          id="productUrl"
          name="productUrl"
          type="url"
          required
          defaultValue={defaultValues.productUrl}
          placeholder="https://www.retailer.com/product"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
        />
      </div>

      <div>
        <label
          htmlFor="affiliateUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Affiliate URL
        </label>

        <input
          id="affiliateUrl"
          name="affiliateUrl"
          type="url"
          defaultValue={defaultValues.affiliateUrl}
          placeholder="https://www.retailer.com/affiliate-link"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
        />

        <p className="mt-2 text-sm text-gray-500">
          Optional. Leave empty when no affiliate link is available.
        </p>
      </div>

      <div className="rounded-lg border bg-gray-50 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="inStock"
            value="true"
            defaultChecked={defaultValues.inStock}
            className="h-4 w-4 rounded border-gray-300"
          />

          <span>
            <span className="block font-medium">In Stock</span>

            <span className="block text-sm text-gray-500">
              The product is currently available from this retailer.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
        <Link
          href={cancelHref}
          className="rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}