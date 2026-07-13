import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../..")
const homepageSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/page.tsx"),
  "utf8"
)
const heroImagePath = "/images/content/techhub-homepage-hero-banner.png"

assert.equal(
  existsSync(resolve(repoRoot, `storefront/public${heroImagePath}`)),
  true
)
assert.equal(homepageSource.includes(`image: "${heroImagePath}"`), true)
assert.equal(homepageSource.includes(`"${heroImagePath}"`), true)
assert.equal(homepageSource.includes("/FINAL BANNER.png"), false)
assert.equal(
  homepageSource.includes(
    "Shop computers, networking, gaming gear, parts, and support for home, work, and client projects."
  ),
  false
)
assert.equal(homepageSource.includes("heroCategories.map"), false)
assert.equal(homepageSource.includes("B2B inquiries"), false)
