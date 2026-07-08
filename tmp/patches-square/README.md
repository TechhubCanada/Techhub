# @weareseeed/medusa-square-plugin

A full-featured Square integration plugin for Medusa v2. Handles payment processing, OAuth account linking, bidirectional catalog/customer/inventory sync, and Apple Pay domain registration — all configurable from the admin dashboard at runtime.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Admin UI](#admin-ui)
- [Storefront Integration](#storefront-integration)
- [Data Synchronization](#data-synchronization)
- [API Reference](#api-reference)
- [Workflows](#workflows)
- [Usage](#usage)

---

## Features

- **OAuth 2.0** — Secure merchant account linking via Square OAuth with encrypted token storage and automatic refresh
- **Payment Processing** — Full authorize → capture → cancel → refund flow via `AbstractPaymentProvider`
- **Location Support** — List and select which Square location processes payments
- **Bidirectional Sync** — Sync products, categories, customers, and inventory between Medusa and Square
- **Order Sync** — Create Square orders from Medusa cart data at payment time
- **Apple Pay** — Register a domain for Apple Pay support
- **Sandbox & Production** — Toggle between environments without redeployment
- **Database-driven Config** — All settings stored in the database; no restart required after changes

---

## Prerequisites

- Node.js >= 20
- Medusa v2.x (peer dependency)
- PostgreSQL (for plugin configuration table)
- Redis (recommended, for caching)
- A [Square Account](https://squareup.com/)

---

## Installation

```bash
yarn add @weareseeed/medusa-square-plugin
# or
npm install @weareseeed/medusa-square-plugin
```

### Register in `medusa-config.ts`

```typescript
import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  modules: [
    // Register Square as a payment provider
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@weareseeed/medusa-square-plugin/providers/square-payment",
            id: "square",
          },
        ],
      },
    },
  ],
  plugins: [
    {
      resolve: "@weareseeed/medusa-square-plugin",
      options: {},
    },
  ],
})
```

> No options are required. All configuration is managed through the Admin UI.

### Run Migrations

```bash
npx medusa db:migrate
```

This creates the `square_configuration` table used by the plugin.

---

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MEDUSA_BACKEND_URL` | Public URL of your Medusa backend, used as the OAuth redirect base | `http://localhost:9000` | Yes (production) |

```bash
# .env (development)
MEDUSA_BACKEND_URL=http://localhost:9000

# .env (production)
MEDUSA_BACKEND_URL=https://api.yourdomain.com
```

The OAuth callback will be registered at `{MEDUSA_BACKEND_URL}/admin/square/oauth`.

---

## Admin UI

After installing, a **Square** section appears under your Medusa Admin settings. It has three tabs:

### Account Tab

- **Connect / Disconnect** your Square account via OAuth
- Toggle between **Sandbox** and **Production** environments
- View linked account status
- **List your Square locations** and select which one processes payments

### Apple Pay Tab

- Register your storefront domain for Apple Pay
- View the currently registered domain

### Settings Tab

- Choose sync source of truth: **Medusa** or **Square**
- Orders (auto-created in Square at payment time)
- Toggle individual sync features:
  - Catalog (products and categories)
  - Customers
- Trigger a **manual sync** workflow
- Stop an in-progress sync

---

## Storefront Integration

Use [`react-square-web-payments-sdk`](https://www.npmjs.com/package/react-square-web-payments-sdk) — the official React wrapper around the Square Web Payments SDK, built by the same team — to collect payment details on your storefront.

### Install

```bash
yarn add react-square-web-payments-sdk
# or
npm install react-square-web-payments-sdk
```

### Fetch Public Config

Before rendering the payment form, fetch the public Square config from the store endpoint to get the `application_id` and `location_id`:

```
GET /store/square/config
```

Response:
```json
{
  "location_id": "XXXXXXXXX",
  "application_id": "xxxxx-xxxxxx-xxxxxxxxx",
  "currency": "XXX",
  "capabilities": [
    "CREDIT_CARD_PROCESSING",
    "AUTOMATIC_TRANSFERS"
  ]
}
```

### Basic Credit Card Form

Wrap your checkout with `PaymentForm` and drop in the `CreditCard` component. The SDK handles input rendering and tokenization.

```tsx
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk"
import { CartDTO } from "@medusajs/types";

const PAYMENT_PROVIDER_SQUARE = "pp_square_square";

interface SquareConfig {
  application_id: string
  location_id: string
  currency: string
}

export function SquareCheckout({ config , cart }: { config: SquareConfig , cart: CartDTO }) {
  return (
    <PaymentForm
      applicationId={config.application_id}
      locationId={config.location_id}
      cardTokenizeResponseReceived={async (token, buyer) => {
        // Pass it to your Medusa payment session
        await initiatePaymentSession(cart, {
          provider_id: PAYMENT_PROVIDER_SQUARE,
          data: { token, buyer, cart_id: cart?.id },
        });
      }}
      createPaymentRequest={() => {
        // Payment request configuration
        return {
          requestShippingAddress: false,
          requestBillingInfo: true,
          currencyCode: config.currency,
          countryCode:"US", // Store Country Code
          total: {
            label: "My Store",
            amount: cart.total.toString(),
          },
        };
      }}
    >
      <CreditCard />
    </PaymentForm>
  )
}
```

---

## Data Synchronization

The plugin supports bidirectional sync between Medusa and Square.

### Automatic (Real-time)

Event subscribers listen for Medusa events and push updates to Square:

| Medusa Event | Syncs To Square |
|-------------|-----------------|
| `product.created` / `product.updated` | Catalog item |
| `product_variant.created` / `product_variant.updated` | Catalog item variation |
| `product_category.created` / `product_category.updated` | Catalog category |
| `customer.created` / `customer.updated` | Customer |

These run only when `sync_catalog` / `sync_customers` are enabled in the config.

### Manual (Workflow-based)

Trigger from the Admin UI or programmatically:

**Medusa → Square** (`sync-medusa-square-workflow`)
- Syncs customers
- Syncs product categories
- Syncs products with images
- Syncs inventory levels per location

**Square → Medusa** (`sync-square-medusa-workflow`)
- Pulls catalog from Square
- Transforms and upserts products/categories into Medusa
- Updates inventory

### Using Workflows Programmatically

```typescript
import {
  syncMedusaSquareWorkflow,
  syncSquareMedusaWorkflow,
} from "@weareseeed/medusa-square-plugin/workflows"

// Inside a Medusa workflow or API route:
await syncMedusaSquareWorkflow(container).run()
await syncSquareMedusaWorkflow(container).run()
```

---

## API Reference

All routes are prefixed with your Medusa backend URL.

### Admin Routes

> Require admin authentication.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/square/config` | Get active Square configuration |
| `POST` | `/admin/square/config` | Update metadata/settings |
| `GET` | `/admin/square/locations` | List available Square locations |
| `POST` | `/admin/square/locations` | Set active location |
| `GET` | `/admin/square/oauth/start` | Start OAuth flow (redirect to Square) |
| `GET` | `/admin/square/oauth` | OAuth callback handler |
| `DELETE` | `/admin/square/oauth/revoke` | Disconnect Square account |
| `POST` | `/admin/square/config/apple` | Register Apple Pay domain |

### Store Routes

> Public endpoints for storefront use.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/store/square/config` | Get public Square config (application ID, location, currency, capabilities) |
| `GET` | `/store/square/plugin` | Check plugin availability |

---

## Workflows

The plugin exports Medusa v2 workflows that can be composed into your own workflows:

```typescript
import { getSquareConfigWorkflow } from "@weareseeed/medusa-square-plugin/workflows"

// Retrieve the active Square configuration
const { result } = await getSquareConfigWorkflow(container).run()
```

| Export | Description |
|--------|-------------|
| `getSquareConfigWorkflow` | Returns the active `square_configuration` record |
| `syncMedusaSquareWorkflow` | Full Medusa → Square data sync |
| `syncSquareMedusaWorkflow` | Full Square → Medusa data sync |

---

## Usage

### Connect Your Square Account

1. Log in to your Medusa Admin dashboard
2. Navigate to **Settings → Square**
3. Toggle **Sandbox** on if you are testing, or leave it off for production
4. Click **Connect Square Account** — you will be redirected to Square's OAuth page
5. Authorize the connection — you are redirected back to the admin dashboard

> Make sure `MEDUSA_BACKEND_URL` is set to your publicly accessible backend URL before starting the OAuth flow, otherwise the redirect will fail.

### Select a Location

After connecting:

1. In the **Account** tab, your Square locations are listed automatically
2. Click a location row to set it as the active location for payment processing
3. The selected location ID is stored in the database and used for all subsequent payments

### Configure Sync (Optional)

In the **Settings** tab:

1. Choose whether **Medusa** or **Square** is the source of truth for catalog data
2. Enable the sync features you need:
   - **Sync Catalog** — keeps products and categories in sync
   - **Sync Customers** — mirrors customer records to Square
3. Click **Sync Now** to run a full manual sync, or let the real-time subscribers handle incremental updates

### Accept Payments on the Storefront

1. Install `react-square-web-payments-sdk` in your storefront (see [Storefront Integration](#storefront-integration))
2. Fetch `/store/square/config` to get `application_id`, `location_id`, and `currency`
3. Render `<PaymentForm>` with `<CreditCard />` (or another payment method component) at checkout
4. On tokenization, call `initiatePaymentSession` with `provider_id: "pp_square_square"` and pass `token`, `buyer`, and `cart_id` in the `data` field
5. Complete the cart — the plugin will authorize and capture the payment automatically

### Register Apple Pay Domain (Optional)

1. In the **Apple Pay** tab, enter your storefront domain (e.g. `store.yourdomain.com`)
2. Click **Register** — the plugin calls Square's domain registration API and stores the domain
3. Download the [`Square's verification file`](https://app.squareup.com/digital-wallets/apple-pay/apple-developer-merchantid-domain-association)
3. Make sure your storefront serves Square's domain verification file at `/.well-known/apple-developer-merchantid-domain-association`

### Payment Status Mapping

| Square Status | Medusa Status |
|---------------|---------------|
| `APPROVED` | `authorized` |
| `PENDING` | `pending` |
| `COMPLETED` | `captured` |
| `CANCELED` | `canceled` |
| `FAILED` | `error` |
