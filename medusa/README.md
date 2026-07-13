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
  Medusa
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
    <a href="https://www.producthunt.com/posts/medusa"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Day-%23DA552E" alt="Product Hunt"></a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 1.8.0 of `@medusajs/medusa`.

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/create-medusa-app) to set up a server.

Visit the [Docs](https://docs.medusajs.com/development/backend/prepare-environment) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/development/fundamentals/architecture-overview) and [commerce modules](https://docs.medusajs.com/modules/overview) in the Docs.

## Roadmap, Upgrades & Plugins

You can view the planned, started and completed features in the [Roadmap discussion](https://github.com/medusajs/medusa/discussions/categories/roadmap).

Follow the [Upgrade Guides](https://docs.medusajs.com/upgrade-guides/) to keep your Medusa project up-to-date.

Check out all [available Medusa plugins](https://medusajs.com/plugins/).

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)

## Tech Hub notification setup

This backend uses Medusa's Notification Module with the local notification provider, a custom Resend provider, and a custom Slack provider. The Resend React Email templates are source-controlled under `src/modules/resend/emails` and registered in `src/modules/resend/emails/index.ts`. Slack order alerts are sent from `src/modules/slack` when `order.placed` fires. The Builder/Lexical notification email admin plugin and the dependent Codee automations plugin are intentionally not installed.

The Admin notification drawer uses the local `feed` channel. Order placement, new customer accounts, password reset requests, and catalog or inventory changes create `admin-ui` feed entries with `title` and `description` fields so the bell drawer does not stay empty during normal operations.

The `order-update` Resend template accepts optional `currency_code`, `payment_status`, `payment_total`, and `refunded_total` order fields. Include them when an order update is payment-related so refunded or partially refunded notices show a Payment update block in the email.

Required notification environment variables:

```sh
RESEND_API_KEY=
RESEND_FROM="TechHub <noreply@techhubcanada.com>"
SLACK_WEBHOOK_URL=
SLACK_ADMIN_URL=http://localhost:9000/app
```

See `../docs/medusa-notifications.md` for provider details, template names, and Slack setup.

## Auth MFA setup

The backend reads `AUTH_MFA_ENCRYPTION_KEY` through Medusa's default Auth module configuration. Set it in `medusa/.env` for local development and in every production backend service that can run auth code. Generate it with `openssl rand -hex 32`, keep one stable value across the server and worker, and do not rotate it after MFA enrollment because existing TOTP secrets are encrypted with this key.

## Product review setup

Product reviews are implemented as a local Medusa module in `src/modules/product-review`. Storefront customers can submit authenticated reviews through `POST /store/products/:id/reviews`; submissions are stored as `pending` until an admin approves or rejects them through `POST /admin/product-reviews/:id/moderate`. Approved reviews are exposed through `GET /store/products/:id/reviews` and rendered on storefront product pages.

## Canadian shipping setup

The default Medusa seed uses the TechHub Canada region and fulfillment configuration. `pnpm seed` creates a CAD Canada region, Canadian tax region, Canada delivery geo zone, store pickup geo zone, and store-enabled Standard Shipping, Express Shipping, and Store Pickup options for fresh environments. Production storefront deployments should use `NEXT_PUBLIC_DEFAULT_REGION=ca`; after deploying shipping seed changes, run `pnpm seed:techhub` against the production database so the idempotent TechHub seed can create or repair Canadian shipping data and `/store/shipping-options?cart_id=...` can return methods for Canadian checkout addresses.

Run migrations after pulling this feature:

```sh
pnpm --dir medusa exec medusa db:migrate --skip-links
```

Use `--skip-links` unless you intentionally want to review Medusa's removed-link cleanup prompt for old subscription tables. See `../docs/commerce-extensions-roadmap.md` for the storefront rollout plan and the next commerce extension phases.

## Tech product details setup

Tech product details are stored in product metadata under `tech_product_details`. The Medusa Admin product details page includes a **Tech product details** widget for editing and previewing buying summary, key specs, best-for notes, included items, compatibility, and Tech Hub support notes. Storefront product pages render this metadata as a structured **Tech specs** section, with a fallback to the seeded `metadata.specs` array when richer details have not been entered.

The product details page also includes an **Agency support** widget linking to Agency by Naman Kataria for image library, product content, storefront design, and Medusa Admin support. Custom product widgets render before the built-in Metadata and JSON panels so raw metadata stays at the end of the page.

## Analytics operations setup

The Medusa Admin **Analytics** page includes date-range sales metrics, pending review count, missing tech specs count, low-stock and out-of-stock action cards, and a **Sales PDF** button that opens a print-ready sales report for the selected period.

## Content CMS setup

The backend installs and enables `medusa-plugin-content` for in-admin CMS collections and published storefront content. Run migrations after pulling plugin changes:

```sh
pnpm --dir medusa exec medusa db:migrate
```

Published content is available from the backend root routes `/content`, `/content/:slug`, `/content/:slug/items`, and `/content/:slug/items/:itemSlug`. See `../docs/medusa-content-cms.md` for storefront usage and compatibility notes.

## Wishlist setup

The backend installs `@alphabite/medusa-wishlist` for guest and customer wishlists. Run migrations after pulling plugin changes:

```sh
pnpm --dir medusa exec medusa db:migrate
```

The custom store route `GET /store/custom/sales-channel` returns the first sales channel linked to the request's publishable API key. The storefront uses this helper when creating wishlist records because the wishlist plugin validates `sales_channel_id` on `POST /store/wishlists`.

The invoice plugin (`@webbers/invoices-medusa`) is intentionally not installed because its current workflow bundle re-imports Medusa core flows and duplicate-registers `create-payment-sessions` during backend startup on this Medusa version. Do not reinstall it until the plugin is upgraded or patched to avoid the core-flow barrel import.

## Railway production services

Production Medusa runs on Railway as separate services that share the same codebase but use different worker modes:

- `Techhub Production Server` uses `MEDUSA_WORKER_MODE=server`.
- `Techhub Production Worker` uses `MEDUSA_WORKER_MODE=worker`.
- `Postgres` is the production Postgres database.
- `Redis-Xbug` is the production Redis instance used for the event bus, workflow engine, cache, and locks.

Both Medusa services should use the repository root directory `medusa` in Railway. Keep `railway.toml` free of an HTTP healthcheck because the worker service does not expose `/health`; Railway restart policy still restarts failed processes.

## Admin plugin policy

The Reorder subscriptions plugin (`@reorderjs/reorder`) is intentionally not installed because Tech Hub does not use subscription workflows in Medusa Admin. The Agentic Commerce plugin (`@financedistrict/medusa-plugin-agentic-commerce`) is also intentionally removed for now; re-enable it only when UCP/ACP endpoints are ready to be exposed publicly with production API keys and payment handling.

## Square plugin setup

The backend uses `@weareseeed/medusa-square-plugin` for Square payments and the Square Admin extension. Keep `MEDUSA_BACKEND_URL` set to the public backend origin because the plugin registers the OAuth callback at `{MEDUSA_BACKEND_URL}/admin/square/oauth`.

For Codespaces, open Medusa Admin from the same public `*.app.github.dev` backend URL used by `MEDUSA_BACKEND_URL` before clicking **Square → Link your account**. For sandbox testing, open the Sandbox Square Dashboard for a seller test account first; sandbox OAuth must use `https://connect.squareupsandbox.com/oauth2/authorize` without `session=false`, while production OAuth uses `https://connect.squareup.com/oauth2/authorize` with production credentials. The Square plugin migrations are required for the `square_configuration` table:

```sh
pnpm --dir medusa exec medusa db:migrate
```

The Square plugin is patched in `patches/@weareseeed__medusa-square-plugin@0.0.30.patch` so reinstalling dependencies preserves the Admin UI search-param workaround, sandbox OAuth URL normalization, and Square refund provider support. See `../docs/square-oauth.md` for the production and sandbox OAuth checklist.
