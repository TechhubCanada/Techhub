import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../../..")
const aboutSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/about/page.tsx"),
  "utf8"
)

const normalizedAboutSource = aboutSource.replace(/\s+/g, " ")

const requiredAssetPaths = [
  "/images/content/techhub-canadian-excellence-hero.png",
  "/images/content/techhub-delivery-box.png",
  "/images/content/techhub-laptop-repair-hands.jpg",
  "/images/content/techhub-customer-rating.jpg",
]

for (const assetPath of requiredAssetPaths) {
  assert.equal(
    existsSync(resolve(repoRoot, `storefront/public${assetPath}`)),
    true
  )
  assert.equal(aboutSource.includes(`"${assetPath}"`), true)
}

assert.equal(
  normalizedAboutSource.includes(
    "We help customers shop for computers, laptops, tablets, networking equipment, software, printers, and accessories."
  ),
  true
)
assert.equal(
  normalizedAboutSource.includes(
    "We work with customers who need a new computer, a stronger network, a printer that fits their workflow, or parts to keep a device running longer."
  ),
  false
)
