# Footer Agency Link Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the footer's **Agency by Naman Kataria** link so its preview matches Aceternity UI's Link Preview interaction while preserving TechHub styling, accessibility, and existing collection-preview behavior.

**Architecture:** Keep `LinkPreview` as the single shared client component used by the footer and collection carousel. Add a destination-specific image-label API, harden decorative and external-link markup, align the Motion transitions with Aceternity's spring treatment, and protect the behavior with focused source-level Node assertions that match the storefront's current lightweight test convention.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Radix Hover Card, Motion, Tailwind CSS, Microlink screenshots, Node `assert`.

---

## File Map

- Create: `storefront/src/components/ui/__tests__/link-preview.unit.mjs` - focused source-level contract for the shared component and footer instance.
- Modify: `storefront/src/components/ui/LinkPreview.tsx` - accessible preview labels, decorative preload markup, secure preview link, and Aceternity-style motion.
- Modify: `storefront/src/components/Footer.tsx` - supply the agency-specific preview image label.
- Modify: `storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs` - move detailed `LinkPreview` assertions to the dedicated test while retaining footer and collection integration coverage.
- Modify: `storefront/README.md` - document the final footer interaction and accessibility behavior.
- Modify: `README.md` - bump `Documentation version:` from `2026.08.14.1` to `2026.08.14.2`.
- Modify: `docs/superpowers/specs/2026-08-14-footer-agency-link-preview-design.md` - append the implementation verification record.

## Task 1: Add A Focused Failing Link Preview Contract

**Files:**
- Create: `storefront/src/components/ui/__tests__/link-preview.unit.mjs`
- Modify: `storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs`

- [ ] **Step 1: Create the dedicated source-level test**

Create `storefront/src/components/ui/__tests__/link-preview.unit.mjs`:

```js
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../..")
const linkPreviewSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/ui/LinkPreview.tsx"),
  "utf8"
)
const footerSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/Footer.tsx"),
  "utf8"
)
const collectionsSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/CollectionsSection.tsx"),
  "utf8"
)

assert.equal(linkPreviewSource.includes("previewImageAlt?: string"), true)
assert.equal(
  linkPreviewSource.includes('previewImageAlt = `Preview of ${url}`'),
  true
)
assert.equal(linkPreviewSource.includes('aria-hidden="true"'), true)
assert.equal(linkPreviewSource.includes('alt=""'), true)
assert.equal(linkPreviewSource.includes("alt={previewImageAlt}"), true)
assert.equal(
  linkPreviewSource.includes('rel="noopener noreferrer"'),
  true
)
assert.equal(linkPreviewSource.includes('type: "spring"'), true)
assert.equal(linkPreviewSource.includes("stiffness: 260"), true)
assert.equal(linkPreviewSource.includes("damping: 20"), true)
assert.equal(
  linkPreviewSource.includes("x: shouldReduceMotion ? 0 : translateX"),
  true
)
assert.equal(
  footerSource.includes(
    'previewImageAlt="Preview of Agency by Naman Kataria website"'
  ),
  true
)
assert.equal(
  footerSource.includes('url="https://agency.namankataria.com"'),
  true
)
assert.equal(footerSource.includes("width={320}"), true)
assert.equal(footerSource.includes("height={200}"), true)
assert.equal(collectionsSource.includes("<LinkPreview"), true)
assert.equal(collectionsSource.includes("isStatic"), true)
assert.equal(collectionsSource.includes("imageSrc={imageUrl}"), true)
```

- [ ] **Step 2: Move component-detail assertions out of the broad homepage test**

In `storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs`:

1. Remove the `linkPreviewSource` `readFileSync` block.
2. Remove the assertions for `useCountryCode`, `const href =`,
   `previewContent`, `useReducedMotion`, `scale: 0.96`,
   `ease: [0.16, 1, 0.3, 1]`, and
   `x: shouldReduceMotion ? 0 : translateX`.
3. Keep the footer integration assertions for `width={320}`, `height={200}`,
   `Agency by Naman Kataria`, underline styling, and focus-ring styling.
4. Keep the collection integration assertions.

- [ ] **Step 3: Run the new test and confirm it fails**

Run:

```bash
node storefront/src/components/ui/__tests__/link-preview.unit.mjs
```

Expected: FAIL at the first new contract that is not implemented, beginning with `previewImageAlt?: string`.

- [ ] **Step 4: Run the adjusted homepage test**

Run:

```bash
node 'storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs'
```

Expected: PASS. The broad homepage test still protects the footer and collection wiring without owning shared-component internals.

- [ ] **Step 5: Commit the failing contract**

```bash
git add \
  storefront/src/components/ui/__tests__/link-preview.unit.mjs \
  'storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs'
git commit -m "Add footer link preview contract"
```

## Task 2: Refine The Shared Link Preview And Footer Instance

**Files:**
- Modify: `storefront/src/components/ui/LinkPreview.tsx`
- Modify: `storefront/src/components/Footer.tsx`
- Test: `storefront/src/components/ui/__tests__/link-preview.unit.mjs`

- [ ] **Step 1: Add the preview image label API**

Add the optional property to `LinkPreviewProps`:

```ts
previewImageAlt?: string
```

Destructure it with a useful fallback:

```ts
previewImageAlt = `Preview of ${url}`,
```

This keeps `CollectionsSection` backward-compatible while allowing the footer
to provide a human-readable destination label.

- [ ] **Step 2: Make the preload image decorative**

Replace:

```tsx
<div className="hidden">
  <img src={src} width={width} height={height} alt="hidden image" />
</div>
```

with:

```tsx
<div className="hidden" aria-hidden="true">
  <img src={src} width={width} height={height} alt="" />
</div>
```

- [ ] **Step 3: Align the entrance and exit with Aceternity's spring motion**

Keep the pointer-follow `translateX` behavior and reduced-motion branch. Replace
the non-reduced entrance, animate, and exit values with:

```tsx
initial={
  shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 20, scale: 0.6 }
}
animate={
  shouldReduceMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
        },
      }
}
exit={
  shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 20, scale: 0.6 }
}
```

Keep:

```tsx
style={{
  x: shouldReduceMotion ? 0 : translateX,
}}
```

- [ ] **Step 4: Harden the interactive preview surface**

Update the preview anchor:

```tsx
<a
  href={href}
  target="_blank"
  rel="noopener noreferrer"
  className="block overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 shadow-sm transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
  style={previewContent ? undefined : { fontSize: 0 }}
>
```

Update the visible screenshot:

```tsx
<img
  src={isStatic ? imageSrc : src}
  width={width}
  height={height}
  className="rounded-md"
  alt={previewImageAlt}
/>
```

- [ ] **Step 5: Label the footer's agency screenshot**

Add the property to the existing footer instance:

```tsx
previewImageAlt="Preview of Agency by Naman Kataria website"
```

Do not change the URL, visible copy, 320 by 200 dimensions, footer layout, or
existing underline and focus classes.

- [ ] **Step 6: Run the focused tests**

Run:

```bash
node storefront/src/components/ui/__tests__/link-preview.unit.mjs
node 'storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs'
```

Expected: both commands exit successfully with no output.

- [ ] **Step 7: Run static verification**

Run:

```bash
pnpm --dir storefront exec eslint \
  src/components/ui/LinkPreview.tsx \
  src/components/Footer.tsx
pnpm --dir storefront exec tsc --noEmit --incremental false
```

Expected: ESLint and TypeScript exit with code 0. Existing
`@next/next/no-img-element` warnings in `LinkPreview.tsx` may remain warnings,
but no new errors are acceptable.

- [ ] **Step 8: Commit the implementation**

```bash
git add \
  storefront/src/components/ui/LinkPreview.tsx \
  storefront/src/components/Footer.tsx
git commit -m "Refine footer agency link preview"
```

## Task 3: Update Storefront Documentation

**Files:**
- Modify: `storefront/README.md`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-08-14-footer-agency-link-preview-design.md`

- [ ] **Step 1: Update the storefront behavior note**

Replace the existing footer-preview sentence in `storefront/README.md` with:

```md
The footer agency attribution uses an Aceternity-style live website preview with pointer-follow movement, spring entrance and exit motion, reduced-motion support, destination-specific image text, secure external preview linking, a keyboard-visible focus treatment, and an animated underline.
```

- [ ] **Step 2: Bump the root documentation version**

Change:

```md
Documentation version: 2026.08.14.1
```

to:

```md
Documentation version: 2026.08.14.2
```

The design-spec link added in the prior commit remains the root documentation
index entry for this behavior.

- [ ] **Step 3: Append the verification record to the design spec**

Append:

```md
## Implementation Record

Implemented on August 14, 2026 using the existing shared `LinkPreview`
component. Verification covers the focused link-preview contract, homepage
integration contract, storefront ESLint, storefront TypeScript, and manual
browser checks when an existing storefront server is available.
```

- [ ] **Step 4: Validate documentation formatting**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

- [ ] **Step 5: Commit the documentation**

```bash
git add \
  README.md \
  storefront/README.md \
  docs/superpowers/specs/2026-08-14-footer-agency-link-preview-design.md
git commit -m "Document footer agency link preview"
```

## Task 4: Verify The Completed Interaction

**Files:**
- Verify: `storefront/src/components/ui/LinkPreview.tsx`
- Verify: `storefront/src/components/Footer.tsx`
- Verify: `storefront/src/components/CollectionsSection.tsx`
- Verify: `storefront/src/components/ui/__tests__/link-preview.unit.mjs`

- [ ] **Step 1: Run the complete focused command set**

Run:

```bash
node storefront/src/components/ui/__tests__/link-preview.unit.mjs
node 'storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs'
pnpm --dir storefront exec eslint \
  src/components/ui/LinkPreview.tsx \
  src/components/Footer.tsx
pnpm --dir storefront exec tsc --noEmit --incremental false
git diff --check
```

Expected: all commands exit with code 0, except permitted existing ESLint image
warnings that do not change the exit status.

- [ ] **Step 2: Check whether the storefront is already running**

Run:

```bash
curl -I --max-time 5 http://localhost:8000
```

If the request succeeds, continue to browser verification. If it fails, do not
start or restart a server; record that browser verification requires:

```bash
pnpm dev:storefront
```

and wait for explicit permission before changing server lifecycle state.

- [ ] **Step 3: Load the Agent Browser command reference**

Run:

```bash
agent-browser skills get core --full
```

Use the returned command syntax for the following checks. Fall back to the
installed Playwright browser skill only if `agent-browser` is missing or fails,
and report that fallback.

- [ ] **Step 4: Verify desktop hover and keyboard behavior**

Open `http://localhost:8000`, scroll to the footer, and inspect the
**Agency by Naman Kataria** link.

Verify:

- Hover opens a 320 by 200 preview above the credit.
- Pointer movement shifts the preview horizontally without moving footer layout.
- The preview screenshot represents `agency.namankataria.com`.
- Tabbing to the credit shows the existing focus ring and opens the preview.
- The trigger remains a normal link to the agency URL.
- The preview surface opens the same URL in a new tab.
- No elements overlap at a desktop viewport.

Capture a desktop screenshot showing the open preview.

- [ ] **Step 5: Verify reduced motion and mobile layout**

Use Agent Browser's media emulation for `prefers-reduced-motion: reduce` when
available. Confirm the preview uses opacity only and does not translate or
scale.

At a mobile viewport, verify the footer credit wraps cleanly, remains tappable,
and does not overlap the copyright text. Capture a mobile footer screenshot.

- [ ] **Step 6: Review the final diff and graph impact**

Run:

```bash
git status --short
git diff --stat HEAD~3..HEAD
gortex query usages \
  'storefront/src/components/ui/LinkPreview.tsx::LinkPreview' \
  --limit 50 \
  --format json
```

Expected: `LinkPreview` remains consumed only by `Footer.tsx` and
`CollectionsSection.tsx`; both callers are covered by the focused source-level
tests. Unrelated pre-existing workspace changes must remain untouched.
