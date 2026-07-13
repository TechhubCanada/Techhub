<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 14 features for a performant storefront.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.
For a quick setup, run:

```shell
npx create-medusa-app@latest
```

Check out [create-medusa-app docs](https://docs.medusajs.com/create-medusa-app) for more details and troubleshooting.

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/)

Features include:

- Full ecommerce support:
  - Product Detail Page
  - Product Overview Page
  - Product listing pagination with a visible page summary
  - B2B and store inquiry page for specialized product, bulk order, repair, and business technology requests with desktop top spacing aligned to the storefront page rhythm
  - Footer agency attribution with Aceternity-style hover link preview
  - Footer contact block with location, phone number, email, and weekly location hours
  - Search with Algolia / MeiliSearch
  - Product Collections
  - Cart
  - Checkout with PayPal and Stripe
  - User Accounts
  - Scrollbar-free mobile account sidebar tabs with explicit spacing between account links
  - Order Details
- Full Next.js 14 support:
  - App Router
  - Next fetching/caching
  - Server Components
  - Server Actions
  - Streaming
  - Static Pre-Rendering

# Quickstart

### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

### Install dependencies

Use pnpm to install all dependencies from the repository root.

```shell
pnpm install
```

### Start developing

You are now ready to start up your project.

```shell
pnpm dev:storefront
```

In GitHub Codespaces, browser-side Medusa SDK calls are automatically sent through the storefront `/medusa` proxy when `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points at an `app.github.dev` backend URL. The browser SDK base URL must resolve to the current origin plus `/medusa` so `new URL(...)` calls inside the Medusa JS SDK remain valid, while server-side storefront requests to a forwarded Codespaces backend must use `http://localhost:<port>` to avoid GitHub tunnel sign-in redirects. This avoids checkout CORS and failed-fetch errors when the forwarded backend tunnel requires authentication.

The Vercel project root is `storefront`, so `vercel.json` uses `.next` as the output directory. Its install command steps up to the monorepo root before `pnpm install` so workspace dependencies are linked correctly, then the build runs `pnpm build` inside `storefront`.

Checkout pages render the current cart on the server and pass that same cart into the checkout form plus desktop and mobile summary wrappers as React Query initial data. Client checkout rendering must continue using the server `initialCart` while React Query refetches, and summary wrappers must keep the cart query disabled when that snapshot is `null`, so checkout does not hydrate from a mismatched loading shell. The Payment step must show loading/unavailable states for provider lookup, auto-select the available Square provider so the Square card form is visible without an extra click, and hide manual/test payment when Square is available.

The checkout shipping step renders distinct loading, retry, empty, and ready states for delivery options, filters out unpriced options, and groups available methods under **Pickup** or **Shipping** based on the fulfillment set type returned by Medusa.

Vercel Speed Insights is rendered only in production builds. Keep it out of the local Turbopack dev server so checkout route transitions are not interrupted by browser performance instrumentation errors.

The storefront includes detailed Privacy Policy, Cookie Policy, Terms of Use, Refund & Returns Policy, and Cookie Preferences pages. The cookie banner auto-closes after 45 seconds with essential cookies only unless the visitor accepts all cookies or opens preferences.

The storefront has an App Router SEO baseline: shared TechHub metadata and Organization/WebSite JSON-LD, route-specific canonical titles, descriptions, keywords, social metadata, product JSON-LD, plus generated `/sitemap.xml` and `/robots.txt`. Public product, collection, buying-guide, and service pages are indexed; account, auth, cart, checkout, order, search, API, proxy, and cookie-preference routes are excluded. See `../docs/storefront-seo.md` for the indexing policy.

Storefront CMS reads use `src/lib/data/content.ts`, which calls the Medusa Content CMS plugin's public `/content` routes through the existing Medusa JS SDK instance. Homepage, About, Inspiration, product detail, and `/buying-guides/[slug]` pages consume published CMS items with static fallbacks where appropriate. Keep CMS reads server-side unless a page specifically needs client refresh behavior, and use the `content` cache tag family when invalidating published content. The homepage fallback hero is brand-forward: it overlays the TechHub mark, ecommerce/service positioning, compact category chips, and store plus B2B inquiry CTAs on the `techhub-homepage-hero-banner.png` product lineup visual. The homepage includes a featured product preview that reuses store product cards and live region pricing, followed by a dark support section with one Motion-powered blur text line that rotates through carried brands, business technology inquiries, repair or upgrade requests, and a marketplace section populated from the Medusa `GET /store/marketplace-accounts` endpoint only when active backend links exist.

Marketplace seller accounts are managed from the Medusa Admin **Marketplace** extension page. Add Best Buy, Amazon, or any future seller profile there with a display name, platform, URL, CTA label, description, sort order, and active status. The homepage marketplace section is hidden when no active accounts are returned, so placeholder seller cards are not shown to customers. See `../docs/marketplace-accounts.md` for the backend, Admin, API, and storefront flow.

Use **TechHub** for customer-facing storefront copy and metadata. Reserve **Tech Hub Canada** for legal/company context, source project naming, and domain or business listing references that require the longer name.

The storefront includes `/inquiry` for B2B, store, and specialized requests. It uses a static localized App Router page with a compact one-screen light direct-intake hero, request highlight chips, response-step cues, a high-contrast hero-side Zod-validated contact form, image-led follow-up sections, Resend delivery through `/api/inquiry`, and shared business contact details from `src/lib/business-info.ts`. Configure `RESEND_API_KEY`, `RESEND_FROM`, and optionally `CONTACT_INQUIRY_TO` in the storefront environment. The linked Vercel project sets `CONTACT_INQUIRY_TO` to `info@techhubcanada.com` in Preview and Production. The visible navigation labels the product listing route as **Shop**, while the functional ecommerce path remains `/store`.

The store page keeps the collection carousel, filters, sort controls, and first product row close together so shoppers can see product cards immediately below the controls on standard desktop viewports.

The mobile header uses a dark treatment with 44px account, cart, and menu targets. The hamburger opens an 85vw dark drawer with search at the top, simple text navigation rows, and plain account and country controls at the bottom with safe-area padding.

The desktop navbar uses the white hero treatment on `/`, `/about`, `/inspiration`, `/inquiry`, and collection pages until scrolling makes the header sticky.

The homepage, store, and inspiration collections strips use the shared Embla carousel. They support swipe and arrow navigation. Homepage and store collection strips advance through collection cards automatically, while hover, focus, and reduced-motion settings stop the automatic movement.

Product and collection detail pages are forced dynamic because they read live Medusa catalog data, reviews, CMS items, and region pricing context. Region lookup must stay uncached across serverless invocations so a production database refresh or region replacement cannot leave product pricing requests pinned to an old region ID.

Wishlist actions use `src/lib/data/wishlist.ts` and the Medusa wishlist plugin's `/store/wishlists` routes. New wishlists must be created with a `sales_channel_id`, so the storefront resolves it from Medusa's `/store/custom/sales-channel` helper before posting to `/store/wishlists`. Guest wishlists are stored in the HTTP-only `_medusa_wishlist_id` cookie and are transferred after login or signup. Signed-in customers can review saved products from `/account/wishlist`.

Customer invoices preview and download through `/api/orders/:id/invoice`, which retrieves the authenticated order and renders a printable invoice HTML document in the storefront because the backend invoice plugin is intentionally disabled. Add `?preview=1` to render inline; omit it to download the invoice HTML file. When the payment provider stores a customer-facing hosted `receipt_url` on the payment data, order details and invoice previews link to that hosted payment receipt. Account order lists show refunded or partially refunded badges from the order payment status; account order details fetch payment collections, payments, and refunds so the Payment card shows paid, partially refunded, or refunded state with the relevant payment and refund amounts. The account area includes `/account/invoices` as a dedicated invoice page in addition to order-list and order-detail invoice actions.

Apple Pay domain verification serves `public/.well-known/apple-developer-merchantid-domain-association` directly from the storefront root. Keep `.well-known` paths excluded from country-code redirects so Square and Apple receive a 200 response at `/.well-known/apple-developer-merchantid-domain-association`.

### Open the code and start customizing

Your site is now running at http://localhost:8000!

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)
- [Paypal](https://www.paypal.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
```

You will also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/add-plugins/stripe) and [PayPal](https://docs.medusajs.com/add-plugins/paypal) in your Medusa project.

# Search integration

This starter is configured to support using the `medusa-search-meilisearch` plugin out of the box. To enable search you will need to enable the feature flag in `./store.config.json`, which you do by changing the config to this:

```javascript
{
  "features": {
    // other features...
    "search": true
  }
}
```

Before you can search you will need to install the plugin in your Medusa server, for a written guide on how to do this – [see our documentation](https://docs.medusajs.com/add-plugins/meilisearch).

The search components in this starter are developed with Algolia's `react-instant-search-hooks-web` library which should make it possible for you to seemlesly change your search provider to Algolia instead of MeiliSearch.

To do this you will need to add `algoliasearch` to the project, by running

```shell
pnpm --dir storefront add algoliasearch
```

After this you will need to switch the current MeiliSearch `SearchClient` out with a Alogolia client. To do this update `@lib/search-client`.

```ts
import algoliasearch from "algoliasearch/lite"

const appId = process.env.NEXT_PUBLIC_SEARCH_APP_ID || "test_app_id" // You should add this to your environment variables

const apiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY || "test_key"

export const searchClient = algoliasearch(appId, apiKey)

export const SEARCH_INDEX_NAME =
  process.env.NEXT_PUBLIC_INDEX_NAME || "products"
```

Then, in `src/app/(main)/search/actions.ts`, remove the MeiliSearch code (line 10-16) and uncomment the Algolia code.

```ts
"use server"

import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"

/**
 * Uses MeiliSearch or Algolia to search for a query
 * @param {string} query - search query
 */
export async function search(query: string) {
  const index = searchClient.initIndex(SEARCH_INDEX_NAME)
  const { hits } = await index.search(query)

  return hits
}
```

After this you will need to set up Algolia with your Medusa server, and then you should be good to go. For a more thorough walkthrough of using Algolia with Medusa – [see our documentation](https://docs.medusajs.com/add-plugins/algolia), and the [documentation for using `react-instantsearch-hooks-web`](https://www.algolia.com/doc/guides/building-search-ui/getting-started/react-hooks/).

## App structure

For the new version, the main folder structure remains unchanged. The contents have changed quite a bit though.

```
.
└── src
    ├── app
    ├── lib
    ├── modules
    ├── styles
    ├── types
    └── middleware.ts

```

### `/app` directory

The app folder contains all Next.js App Router pages and layouts, and takes care of the routing.

```
.
└── [countryCode]
    ├── (checkout)
        └── checkout
    └── (main)
        ├── account
        │   ├── addresses
        │   └── orders
        │       └── details
        │           └── [id]
        ├── cart
        ├── categories
        │   └── [...category]
        ├── collections
        │   └── [handle]
        ├── order
        │   └── confirmed
        │       └── [id]
        ├── products
        │   └── [handle]
        ├── results
        │   └── [query]
        ├── search
        └── store
```

The app router folder structure represents the routes of the Starter. In this case, the structure is as follows:

- The root directory is represented by the `[countryCode]` folder. This indicates a dynamic route based on the country code. The this will be populated by the countries you set up in your Medusa server. The param is then used to fetch region specific prices, languages, etc.
- Within the root directory, there two Route Groups: `(checkout)` and `(main)`. This is done because the checkout flow uses a different layout. All other parts of the app share the same layout and are in subdirectories of the `(main)` group. Route Groups do not affect the url.
- Each of these subdirectories may have further subdirectories. For instance, the `account` directory has `addresses` and `orders` subdirectories. The `orders` directory further has a `details` subdirectory, which itself has a dynamic `[id]` subdirectory.
- This nested structure allows for specific routing to various pages within the application. For example, a URL like `/account/orders/details/123` would correspond to the `account > orders > details > [id]` path in the router structure, with `123` being the dynamic `[id]`.

This structure enables efficient routing and organization of different parts of the Starter.

### `/lib` **directory**

The lib directory contains all utilities like the Medusa JS client functions, util functions, config and constants.

The most important file here is `/lib/data/index.ts`. This file defines various functions for interacting with the Medusa API, using the JS client. The functions cover a range of actions related to shopping carts, orders, shipping, authentication, customer management, regions, products, collections, and categories. It also includes utility functions for handling headers and errors, as well as some functions for sorting and transforming product data.

These functions are used in different Server Actions.

### `/modules` directory

This is where all the components, templates and Server Actions are, grouped by section. Some subdirectories have an `actions.ts` file. These files contain all Server Actions relevant to that section of the app.

### `/styles` directory

`global.css` imports Tailwind classes and defines a couple of global CSS classes. Tailwind and Medusa UI classes are used for styling throughout the app.

### `/types` directory

Contains global TypeScript type defintions.

### `middleware.ts`

Next.js Middleware, which is basically an Edge function that runs before (almost) every request. In our case it enforces a `countryCode` in the url. So when a user visits any url on your storefront without a `countryCode` param, it will redirect the user to the url for the most relevant region.

The region will be decided as follows:

- When deployed on Vercel and you’re active in the user’s current country, it will use the country code from the `x-vercel-ip-country` header.
- Else, if you have defined a `NEXT_PUBLIC_DEFAULT_REGION` environment variable, it will redirect to that.
- Else, it will redirect the user to the first region it finds on your Medusa server.

If you want to use the `countryCode` param in your code, there’s two ways to do that:

1. On the server in any `page.tsx` - the `countryCode` is in the `params` object:

   ```tsx
   export default async function Page({
     params: { countryCode },
   }: {
     params: { countryCode: string }
   }) {
     const region = await getRegion(countryCode)

   // rest of code
   ```

2. From client components, with the `useParam` hook:

   ```tsx
   import { useParams } from "next/navigation"

   const Component = () => {
     const { countryCode } = useParams()

     // rest of code
   ```

The middleware also sets a cookie based on the onboarding status of a user. This is related to the Medusa Admin onboarding flow, and may be safely removed in your production storefront.

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
