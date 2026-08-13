import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../../..")
const inspirationSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/inspiration/page.tsx"),
  "utf8"
)

const requiredAssetPaths = [
  "/images/content/techhub-desktop-computer.jpg",
  "/images/content/techhub-business-laptops.jpg",
  "/images/content/techhub-imac-workstation.jpg",
  "/images/content/techhub-gaming-products.jpg",
]

for (const assetPath of requiredAssetPaths) {
  assert.equal(
    existsSync(resolve(repoRoot, `storefront/public${assetPath}`)),
    true
  )
  assert.equal(inspirationSource.includes(`"${assetPath}"`), true)
}

for (const label of [
  "Desktop Computers",
  "Options for every task",
  "Business Laptops",
  "Reliable and ready",
  "Gaming Products",
  "Devices and accessories",
]) {
  assert.equal(inspirationSource.includes(label), true)
}
