# Commerce Extensions Roadmap

This document tracks the product reviews backend added first and the follow-up storefront and commerce extension phases.

## Product reviews backend

The backend now has a `productReview` Medusa module with the `product_review` table. Reviews store product and customer identifiers, a 1-5 rating, title, content, optional customer display details, verified-purchase state, moderation state, and moderation timestamps.

Implemented endpoints:

- `GET /store/products/:id/reviews` returns approved reviews for a product with `count`, `limit`, `offset`, and a page-level `summary.average_rating`.
- `POST /store/products/:id/reviews` requires a customer session or bearer token and creates a pending review through `createProductReviewWorkflow`.
- `GET /admin/product-reviews` lists reviews for moderation, optionally filtered by `product_id` or `status`.
- `POST /admin/product-reviews/:id/moderate` requires an admin user session or bearer token and approves or rejects a review through `moderateProductReviewWorkflow`.

Migration:

```sh
pnpm --dir medusa exec medusa db:migrate --skip-links
```

`--skip-links` avoids the removed-link cleanup prompt for old subscription plugin link tables.

## Storefront product reviews

The storefront product page now fetches approved reviews with `getProductReviews` and renders a reviews section below the product marketing content. Signed-in customers can submit reviews from the product page; submissions are sent through a server action using the Medusa JS SDK and remain pending until approved in Admin.

Implemented storefront pieces:

- `storefront/src/lib/product-reviews.ts` contains shared review types and form validation.
- `storefront/src/lib/data/product-reviews.ts` contains server-side SDK calls for fetching and submitting product reviews.
- `storefront/src/modules/products/components/product-reviews/index.tsx` renders the rating summary, approved review cards, empty state, sign-in prompt, and review form.
- `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx` fetches review data alongside product data.

Remaining storefront/admin follow-ups:

1. Add product JSON-LD aggregate rating only when at least one approved review exists.
2. Add a Medusa Admin route under `medusa/src/admin/routes/product-reviews/page.tsx`.
3. Fetch `GET /admin/product-reviews?status=pending` through the Medusa Admin SDK client.
4. Display pending reviews in a table with product ID, rating, customer, submitted date, and content preview.
5. Add approve/reject actions that call `POST /admin/product-reviews/:id/moderate`.
6. Add Playwright coverage for viewing reviews and submitting a review while authenticated.

## Wishlist storefront integration

The backend uses `@alphabite/medusa-wishlist`, whose wishlist create route requires `sales_channel_id`. Storefront wishlist server actions resolve the active sales channel through `GET /store/custom/sales-channel`, which reads the publishable API key context populated by Medusa's store middleware, before posting to `POST /store/wishlists`.

The account area includes `/account/wishlist`, and the account sidebar links it next to My orders and Invoices. Wishlist item reads fall back to the first customer wishlist when the `_medusa_wishlist_id` cookie is absent, so customer wishlists remain visible after login.

## Tech product details

Tech product descriptions are structured through product metadata instead of a separate table. The Admin widget at `medusa/src/admin/widgets/product-tech-specs.tsx` writes `metadata.tech_product_details` through `POST /admin/custom/products/:productId/tech-specs`.

Fields:

- `buying_summary` - short plain-language summary for non-technical buyers.
- `specs` - key/value specs such as processor, memory, storage, screen size, ports, condition, and warranty.
- `best_for` - short use-case bullets.
- `included` - what comes in the box or with the service.
- `compatibility` - model, socket, cartridge, cable, port, or system compatibility notes.
- `support_note` - Tech Hub setup, installation, repair, or support message.

Storefront product pages parse this metadata with `storefront/src/lib/util/product-details.ts` and render it through `storefront/src/modules/products/components/tech-product-details`. If `tech_product_details` is empty, the storefront falls back to the seeded `metadata.specs` array.

## Next extension phases

Phase 2 should add abandoned cart recovery because Resend is already configured. The first slice should be a scheduled job that finds incomplete carts older than a configured threshold and sends one recovery email per cart.

Phase 3 should add custom PC builder support. Start with storefront UI and cart line-item metadata for selected build services and add-ons before adding deeper compatibility rules.

Phase 4 should add preorder/backorder reservations for high-demand products. Keep this separate from normal inventory until reservation and cancellation behavior is clearly tested.

Phase 5 should add loyalty/store credit after the order and refund flows are stable, since points and credits need careful accounting and expiry rules.
