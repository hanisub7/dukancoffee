export type CatalogSpecification = {
  productSlug: string;

  machineType: string | null;
  pumpPressureBar: number | null;
  waterTankL: number | null;
  beanHopperG: number | null;
  groundsContainerCapacity: number | null;

  grinderType: string | null;
  grinderMaterial: string | null;
  grindSettings: number | null;

  milkSystem: string | null;
  milkContainerCapacityL: number | null;

  displayType: string | null;

  powerW: number | null;
  voltage: string | null;
  frequencyHz: number | null;

  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  weightKg: number | null;

  removableWaterTank: boolean | null;
  removableBrewGroup: boolean | null;
  waterFilterCompatible: boolean | null;
};

export const catalogSpecifications: CatalogSpecification[] = [
  {
    productSlug: "philips-series-2200-ep2220-14",

    machineType: "آلة قهوة أوتوماتيكية بالكامل",
    pumpPressureBar: 15,
    waterTankL: 1.8,
    beanHopperG: 275,
    groundsContainerCapacity: 12,

    grinderType: "مطحنة مدمجة",
    grinderMaterial: "سيراميك",
    grindSettings: 12,

    milkSystem: "مخفّق حليب كلاسيكي",
    milkContainerCapacityL: null,

    displayType: "شاشة لمس",

    powerW: 230,
    voltage: "120 V",
    frequencyHz: 60,

    widthMm: 246,
    heightMm: 371,
    depthMm: 433,
    weightKg: 7.5,

    removableWaterTank: true,
    removableBrewGroup: true,
    waterFilterCompatible: true,
  },

  {
  productSlug: "philips-series-3200-lattego-ep3246-70",

  machineType: "آلة قهوة أوتوماتيكية بالكامل",
  pumpPressureBar: 15,
  waterTankL: 1.8,
  beanHopperG: 275,
  groundsContainerCapacity: null,

  grinderType: "مطحنة مدمجة",
  grinderMaterial: "سيراميك",
  grindSettings: 12,

  milkSystem: "LatteGo",
  milkContainerCapacityL: 0.26,

  displayType: "شاشة لمس سهلة الاستخدام",

  powerW: 1500,
  voltage: "230 V",
  frequencyHz: 50,

  widthMm: 246,
  heightMm: 433,
  depthMm: 371,
  weightKg: 8,

  removableWaterTank: true,
  removableBrewGroup: true,
  waterFilterCompatible: true,
},

{
  productSlug: "breville-barista-express-bes870",

  machineType: "آلة إسبريسو نصف أوتوماتيكية",
  pumpPressureBar: 15,
  waterTankL: 2.0,
  beanHopperG: 250,
  groundsContainerCapacity: null,

  grinderType: "مطحنة مخروطية مدمجة",
  grinderMaterial: "ستانلس ستيل",
  grindSettings: 16,

  milkSystem: "عصا تبخير يدوية",
  milkContainerCapacityL: null,

  displayType: null,

  powerW: 1600,
  voltage: "220–240 V",
  frequencyHz: 50,

  widthMm: 330,
  heightMm: 410,
  depthMm: 320,
  weightKg: 10.9,

  removableWaterTank: true,
  removableBrewGroup: false,
  waterFilterCompatible: true,
},

{
  productSlug: "breville-oracle-touch-bes990",

  machineType: "آلة إسبريسو نصف أوتوماتيكية",
  pumpPressureBar: 15,
  waterTankL: 2.5,
  beanHopperG: 280,
  groundsContainerCapacity: null,

  grinderType: "مطحنة مخروطية مدمجة",
  grinderMaterial: "ستانلس ستيل",
  grindSettings: 45,

  milkSystem: "تبخير أوتوماتيكي",
  milkContainerCapacityL: null,

  displayType: "شاشة لمس",

  powerW: 2400,
  voltage: "220–240 V",
  frequencyHz: 50,

  widthMm: 392,
  heightMm: 454,
  depthMm: 373,
  weightKg: 12.1,

  removableWaterTank: true,
  removableBrewGroup: false,
  waterFilterCompatible: true,
},

];