export type CatalogImage = {
  productSlug: string;
  url: string;
  altText: string;
  imageType: "MAIN" | "FRONT" | "SIDE" | "BACK" | "LIFESTYLE" | "PACKAGE";
  sortOrder: number;
  sourceUrl: string;
};

export const catalogImages: CatalogImage[] = [
  {
    productSlug: "philips-series-2200-ep2220-14",

    url:
      "https://images.philips.com/is/image/philipsconsumer/vrs_514c6884_aac0_4140_950b6d8d713ef25f?%24png%24=&fit=constrain&hei=410&wid=410",

    altText:
      "Philips Series 2200 EP2220/14 fully automatic coffee machine",

    imageType: "MAIN",
    sortOrder: 0,

    sourceUrl:
      "https://www.usa.philips.com/c-p/EP2220_14/series-2200-fully-automatic-espresso-machines",
  },

{
  productSlug: "philips-series-3200-lattego-ep3246-70",

  url:
    "https://images.philips.com/is/image/philipsconsumer/vrs_0b87d090_b278_4129_862ea982e06c77dd?%24pnglarge%24=&hei=700&wid=700",

  altText:
    "Philips Series 3200 LatteGo EP3246/70 fully automatic coffee machine",

  imageType: "MAIN",
  sortOrder: 0,

  sourceUrl:
    "https://www.philips.ae/c-p/EP3246_70/series-3200-fully-automatic-espresso-machines",
},
{
  productSlug: "breville-barista-express-bes870",

  url:
    "https://assets.breville.com/cdn-cgi/image/width%3D1300%2Cformat%3Dauto/Dynamic_Bundle/US/BES870XL_Transparent_1300x1300.png?pdp=",

  altText:
    "Breville Barista Express BES870 espresso machine",

  imageType: "MAIN",
  sortOrder: 0,

  sourceUrl:
    "https://www.breville.com/en-us/product/bes870",
},
{
  productSlug: "breville-oracle-touch-bes990",

  url:
    "https://assets.breville.com/cdn-cgi/image/width%3D1300%2Cformat%3Dauto/BES990/BES990BSS/BES990BSS_1300x1300.png?pdp=",

  altText:
    "Breville Oracle Touch BES990 espresso machine",

  imageType: "MAIN",
  sortOrder: 0,

  sourceUrl:
    "https://www.breville.com/en-us/product/bes990",
},
{
  productSlug: "delonghi-magnifica-evo-ecam290-81-tb",

  url:
    "https://dam.delonghi.com/902x902/assets/225627",

  altText:
    "De'Longhi Magnifica Evo ECAM290.81.TB automatic coffee machine",

  imageType: "MAIN",
  sortOrder: 0,

  sourceUrl:
    "https://www.delonghi.com/en/p/magnifica-evo-ecam290.81.tb-magnifica-evo-automatic-espresso-machine/ECAM290.81.TB.html",
},

];