export type CatalogSource = {
  productSlug: string;
  sourceType:
    | "MANUFACTURER_PAGE"
    | "OFFICIAL_MANUAL"
    | "SPECIFICATION_SHEET"
    | "WARRANTY_DOCUMENT"
    | "RETAILER_PAGE"
    | "AFFILIATE_API"
    | "PRODUCT_FEED";
  sourceUrl: string;
  informationCovered: string;
  verifiedAt: string;
  notes: string | null;
};

export const catalogSources: CatalogSource[] = [
  {
    productSlug: "philips-series-2200-ep2220-14",
    sourceType: "MANUFACTURER_PAGE",
    sourceUrl:
      "https://www.usa.philips.com/c-p/EP2220_14/series-2200-fully-automatic-espresso-machines",
    informationCovered:
      "هوية المنتج والميزات الأساسية وصور المنتج الرسمية",
    verifiedAt: "2026-08-02T00:00:00.000Z",
    notes: "صفحة المنتج الرسمية من Philips.",
  },
  {
    productSlug: "philips-series-2200-ep2220-14",
    sourceType: "SPECIFICATION_SHEET",
    sourceUrl:
      "https://www.documents.philips.com/assets/20220125/d60b6f75ed874705b41dae2800b68a71.pdf",
    informationCovered:
      "المواصفات الفنية والسعة والأبعاد والوزن والطاقة",
    verifiedAt: "2026-08-02T00:00:00.000Z",
    notes: "ورقة مواصفات رسمية من Philips.",
  },
  {
    productSlug: "philips-series-2200-ep2220-14",
    sourceType: "OFFICIAL_MANUAL",
    sourceUrl:
      "https://dam.versuni.com/m/5b234cb511f92da/original/Quick-Start-Guide-Philips-800-Series-full-automatic-espresso-machine-EP0824-EP0820-EP0810.pdf",
    informationCovered:
      "إرشادات البدء والتشغيل والتنظيف الأساسي",
    verifiedAt: "2026-08-02T00:00:00.000Z",
    notes: "دليل بدء سريع رسمي مستضاف من Versuni.",
  },
];