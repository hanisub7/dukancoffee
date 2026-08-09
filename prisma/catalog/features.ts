export type CatalogFeature = {
  slug: string;
  name: string;
  description: string | null;
};

export type CatalogProductFeature = {
  productSlug: string;
  featureSlugs: string[];
};

export const catalogFeatures: CatalogFeature[] = [
  {
    slug: "ceramic-grinder",
    name: "مطحنة سيراميكية",
    description:
      "مطحنة مدمجة مصنوعة من السيراميك لطحن حبوب القهوة.",
  },
  {
    slug: "12-grind-settings",
    name: "12 درجة طحن",
    description:
      "إمكانية ضبط درجة الطحن عبر 12 مستوى.",
  },
  {
    slug: "classic-milk-frother",
    name: "مخفّق حليب كلاسيكي",
    description:
      "مخفّق بخار يدوي لتحضير رغوة الحليب.",
  },
  {
    slug: "aquaclean-compatible",
    name: "متوافق مع AquaClean",
    description:
      "يدعم فلتر AquaClean للمساعدة في تقليل الترسبات.",
  },
  {
    slug: "removable-brew-group",
    name: "وحدة تحضير قابلة للإزالة",
    description:
      "يمكن إزالة وحدة التحضير لتسهيل التنظيف.",
  },
  {
    slug: "touch-display",
    name: "شاشة لمس",
    description:
      "واجهة لمس لاختيار المشروبات والإعدادات.",
  },
];

export const catalogProductFeatures: CatalogProductFeature[] = [
  {
    productSlug: "philips-series-2200-ep2220-14",
    featureSlugs: [
      "ceramic-grinder",
      "12-grind-settings",
      "classic-milk-frother",
      "aquaclean-compatible",
      "removable-brew-group",
      "touch-display",
    ],
  },
];