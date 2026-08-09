export type CatalogProduct = {
  brandSlug: string;
  familySlug: string;
  categorySlug: string;

  model: string;
  fullName: string;
  slug: string;
  modelNumber: string | null;

  officialProductUrl: string;
};

export const catalogProducts: CatalogProduct[] = [
  {
    brandSlug: "delonghi",
    familySlug: "delonghi-magnifica-evo",
    categorySlug: "fully-automatic",

    model: "Magnifica Evo",
    fullName: "De'Longhi Magnifica Evo ECAM290.81.TB",
    slug: "delonghi-magnifica-evo-ecam290-81-tb",
    modelNumber: "ECAM290.81.TB",

    officialProductUrl:
      "https://www.delonghi.com/en/p/magnifica-evo-ecam290.81.tb-magnifica-evo-automatic-espresso-machine/ECAM290.81.TB.html",
  },

  {
    brandSlug: "philips",
    familySlug: "philips-series-2200",
    categorySlug: "fully-automatic",

    model: "Series 2200",
    fullName: "Philips Series 2200 EP2220/14",
    slug: "philips-series-2200-ep2220-14",
    modelNumber: "EP2220/14",

    officialProductUrl:
      "https://www.usa.philips.com/c-p/EP2220_14/series-2200-fully-automatic-espresso-machines",
  },

 {
  brandSlug: "philips",
  familySlug: "philips-series-3200",
  categorySlug: "fully-automatic",

  model: "Series 3200 LatteGo",
  fullName: "Philips Series 3200 LatteGo EP3246/70",
  slug: "philips-series-3200-lattego-ep3246-70",
  modelNumber: "EP3246/70",

  officialProductUrl:
    "https://www.philips.ae/c-p/EP3246_70/series-3200-fully-automatic-espresso-machines",
},

  {
    brandSlug: "breville",
    familySlug: "breville-barista-express",
    categorySlug: "espresso-machines",

    model: "Barista Express",
    fullName: "Breville Barista Express BES870",
    slug: "breville-barista-express-bes870",
    modelNumber: "BES870",

    officialProductUrl:
      "https://www.breville.com/en-us/product/bes870",
  },

  {
    brandSlug: "breville",
    familySlug: "breville-oracle-touch",
    categorySlug: "espresso-machines",

    model: "Oracle Touch",
    fullName: "Breville Oracle Touch BES990",
    slug: "breville-oracle-touch-bes990",
    modelNumber: "BES990",

    officialProductUrl:
      "https://www.breville.com/en-us/product/bes990",
  },
];