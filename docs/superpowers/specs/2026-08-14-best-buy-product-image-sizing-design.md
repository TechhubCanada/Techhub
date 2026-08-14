# Best Buy-Style Product Image Sizing Design

Date: August 14, 2026

## Goal

Update TechHub product imagery to follow the practical presentation used by
Best Buy Canada: a square white media area that shows the complete product
without cropping on desktop and mobile.

## Current State

The shared product gallery renders each image in a `3:4` portrait container
with `object-cover`. On the referenced Panasonic Toughbook page, that produces
approximately:

- Desktop: `456 x 608` pixels
- Mobile: `390 x 520` pixels

Landscape product photography is enlarged and cropped to fill those portrait
frames.

## Reference Behavior

The inspected Best Buy Canada laptop detail page uses square product media with
scale-down containment:

- Desktop: approximately `380 x 380` pixels
- Mobile: approximately `278 x 278` pixels
- White background
- Complete product visible
- No crop when the source image has a different aspect ratio

## Approved Approach

Apply the behavior through TechHub's shared product media components:

1. Use a stable `1:1` aspect ratio for product-detail gallery slides.
2. Give the media surface a white background.
3. Render images with `object-contain` and modest internal padding.
4. Apply the same white-background containment behavior to reusable product
   thumbnails so list and detail imagery remain consistent.
5. Preserve the existing carousel controls, swipe interaction, responsive
   columns, image priority behavior, and source URLs.

The square remains responsive rather than being fixed to exactly `380px`.
Desktop width continues to follow the existing half-page product column, while
mobile width follows the viewport. This matches Best Buy's sizing behavior
without weakening TechHub's responsive layout.

## Scope

Expected implementation files:

- `storefront/src/modules/products/components/image-gallery/index.tsx`
- `storefront/src/modules/products/components/thumbnail/index.tsx`
- `storefront/src/modules/products/components/image-gallery/__tests__/marketplace-image-display.unit.mjs`
- Storefront documentation describing product image presentation

No product data, uploaded source images, Medusa APIs, pricing, or checkout
behavior will change.

## Verification

1. Run the marketplace image-display unit contract.
2. Run the storefront production build.
3. Use `agent-browser` against the local storefront if a server is already
   running; do not start or restart services without explicit permission.
4. Verify desktop and mobile screenshots show square white media, the complete
   product, stable carousel controls, and no overlap.
5. Confirm the Vercel-equivalent frozen install still succeeds.

## Risks

- Very small source images may show more whitespace because they are no longer
  enlarged and cropped.
- Transparent images will visibly inherit the intended white media background.
- Product cards that previously relied on edge-to-edge crops will become more
  marketplace-like and less editorial.

These effects are intentional and consistent with the approved reference.
