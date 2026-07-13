import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../..")
const homepageSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/page.tsx"),
  "utf8"
)
const animatedBrandSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/AnimatedBrandCloud.tsx"),
  "utf8"
)

assert.equal(
  existsSync(
    resolve(repoRoot, "storefront/src/components/AnimatedBrandCloud.tsx")
  ),
  true
)
assert.equal(homepageSource.includes("AnimatedBrandCloud"), true)
assert.equal(homepageSource.includes("fallbackMarketplaceLinks"), false)
assert.equal(homepageSource.includes("marketplaceAccounts.length === 0"), true)
assert.equal(homepageSource.includes("Best Buy Marketplace"), false)
assert.equal(homepageSource.includes("Add Amazon link"), false)
assert.equal(homepageSource.includes("hover:scale-105"), true)

for (const brand of ["Dell", "Samsung", "Acer", "ASUS", "Microsoft"]) {
  assert.equal(homepageSource.includes(`"${brand}"`), true)
}

assert.equal(animatedBrandSource.includes('"use client"'), true)
assert.equal(animatedBrandSource.includes("AnimatePresence"), true)
assert.equal(animatedBrandSource.includes('filter: "blur(12px)"'), true)
assert.equal(animatedBrandSource.includes("We carry"), true)
assert.equal(
  animatedBrandSource.includes("aria-label={`We carry ${activeBrand}.`}"),
  true
)
assert.equal(animatedBrandSource.includes("Brands we carry:"), false)
assert.equal(animatedBrandSource.includes("brands.map"), false)
