# Marketplace Seller Accounts

TechHub marketplace links are managed in Medusa instead of hardcoded on the storefront.

## What was added

- A Medusa custom module at `medusa/src/modules/marketplace-account`.
- A `marketplace_account` table for external seller accounts.
- Authenticated Admin API routes under `/admin/marketplace-accounts`.
- A public Store API route at `/store/marketplace-accounts`.
- A Medusa Admin extension page at **Marketplace**.
- A storefront data helper at `storefront/src/lib/data/marketplace-accounts.ts`.
- Homepage rendering that reads active seller accounts and shows them in the **Find us online** section.

## Admin workflow

Open the Medusa Admin dashboard and go to **Marketplace**. Add one account for each marketplace profile, such as Best Buy Marketplace, Amazon Canada, Walmart Marketplace, or any other external sales channel.

Each account has:

- Display name shown on the storefront.
- Platform name for internal organization.
- Seller account URL.
- Button label.
- Description.
- Sort order.
- Active status.

Only active accounts are returned to the storefront.

## API routes

Admin routes require Admin authentication:

- `GET /admin/marketplace-accounts`
- `POST /admin/marketplace-accounts`
- `GET /admin/marketplace-accounts/:id`
- `POST /admin/marketplace-accounts/:id`
- `DELETE /admin/marketplace-accounts/:id`

The storefront reads:

- `GET /store/marketplace-accounts`

The Store route returns only active seller accounts sorted by `sort_order`.

## Storefront behavior

The homepage marketplace section is populated from `GET /store/marketplace-accounts`. If no accounts exist yet, it falls back to a Best Buy card and an inactive Amazon prompt so the section still explains what belongs there.

After the Amazon seller or storefront URL is known, add it through **Marketplace** in Admin. No code change is needed.

## Deployment note

Run Medusa migrations after deploying the module so the `marketplace_account` table exists before using the Admin page or public storefront route.
