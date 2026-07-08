import assert from "node:assert/strict"
import { resolveSelectedIds } from "../../storefront/src/modules/store/templates/filter-utils.ts"

const items = [
  { id: "col_1", handle: "laptops" },
  { id: "col_2", handle: "desktops" },
]

assert.deepEqual(resolveSelectedIds(items, ["laptops"], "handle"), ["col_1"])
assert.equal(resolveSelectedIds(items, ["all"], "handle"), undefined)
assert.equal(resolveSelectedIds(items, [], "handle"), undefined)
assert.equal(resolveSelectedIds(items, undefined, "handle"), undefined)
