import assert from "node:assert/strict"

import {
  getShippingMethodFulfillmentType,
  getShippingMethodsViewState,
} from "../view-state.ts"

assert.equal(getShippingMethodsViewState(undefined), "loading")
assert.equal(getShippingMethodsViewState(null), "unavailable")
assert.equal(getShippingMethodsViewState([]), "empty")
assert.equal(getShippingMethodsViewState([{ id: "ship_standard" }]), "ready")

assert.equal(
  getShippingMethodFulfillmentType({
    service_zone: { fulfillment_set: { type: "pickup" } },
  }),
  "pickup"
)
assert.equal(
  getShippingMethodFulfillmentType({
    service_zone: { fulfillment_set: { type: "shipping" } },
  }),
  "shipping"
)
assert.equal(getShippingMethodFulfillmentType({}), "shipping")
