import "dotenv/config";

import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

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
] as const;

const categories = [
  {
    slug: "espresso-machines",
    nameEn: "Espresso Machines",
    nameAr: "آلات الإسبريسو",
    sortOrder: 1,
  },
  {
    slug: "fully-automatic",
    nameEn: "Fully Automatic Coffee Machines",
    nameAr: "آلات القهوة الأوتوماتيكية بالكامل",
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
    nameEn: "Capsule Coffee Machines",
    nameAr: "آلات القهوة بالكبسولات",
    sortOrder: 4,
  },
] as const;

const adminEmail =
  process.env.SEED_ADMIN_EMAIL ?? "admin@dukancoffee.com";

const adminPassword =
  process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

async function seedCountries(): Promise<void> {
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
      create: {
        ...country,
      },
    });
  }
}

async function seedCategories(): Promise<void> {
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
}

async function seedAdminUser(): Promise<void> {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email: adminEmail,
    },
    select: {
      id: true,
    },
  });

  if (existingAdmin) {
    await prisma.adminUser.update({
      where: {
        id: existingAdmin.id,
      },
      data: {
        fullName: "DukanCoffee Admin",
        role: "SUPER_ADMIN",
        active: true,
      },
    });

    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      fullName: "DukanCoffee Admin",
      role: "SUPER_ADMIN",
      active: true,
    },
  });
}

async function main(): Promise<void> {
  console.log("Starting DukanCoffee database seed...");

  await seedCountries();
  await seedCategories();
  await seedAdminUser();

  console.log("Seed completed successfully.");
  console.log(`Countries processed: ${countries.length}`);
  console.log(`Categories processed: ${categories.length}`);
  console.log(`Admin account processed: ${adminEmail}`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:");

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });