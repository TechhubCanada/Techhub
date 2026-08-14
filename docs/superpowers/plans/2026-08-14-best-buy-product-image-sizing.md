# Best Buy-Style Product Image Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render TechHub product images in responsive square white media areas without cropping, matching the measured Best Buy Canada product-image behavior.

**Architecture:** Keep the existing product page layout, Embla carousel, and Next.js image loading. Change only the shared gallery slide and reusable thumbnail media presentation from portrait `object-cover` to square white `object-contain`, then verify the already committed source contract and production builds.

**Tech Stack:** Next.js 16.3, React 19, Tailwind CSS, `next/image`, Embla Carousel, Node test contracts, pnpm, Turborepo.

---

### Task 1: Verify the Existing Product Image Contract Fails

**Files:**
- Test: `storefront/src/modules/products/components/image-gallery/__tests__/marketplace-image-display.unit.mjs`

- [ ] **Step 1: Run the existing contract**

Run:

```sh
node storefront/src/modules/products/components/image-gallery/__tests__/marketplace-image-display.unit.mjs
```

Expected: FAIL because the gallery still contains `aspect-[3/4]` and
`object-cover`, and thumbnails still contain `object-cover`.

### Task 2: Implement Square Contained Product Media

**Files:**
- Modify: `storefront/src/modules/products/components/image-gallery/index.tsx`
- Modify: `storefront/src/modules/products/components/thumbnail/index.tsx`
- Test: `storefront/src/modules/products/components/image-gallery/__tests__/marketplace-image-display.unit.mjs`

- [ ] **Step 1: Update the product-detail gallery surface**

Change each gallery slide wrapper to:

```tsx
className="relative aspect-square w-full overflow-hidden bg-white"
```

Change the `Image` presentation to:

```tsx
className="object-contain p-4"
```

Keep `fill`, responsive `sizes`, priority behavior, and carousel structure
unchanged.

- [ ] **Step 2: Update reusable product thumbnails**

Change the product thumbnail image presentation to:

```tsx
className="absolute inset-0 bg-white object-contain object-center p-3"
```

Keep thumbnail dimensions, `fill`, quality, and source selection unchanged.

- [ ] **Step 3: Run the focused contract**

Run:

```sh
node storefront/src/modules/products/components/image-gallery/__tests__/marketplace-image-display.unit.mjs
```

Expected: PASS with no output and exit code `0`.

### Task 3: Document Product Image Presentation

**Files:**
- Modify: `storefront/README.md`
- Modify: `README.md`

- [ ] **Step 1: Document the shared storefront behavior**

Add a concise storefront note that product detail images and reusable product
thumbnails use responsive square white media surfaces with contained images,
preventing marketplace photography from being cropped.

- [ ] **Step 2: Ensure the root documentation version remains current**

Keep `Documentation version: 2026.08.14.1` and add the product-media behavior
to the relevant storefront documentation section.

### Task 4: Verify Vercel and Production Builds

**Files:**
- Verify: `medusa/package.json`
- Verify: `pnpm-lock.yaml`
- Verify: `vercel.json`

- [ ] **Step 1: Run the exact Vercel filtered install**

Run:

```sh
cd storefront
corepack enable
cd ..
pnpm install --frozen-lockfile --filter @techhub/storefront...
```

Expected: PASS without `ERR_PNPM_FETCH_404`.

- [ ] **Step 2: Run storefront production build**

Run:

```sh
pnpm --filter @techhub/storefront build
```

Expected: Next.js production build completes successfully.

- [ ] **Step 3: Run Medusa production build**

Run:

```sh
pnpm --filter @techhub/medusa build
```

Expected: backend and Admin builds complete successfully with
`medusa-plugin-content@0.2.6`.

- [ ] **Step 4: Check repository diff**

Run:

```sh
git diff --check
git status --short
```

Expected: no whitespace errors and only intended files changed.

### Task 5: Commit the Implementation

**Files:**
- Commit all intended gallery, thumbnail, dependency, lockfile, and documentation changes.

- [ ] **Step 1: Stage and inspect**

Run:

```sh
git add README.md storefront/README.md docs/medusa-content-cms.md \
  docs/superpowers/plans/2026-08-14-best-buy-product-image-sizing.md \
  medusa/package.json pnpm-lock.yaml \
  storefront/src/modules/products/components/image-gallery/index.tsx \
  storefront/src/modules/products/components/thumbnail/index.tsx
git diff --cached --check
git diff --cached --stat
```

- [ ] **Step 2: Commit**

Run:

```sh
git commit -m "Fix Vercel install and product image sizing"
```
