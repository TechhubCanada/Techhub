import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../../..")
const gallerySource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/modules/products/components/image-gallery/index.tsx"
  ),
  "utf8"
)
const thumbnailSource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/modules/products/components/thumbnail/index.tsx"
  ),
  "utf8"
)

assert.equal(gallerySource.includes('aspect-square w-full bg-white'), true)
assert.equal(gallerySource.includes('className="object-contain p-4"'), true)
assert.equal(
  thumbnailSource.includes(
    'className="absolute inset-0 bg-white object-contain object-center p-3"'
  ),
  true
)
