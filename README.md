# Tech Hub Canada Redesign

Documentation version: 2026.07.13.10

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

## Project Documentation

- `docs/medusa-only-realtime.md` - Medusa-only SSE architecture for live storefront updates without external realtime services.
- `docs/medusa-notifications.md` - Medusa local notification, Resend email, and Slack order alert setup.
- `docs/medusa-content-cms.md` - Medusa Content CMS plugin setup, public content routes, and storefront data helper usage.
- `docs/commerce-extensions-roadmap.md` - Product reviews API details and storefront rollout plan for the next commerce extensions.
- `docs/marketplace-accounts.md` - Managed seller account links for Best Buy, Amazon, and other external storefronts.
- `docs/square-oauth.md` - Square production and sandbox OAuth plus Apple Pay domain setup notes.
- `docs/storefront-seo.md` - Storefront metadata, sitemap, robots, structured data, and indexing policy.
- `docs/superpowers/plans/2026-07-08-medusa-only-realtime-storefront.md` - Implementation plan for the Medusa-only realtime storefront work.

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
- `AUTH_MFA_ENCRYPTION_KEY`
- `STRIPE_API_KEY`
- `NEXT_PUBLIC_STRIPE_KEY`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `CONTACT_INQUIRY_TO`
- `SLACK_WEBHOOK_URL`
- `SLACK_ADMIN_URL`
- `MEILISEARCH_MASTER_KEY`
- `MEILISEARCH_HOST`
- `MEILISEARCH_API_KEY`
- `NEXT_PUBLIC_SEARCH_API_KEY`

### Railway MeiliSearch

For the Railway `Techhub` service, `MEILISEARCH_HOST` should point at the Railway MeiliSearch public HTTPS URL, and `MEILISEARCH_API_KEY` should match the running MeiliSearch service `MEILI_MASTER_KEY`. Do not set `MEILISEARCH_PORT` when `MEILISEARCH_HOST` is already a full Railway HTTPS URL; the backend config will otherwise append that port to the public URL.

Storefront search uses `NEXT_PUBLIC_SEARCH_ENDPOINT` and `NEXT_PUBLIC_SEARCH_API_KEY`. The public key must be a MeiliSearch key with the `search` action. Product indexing must tolerate products without a collection, because production catalog entries can be published before collection assignment.

### Auth MFA

Set `AUTH_MFA_ENCRYPTION_KEY` in local backend env files and every production backend service that can run auth code. Use a long random secret such as `openssl rand -hex 32`, keep the same value on the server and worker, and do not rotate it after users enroll MFA because TOTP secrets are encrypted with this key.

### Storefront inquiry email

The storefront `/inquiry` form posts to `/api/inquiry` and sends mail through Resend. Configure `RESEND_API_KEY`, `RESEND_FROM`, and optionally `CONTACT_INQUIRY_TO` in the storefront deployment environment. If `CONTACT_INQUIRY_TO` is not set, inquiries are sent to `info@techhubcanada.com`.

### Cloudflare R2 File Storage

Medusa uses the S3-compatible file provider for product images and uploaded files. Local development can use the MinIO values in `medusa/.env.template`; production should set Cloudflare R2 values in Railway for the Medusa service.

Use these variables in Railway:

```env
S3_FILE_URL=https://YOUR_PUBLIC_R2_DEV_OR_CUSTOM_DOMAIN
S3_ACCESS_KEY_ID=YOUR_R2_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY=YOUR_R2_SECRET_ACCESS_KEY
S3_REGION=auto
S3_BUCKET=YOUR_R2_BUCKET
S3_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=true
```

`S3_FILE_URL` must be the public bucket URL, such as the Cloudflare `r2.dev` public URL or a custom domain like `https://files.techhubcanada.com`. Do not use the private `r2.cloudflarestorage.com` API endpoint for `S3_FILE_URL`.

`S3_ENDPOINT` must be the private R2 S3 API endpoint without the bucket path:

```env
S3_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

## Agent Change Documentation Policy

All repository changes must keep README files, documentation, version markers, and reusable agent skills in sync. See `docs/agent-change-policy.md` for the required workflow. Gortex MCP navigation expectations are documented in `docs/gortex-agent-workflow.md`.

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

## Vercel Storefront Builds

Vercel builds the storefront from the monorepo root using `vercel.json`. The build contract is:

```sh
corepack enable && pnpm install --frozen-lockfile
pnpm --filter @techhub/storefront build
```

Keep packages required by `storefront/next.config.js` in storefront `dependencies`, not only `devDependencies`, because the config is loaded during production builds.

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
- Customer trust: after-sales support, returns policy, contact information, current store hours, and customer testimonials.
- Ecommerce flows: product listing, product details, cart, checkout, order confirmation, and customer account pages.

## Design Direction

The redesigned experience should feel practical, trustworthy, and easy to scan. This is an electronics and IT services storefront, so the interface should prioritize clear product categories, search, filters, product specs, pricing, service calls to action, and support information over decorative marketing sections.

## Brand Voice

Use **TechHub** for customer-facing website copy, navigation, metadata, email templates, and UI text. Use **Tech Hub Canada** only for legal/company context, source project naming, legacy documentation, or domain/business listing references that require the longer name.

## License

This project includes code from the imported Medusa starter. See `LICENSE`, `medusa/package.json`, and `storefront/LICENSE` for package and starter licensing details.
