export type CatalogDocument = {
  productSlug: string;
  title: string;
  url: string;
  documentType:
    | "MANUAL"
    | "QUICK_START"
    | "WARRANTY"
    | "SPEC_SHEET"
    | "ENERGY_LABEL"
    | "CLEANING_GUIDE";
  language: string;
};

export const catalogDocuments: CatalogDocument[] = [
  {
    productSlug: "philips-series-2200-ep2220-14",
    title: "Philips Series 2200 EP2220/14 Specification Sheet",
    url:
      "https://www.documents.philips.com/assets/20220125/d60b6f75ed874705b41dae2800b68a71.pdf",
    documentType: "SPEC_SHEET",
    language: "en",
  },
  {
    productSlug: "philips-series-2200-ep2220-14",
    title: "Philips Series 2200 Quick Start Guide",
    url:
      "https://dam.versuni.com/m/5b234cb511f92da/original/Quick-Start-Guide-Philips-800-Series-full-automatic-espresso-machine-EP0824-EP0820-EP0810.pdf",
    documentType: "QUICK_START",
    language: "multi",
  },
];