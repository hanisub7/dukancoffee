# DukanCoffee Architecture

## 1. Project Mission

DukanCoffee is a GCC-ready coffee machine comparison platform built around verified, structured, and objective product data.

The platform should help users compare coffee machines by technical specifications, availability, and country-specific offers without relying on unverified opinions, ratings, or unsupported recommendations.

> The most trusted coffee machine comparison platform in the GCC.

DukanCoffee should operate more like a structured product database than a traditional affiliate blog: **GSMArena for coffee machines in the GCC.**

---

## 2. Core Principles

### Facts only

DukanCoffee may publish official product names, model numbers, technical specifications, official features, box contents, manuals, warranty information, approved images, retail prices, availability, price history, verification dates, and source information.

It must not publish unsupported pros and cons, ratings, “best product” claims, personal opinions, subjective recommendations, guessed specifications, or claims such as “excellent coffee quality” or “very quiet.”

### Verifiable sources

Preferred sources, in order:

1. Manufacturer product page
2. Official product manual
3. Official specification sheet
4. Official warranty document
5. Approved retailer listing
6. Official affiliate API or product feed

> If we cannot verify it, we do not publish it.

### One product, many offers

A product exists once in the product catalog. Prices do not belong directly to the product. Each product may have multiple offers from different retailers and countries.

### GCC-ready from day one

The system must support:

| Country | Code | Currency |
|---|---|---|
| Saudi Arabia | SA | SAR |
| United Arab Emirates | AE | AED |
| Qatar | QA | QAR |
| Kuwait | KW | KWD |
| Bahrain | BH | BHD |
| Oman | OM | OMR |

Saudi Arabia may launch first, but the architecture must support all GCC countries without redesign.

### Arabic and English

The application must support English and Arabic, including left-to-right and right-to-left layouts. English should be the primary internal data language where manufacturer information is most consistently available. Arabic translations should be stored separately from canonical product data.

### Structured data first

Use numbers, booleans, enums, relations, lists, and translation records whenever possible. Avoid storing long paragraphs when information can be represented structurally.

### No hardcoded business data

Countries, currencies, categories, brands, retailers, features, and product types must come from the database rather than being hardcoded in application logic.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js |
| Database hosting | Supabase |
| File storage | Supabase Storage |
| Deployment | Vercel |
| Price charts | Recharts |
| Validation | Zod |

Technical rules:

- Keep TypeScript strict mode enabled.
- Apply every database change through Prisma migrations.
- Validate all server actions and API requests.
- Client validation improves usability but never replaces server validation.
- Keep business logic out of presentation components.
- Store secrets only in environment variables.

---

## 4. High-Level Architecture

```text
Countries
    |
Retailers
    |
Offers
    |
Products
    |-- Brands
    |-- Categories
    |-- Specifications
    |-- Features
    |-- Box Contents
    |-- Images
    |-- Documents
    |-- Sources
    |-- Translations
    |
Price History
```

Key rule:

```text
Product != Price
```

A product contains reusable factual information. An offer contains the retailer, country, price, currency, availability, product URL, affiliate URL, and last checked time.

---

## 5. Recommended Folder Structure

```text
dukancoffee/
|
|-- app/
|   |-- [locale]/
|   |   |-- [country]/
|   |   |   |-- (public)/
|   |   |   |-- products/
|   |   |   |-- categories/
|   |   |   |-- compare/
|   |   |   `-- search/
|   |   `-- admin/
|   |-- api/
|   `-- auth/
|
|-- components/
|   |-- ui/
|   |-- admin/
|   |-- product/
|   |-- comparison/
|   |-- offers/
|   |-- layout/
|   `-- forms/
|
|-- lib/
|   |-- auth/
|   |-- db/
|   |-- validation/
|   |-- localization/
|   |-- countries/
|   |-- pricing/
|   |-- verification/
|   `-- utils/
|
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|
|-- public/
|-- scripts/
|-- types/
|-- tests/
|-- ARCHITECTURE.md
|-- README.md
`-- package.json
```

---

## 6. Naming Conventions

### Database

Use `snake_case`:

```text
product_offers
price_history
created_at
updated_at
country_code
```

### TypeScript

Use `camelCase`:

```text
productOffer
priceHistory
createdAt
updatedAt
countryCode
```

### React components

Use `PascalCase`:

```text
ProductCard.tsx
OfferTable.tsx
CountrySelector.tsx
PriceHistoryChart.tsx
```

### URLs

Use lowercase kebab-case slugs:

```text
delonghi-dinamica-plus-ecam370-95-t
```

Slugs are for readable URLs only. Database records must use immutable IDs.

---

## 7. Identifier and Metadata Strategy

Use UUIDs for primary keys.

Every major table should include:

```text
id
created_at
updated_at
```

Administrative tables should also support:

```text
created_by
updated_by
deleted_at
```

Use `deleted_at` for recoverable records such as products, brands, categories, retailers, and offers. Soft-deleted records must not appear publicly.

---

## 8. Core Database Entities

### 8.1 Countries

Suggested fields:

```text
id
name_en
name_ar
code
currency_code
locale_en
locale_ar
enabled
created_at
updated_at
```

Rules:

- `code` uses ISO 3166-1 alpha-2.
- `currency_code` uses ISO 4217.
- Country codes are unique.
- Disabled countries remain in the database but are hidden publicly.

### 8.2 Retailers

Suggested fields:

```text
id
name
slug
website_url
logo_url
country_id
affiliate_program_status
price_update_method
active
created_at
updated_at
deleted_at
```

Price update methods:

- Manual
- API
- Affiliate feed
- Approved integration

Create country-specific retailer records when market offers differ, such as Amazon Saudi and Amazon UAE.

### 8.3 Brands

Suggested fields:

```text
id
name
slug
logo_url
official_website_url
active
created_at
updated_at
deleted_at
```

Store a country of origin only when officially confirmed.

### 8.4 Categories

Suggested fields:

```text
id
slug
name_en
name_ar
active
sort_order
created_at
updated_at
deleted_at
```

Initial categories:

- Espresso Machines
- Fully Automatic
- Coffee Grinders
- Capsule Machines

Categories must not be hardcoded into application logic.

### 8.5 Products

Suggested fields:

```text
id
brand_id
category_id
model
full_name
slug
model_number
release_year
status
official_product_url
manual_url
warranty_url
last_verified_at
created_at
updated_at
created_by
updated_by
deleted_at
```

Product statuses:

- Draft
- Review
- Published
- Archived

Rules:

- Product names may change; IDs never change.
- Unknown values remain null.
- Never guess missing specifications.
- A product cannot be published without at least one reliable source.

### 8.6 Product Specifications

Suggested fields:

```text
id
product_id
machine_type
pump_pressure_bar
water_tank_l
bean_hopper_g
grounds_container_capacity
grinder_type
grinder_material
grind_settings
power_w
voltage
width_mm
height_mm
depth_mm
weight_kg
milk_system
display_type
created_at
updated_at
```

Canonical units:

- Capacity: liters or grams
- Dimensions: millimeters
- Weight: kilograms
- Power: watts
- Pressure: bar

Pump pressure may be displayed as an official specification but must not automatically be treated as a quality indicator.

### 8.7 Product Features

Suggested model:

```text
id
product_id
feature_key
boolean_value
text_value
number_value
source_id
created_at
updated_at
```

Example feature keys:

- built_in_grinder
- touchscreen
- automatic_milk_frothing
- manual_steam_wand
- pre_ground_coffee_support
- adjustable_temperature
- adjustable_strength
- removable_brew_group
- automatic_cleaning
- descaling_program
- water_filter_compatible
- wifi
- bluetooth
- mobile_app

### 8.8 Box Contents

Suggested fields:

```text
id
product_id
item_en
item_ar
source_id
sort_order
created_at
updated_at
```

Only include items confirmed by an official source.

### 8.9 Product Images

Suggested fields:

```text
id
product_id
image_url
alt_text_en
alt_text_ar
image_type
sort_order
source_url
usage_rights_note
created_at
updated_at
```

Image types may include Main, Front, Side, Back, Accessories, and Packaging.

Rules:

- Do not store binary image files in PostgreSQL.
- Store files in approved cloud storage.
- Only use images the project is permitted to display.

### 8.10 Documents

Suggested fields:

```text
id
product_id
document_type
title_en
title_ar
url
language_code
source_id
created_at
updated_at
```

Document types include user manuals, quick-start guides, warranty documents, and specification sheets.

### 8.11 Sources

Suggested fields:

```text
id
product_id
source_type
source_url
information_covered
verified_at
notes
created_at
updated_at
created_by
```

Source types:

- Manufacturer page
- Official manual
- Specification sheet
- Warranty document
- Retailer page
- Affiliate API
- Product feed

### 8.12 Product Offers

Suggested fields:

```text
id
product_id
retailer_id
country_id
currency_code
current_price
previous_price
availability
product_url
affiliate_url
data_source
active
checked_at
price_changed_at
created_at
updated_at
deleted_at
```

Rules:

- Price must be greater than zero.
- Currency must match the country or an explicitly supported retailer currency.
- `checked_at` updates after every successful check.
- `price_changed_at` updates only when the price changes.
- The retailer checkout price is always final.
- The public website must show when the price was last checked.

Availability values:

- In stock
- Out of stock
- Limited availability
- Preorder
- Unknown

### 8.13 Price History

Suggested fields:

```text
id
offer_id
price
currency_code
recorded_at
source
created_at
```

Rules:

- Create a new history record only when the price changes.
- Never overwrite previous history.
- Store price history per offer, not only per product.

### 8.14 Translations

Suggested fields:

```text
id
entity_type
entity_id
field_name
locale
translated_value
created_at
updated_at
```

This allows future languages without changing core product tables.

### 8.15 Users and Roles

Initial roles:

| Role | Access |
|---|---|
| Super Admin | Full access |
| Editor | Products, specifications, sources, offers |
| Translator | Translation fields only |
| Price Manager | Offers and price history |
| Viewer | Read-only admin access |

Version 1 may begin with a single Super Admin account.

### 8.16 Audit Logs

Suggested fields:

```text
id
user_id
entity_type
entity_id
action
old_value
new_value
created_at
```

Track product publication, price changes, specification changes, offer activation, deletion, and translation updates.

---

## 9. Product Publishing Workflow

```text
Create product
    |
Add basic information
    |
Add official sources
    |
Add specifications
    |
Add features
    |
Add box contents
    |
Add approved images
    |
Add offers
    |
Review information
    |
Publish
```

Minimum publication checks:

- Product name
- Brand
- Category
- Model or model number
- At least one official source
- At least one approved image
- Last verified date
- Valid slug
- No duplicate model number within the same brand

Offers are optional for publishing product specifications.

---

## 10. Verification System

Track verification status for manufacturer specifications, manuals, warranty, images, offers, and the last full verification.

A verification score may be calculated for internal use:

| Verification item | Weight |
|---|---:|
| Manufacturer page | 25% |
| Official manual | 25% |
| Specifications verified | 20% |
| Images verified | 10% |
| Warranty verified | 10% |
| Offers recently checked | 10% |

The score represents data completeness and freshness, not product quality.

---

## 11. Price Update Policy

### Initial stage

- Manual price entry
- Manual verification
- Show `checked_at` publicly

### Early automation

- Check prices every 12 hours
- Use approved APIs, feeds, or integrations only
- Avoid unauthorized aggressive scraping

### Growth stage

- Normal products: every 4–6 hours
- High-interest products: every 1–2 hours when supported
- Sale periods: temporarily increase frequency when the source permits it

### Update behavior

After a price check:

1. Update `checked_at`.
2. Compare the new price with `current_price`.
3. If unchanged, do not create a price-history record.
4. If changed:
   - Copy `current_price` to `previous_price`.
   - Save the new `current_price`.
   - Update `price_changed_at`.
   - Add a `price_history` record.
   - Add an audit log entry.

---

## 12. Country and Language Routing

Recommended URL structure:

```text
/{locale}/{country}/
```

Examples:

```text
/en/sa/
/ar/sa/
/en/ae/
/ar/qa/
```

Product example:

```text
/en/sa/products/delonghi-dinamica-plus
/ar/sa/products/delonghi-dinamica-plus
```

Rules:

- Locale and country must be explicit in canonical URLs.
- Approximate location may suggest a country.
- Users must always be able to change country manually.
- Store the selected country and language in a cookie.
- Do not force a country based only on IP detection.
- When no local offers exist, still show product specifications.

Example:

> No local offers are currently available in Qatar.

---

## 13. Admin Dashboard

Initial routes:

```text
/admin
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/brands
/admin/categories
/admin/countries
/admin/retailers
/admin/offers
/admin/price-history
/admin/sources
/admin/documents
```

Dashboard summary:

- Total products
- Products by status
- Total brands
- Total retailers
- Offers needing review
- Stale prices
- Products not recently verified
- Recent price changes

Initial stale-price indicators:

- Fresh: checked within 12 hours
- Warning: older than 24 hours
- Critical: older than 48 hours

These values should be configurable.

---

## 14. Validation Rules

Reject:

- Negative prices
- Zero or negative weight
- Negative capacity
- Invalid country codes
- Invalid currency codes
- Duplicate slugs
- Duplicate model numbers within the same brand
- Invalid URLs
- Unsupported publication status
- Publication without a required source

Unknown values remain empty instead of being guessed.

---

## 15. Security Standards

- Protect every admin route.
- Use role-based authorization.
- Validate every server action and API request.
- Never trust client-submitted IDs or prices.
- Use Prisma for parameterized database access.
- Keep secrets out of Git.
- Use environment variables for credentials.
- Restrict storage upload permissions.
- Log sensitive administrative changes.
- Apply rate limits to public search and API endpoints when needed.

---

## 16. SEO and Structured Data

Product pages should support:

- Unique titles
- Unique meta descriptions
- Canonical URLs
- Language alternates
- Country-specific routes
- Accurate product structured data
- Accurate offer structured data
- Breadcrumbs
- Image alt text
- Last updated date

Do not expose stale prices as current structured data.

---

## 17. Version 1 Scope

### Included

- Authentication
- Admin dashboard
- Products
- Brands
- Categories
- Countries
- Retailers
- Sources
- Specifications
- Features
- Images
- Documents
- Manual offers
- Price history
- Public product pages
- Country selection
- Arabic and English
- Search
- Filters
- Product comparison
- GCC-ready architecture

### Excluded for now

- AI recommendations
- Public user accounts
- User reviews
- Favorites
- Price alerts
- Mobile application
- Seller dashboards
- Community features
- Coupons
- Marketplace checkout
- User-generated content

---

## 18. Development Roadmap

### Milestone 1 — Foundation

- Confirm the current Next.js project
- Enable TypeScript strict mode
- Configure Tailwind CSS
- Configure Supabase
- Configure Prisma
- Configure environment variables
- Verify local development
- Verify Vercel deployment

### Milestone 2 — Database

- Create the Prisma schema
- Create the first migration
- Seed GCC countries
- Seed initial categories
- Add the admin user
- Test relations and constraints

### Milestone 3 — Authentication

- Configure Auth.js
- Protect admin routes
- Add role checks
- Add a secure login flow

### Milestone 4 — Admin Dashboard

- Products
- Brands
- Categories
- Countries
- Retailers
- Sources
- Offers
- Price history

### Milestone 5 — Public Website

- Homepage
- Category pages
- Search
- Filters
- Product pages
- Country-specific offers
- Arabic and English layouts

### Milestone 6 — Comparison

- Select products
- Compare structured specifications
- Show country-specific prices
- Exclude subjective ratings

### Milestone 7 — Price Automation

- Connect approved retailer APIs or feeds
- Schedule checks
- Record price history
- Detect stale offers
- Add monitoring and error logs

### Milestone 8 — GCC Expansion

- Enable UAE
- Enable Qatar
- Enable Kuwait
- Enable Bahrain
- Enable Oman

No database redesign should be required.

---

## 19. Architectural Decision Rules

Before adding a feature, ask:

1. Does it support verified data?
2. Does it work for multiple countries?
3. Does it work in Arabic and English?
4. Does it avoid hardcoded business logic?
5. Does it preserve one product with many offers?
6. Can it scale to thousands of products?
7. Can an administrator manage it without editing code?
8. Does it maintain source traceability?
9. Does it protect users from stale or misleading prices?
10. Does it belong in Version 1?

A feature that fails these checks should be redesigned or postponed.

---

## 20. Approved Decisions

- DukanCoffee is a GCC-ready platform.
- Saudi Arabia launches first.
- UAE, Qatar, Kuwait, Bahrain, and Oman are supported by design.
- The platform supports Arabic and English.
- Product information must be factual and verifiable.
- Pros and cons are excluded unless supported by a future transparent methodology.
- Ratings and subjective recommendations are excluded.
- Products and offers are separate entities.
- Multiple retailers are supported.
- Prices are stored per retailer and country.
- Price history is stored per offer.
- Initial price updates are manual.
- Future automation uses approved APIs, feeds, or integrations.
- Country and currency codes use international standards.
- The system uses PostgreSQL, Prisma, Next.js, TypeScript, Supabase, and Vercel.
- The admin dashboard manages all core data.
- The project includes source tracking and verification dates.
- The database must remain scalable and avoid hardcoded business data.

---

## 21. Document Maintenance

This file is the architectural source of truth for DukanCoffee.

Update it whenever there is an approved change to the mission, database design, naming standards, technology stack, country strategy, language strategy, verification rules, price update rules, security standards, or development scope.

All major code decisions should remain consistent with this document.
