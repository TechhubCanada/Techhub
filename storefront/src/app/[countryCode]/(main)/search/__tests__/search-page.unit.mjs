import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../../..")
const searchPageSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/search/page.tsx"),
  "utf8"
)

assert.equal(searchPageSource.includes("const searchProducts = async"), true)
assert.equal(searchPageSource.includes("catch {"), true)
assert.equal(searchPageSource.includes("console.error"), false)
assert.equal(searchPageSource.includes("productsIds={productIds}"), true)
