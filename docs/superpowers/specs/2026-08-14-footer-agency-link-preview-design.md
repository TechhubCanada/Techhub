# Footer Agency Link Preview Design

## Goal

Refine the footer credit link, **Agency by Naman Kataria**, so it uses the
same interaction model as Aceternity UI's Link Preview component while
remaining consistent with the TechHub storefront.

## Current State

The footer already renders the shared `LinkPreview` component for
`https://agency.namankataria.com`. The component already uses Radix Hover
Card, Motion, and Microlink screenshots, but it needs a focused parity and
accessibility pass before the storefront behavior can be considered complete.

## Approved Approach

Keep the existing shared `LinkPreview` component and refine it rather than
adding a second footer-only implementation. The footer will continue to pass a
320 by 200 preview size and preserve its current credit copy, underline
animation, colors, layout, and focus styling.

The shared component will retain Aceternity's core behavior:

- Open a website screenshot above the link after a short hover or focus delay.
- Animate the preview into view with opacity, vertical movement, and scale.
- Shift the preview horizontally in response to pointer position over the link.
- Render the screenshot inside a bordered, rounded preview surface.
- Allow the preview itself to open the same destination in a new tab.

## Interaction And Accessibility

The trigger remains a normal anchor, so touch devices and browsers without
hover support can still navigate directly to the agency website.

Keyboard focus must open the hover card through Radix's trigger behavior and
retain the footer's existing visible focus ring. Motion must collapse to
opacity-only transitions when the visitor requests reduced motion.

The hidden preload image is decorative and must not be announced. The visible
website screenshot must have destination-specific alternative text rather than
the generic `preview image` label. Any link that opens a new tab must use
`rel="noopener noreferrer"`.

## Failure And Fallback Behavior

Microlink remains the live screenshot provider. If the screenshot request
fails, the footer credit still behaves as a normal external link; the preview
is an enhancement and must not block navigation.

No new API route, environment variable, backend integration, or static image
asset is required.

## File Scope

- Modify `storefront/src/components/ui/LinkPreview.tsx` to refine the shared
  Aceternity-style interaction and accessibility details.
- Modify `storefront/src/components/Footer.tsx` only if the footer instance
  needs an explicit preview label or external-link option.
- Add focused source-level coverage under the existing storefront test
  conventions for the footer wiring and shared preview guarantees.
- Update `storefront/README.md`, the root documentation index, and the root
  documentation version to describe the completed behavior accurately.

## Verification

Run focused storefront tests for the footer and link-preview component, then
run storefront lint or type checking for the touched files.

Browser verification must use `agent-browser` against the already-running
storefront at `http://localhost:8000`. Do not start, stop, restart, or kill the
storefront server without explicit user permission. Verify:

- The footer credit remains correctly aligned on desktop and mobile.
- Hovering the credit opens the 320 by 200 agency website preview.
- Moving across the trigger shifts the preview without layout movement.
- Keyboard focus exposes the preview and retains a visible focus indicator.
- Clicking the trigger navigates to the agency site.
- Reduced-motion emulation removes translation and scale animation.

If no storefront server is already available, report the browser verification
command that remains to be run instead of changing server lifecycle state.

## Non-Goals

- Redesigning the footer.
- Changing the agency credit wording or destination.
- Introducing a static screenshot asset.
- Applying link previews to unrelated storefront links.
- Replacing Radix Hover Card, Motion, or Microlink.
