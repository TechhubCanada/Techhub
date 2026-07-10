import assert from "node:assert/strict"

import { isPricedShippingOption } from "../fulfillment-utils.ts"

assert.equal(isPricedShippingOption({ amount: 0 }), true)
assert.equal(isPricedShippingOption({ amount: 12.5 }), true)
assert.equal(isPricedShippingOption({}), false)
assert.equal(isPricedShippingOption({ amount: null }), false)
assert.equal(isPricedShippingOption({ amount: Number.NaN }), false)
