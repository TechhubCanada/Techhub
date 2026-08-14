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
const hoverCardContentOpeningTag =
  linkPreviewSource.match(/<HoverCardPrimitive\.Content[\s\S]*?>/)?.[0] ?? ""

assert.equal(linkPreviewSource.includes("previewImageAlt?: string"), true)
assert.equal(hoverCardContentOpeningTag.includes("forceMount"), true)
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
