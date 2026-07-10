import assert from "node:assert/strict"
import {
  getContentMetadataString,
  getProductBuyingGuideTags,
  getSortedContentItems,
} from "../content"

const sortedItems = getSortedContentItems([
  { id: "b", metadata: { sort_order: 20 } },
  { id: "a", metadata: { sort_order: 10 } },
  { id: "c", metadata: {} },
])

assert.deepEqual(
  sortedItems.map((item) => item.id),
  ["a", "b", "c"]
)

assert.equal(
  getContentMetadataString({ cta_label: " Shop now " }, "cta_label"),
  "Shop now"
)
assert.equal(
  getContentMetadataString({ cta_label: 10 }, "cta_label"),
  undefined
)

assert.deepEqual(
  getProductBuyingGuideTags({
    type: { value: "Laptops" },
    collection: { handle: "workstations" },
    categories: [{ handle: "gaming" }, { handle: "laptops" }],
  }),
  ["Laptops", "workstations", "gaming", "laptops"]
)
