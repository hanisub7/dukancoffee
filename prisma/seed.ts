import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcrypt";


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const countries = [
  {
    nameEn: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    code: "SA",
    currencyCode: "SAR",
    localeEn: "en-SA",
    localeAr: "ar-SA",
    enabled: true,
  },
  {
    nameEn: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    code: "AE",
    currencyCode: "AED",
    localeEn: "en-AE",
    localeAr: "ar-AE",
    enabled: false,
  },
  {
    nameEn: "Qatar",
    nameAr: "قطر",
    code: "QA",
    currencyCode: "QAR",
    localeEn: "en-QA",
    localeAr: "ar-QA",
    enabled: false,
  },
  {
    nameEn: "Kuwait",
    nameAr: "الكويت",
    code: "KW",
    currencyCode: "KWD",
    localeEn: "en-KW",
    localeAr: "ar-KW",
    enabled: false,
  },
  {
    nameEn: "Bahrain",
    nameAr: "البحرين",
    code: "BH",
    currencyCode: "BHD",
    localeEn: "en-BH",
    localeAr: "ar-BH",
    enabled: false,
  },
  {
    nameEn: "Oman",
    nameAr: "عُمان",
    code: "OM",
    currencyCode: "OMR",
    localeEn: "en-OM",
    localeAr: "ar-OM",
    enabled: false,
  },
];

const categories = [
  {
    slug: "espresso-machines",
    nameEn: "Espresso Machines",
    nameAr: "آلات الإسبريسو",
    sortOrder: 1,
  },
  {
    slug: "fully-automatic",
    nameEn: "Fully Automatic",
    nameAr: "آلات أوتوماتيكية بالكامل",
    sortOrder: 2,
  },
  {
    slug: "coffee-grinders",
    nameEn: "Coffee Grinders",
    nameAr: "مطاحن القهوة",
    sortOrder: 3,
  },
  {
    slug: "capsule-machines",
    nameEn: "Capsule Machines",
    nameAr: "آلات الكبسولات",
    sortOrder: 4,
  },
];

async function main() {
  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        code: country.code,
      },
      update: {
        nameEn: country.nameEn,
        nameAr: country.nameAr,
        currencyCode: country.currencyCode,
        localeEn: country.localeEn,
        localeAr: country.localeAr,
        enabled: country.enabled,
      },
      create: country,
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        nameEn: category.nameEn,
        nameAr: category.nameAr,
        sortOrder: category.sortOrder,
        active: true,
      },
      create: {
        ...category,
        active: true,
      },
    });
  }

  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 12);

await prisma.adminUser.upsert({
  where: {
    email: "admin@dukancoffee.com",
  },
  update: {
    passwordHash: adminPasswordHash,
    fullName: "DukanCoffee Admin",
    role: "SUPER_ADMIN",
    active: true,
  },
  create: {
    email: "admin@dukancoffee.com",
    passwordHash: adminPasswordHash,
    fullName: "DukanCoffee Admin",
    role: "SUPER_ADMIN",
    active: true,
  },
});

  console.log("Seed completed successfully.");
  console.log(`Countries processed: ${countries.length}`);
  console.log(`Categories processed: ${categories.length}`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });