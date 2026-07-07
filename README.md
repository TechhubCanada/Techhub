# Tech Hub Canada Redesign

This repository contains the redesign work for the Tech Hub Canada ecommerce website.

The goal is to modernize the existing Tech Hub Canada shopping experience while keeping the business focus clear: computers, printers, tablets, networking equipment, software, toners and ink cartridges, computer parts, accessories, technical support, web development, service, and repairs.

Reference website: https://www.techhubcanada.com/

## Project Goals

- Build a cleaner, faster ecommerce storefront for Tech Hub Canada.
- Preserve the existing product and service categories customers already recognize.
- Support product discovery across popular electronics categories such as laptops, desktops, monitors, printers, networking hardware, cartridges, and accessories.
- Give service offerings clearer placement beside the online shop.
- Prepare the project for a headless ecommerce workflow using Medusa and Next.js.

## Tech Stack

This project is based on a Medusa 2 ecommerce starter and is organized as a pnpm + Turborepo monorepo with two applications:

- `medusa/` - Medusa backend for products, orders, admin, payments, search, email, and storage.
- `storefront/` - Next.js storefront for the customer-facing ecommerce website.

Supporting services include:

- PostgreSQL for backend data.
- Redis for backend infrastructure.
- MinIO for local S3-compatible file storage.
- Meilisearch for product search.
- Stripe and PayPal integration hooks for payments.
- Resend integration hooks for transactional email.

## Repository Structure

```text
.
├── medusa/       # Medusa 2 backend
├── storefront/   # Next.js storefront
├── media/        # Starter screenshots and media assets
├── .github/      # GitHub templates and workflows
├── turbo.json    # Turborepo task pipeline
├── package.json  # Root workspace scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md     # Project overview and setup
```

## Prerequisites

- Node.js 20 or newer
- pnpm / Corepack
- Docker and Docker Compose

Enable Corepack before installing dependencies:

```sh
corepack enable
```

## Local Development

Install dependencies from the repository root:

```sh
pnpm install
```

### 1. Configure Environment Files

```sh
cp medusa/.env.template medusa/.env
cp storefront/.env.template storefront/.env.local
```

### 2. Start Local Infrastructure

```sh
cd medusa
docker compose up -d
```

### 3. Seed The Backend

```sh
pnpm seed
```

### 4. Run The Monorepo

From the repository root:

```sh
pnpm dev
```

You can also run each app separately:

```sh
pnpm dev:medusa
pnpm dev:storefront
```

The Medusa backend runs at:

```text
http://localhost:9000
```

The storefront runs at:

```text
http://localhost:8000
```

## Environment Files

Backend environment template:

```text
medusa/.env.template
```

Storefront environment template:

```text
storefront/.env.template
```

Important values to configure before production:

- `DATABASE_URL`
- `JWT_SECRET`
- `COOKIE_SECRET`
- `STRIPE_API_KEY`
- `NEXT_PUBLIC_STRIPE_KEY`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `MEILISEARCH_MASTER_KEY`
- `NEXT_PUBLIC_SEARCH_API_KEY`

## Useful Commands

Root monorepo commands:

```sh
pnpm dev
pnpm build
pnpm lint
pnpm seed
pnpm test:medusa
pnpm test:e2e
```

App-specific commands:

```sh
pnpm dev:medusa
pnpm dev:storefront
pnpm build:medusa
pnpm build:storefront
```

## Redesign Notes

The current Tech Hub Canada website presents a broad electronics catalog and customer-support business. The redesign should keep those business pillars visible:

- Shop categories: computers, printers, tablets, handheld devices, networking, software, toner, ink cartridges, parts, and accessories.
- Services: technical support, web development, service, and repairs.
- Customer trust: after-sales support, returns policy, contact information, and customer testimonials.
- Ecommerce flows: product listing, product details, cart, checkout, order confirmation, and customer account pages.

## Design Direction

The redesigned experience should feel practical, trustworthy, and easy to scan. This is an electronics and IT services storefront, so the interface should prioritize clear product categories, search, filters, product specs, pricing, service calls to action, and support information over decorative marketing sections.

## License

This project includes code from the imported Medusa starter. See `LICENSE`, `medusa/package.json`, and `storefront/LICENSE` for package and starter licensing details.
