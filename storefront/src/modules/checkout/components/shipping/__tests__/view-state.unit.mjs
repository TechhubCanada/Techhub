import assert from "node:assert/strict"

import {
  canContinueFromShipping,
  getShippingMethodFulfillmentType,
  getShippingMethodsViewState,
} from "../view-state.ts"

assert.equal(getShippingMethodsViewState(undefined), "loading")
assert.equal(getShippingMethodsViewState(null), "unavailable")
assert.equal(getShippingMethodsViewState([]), "empty")
assert.equal(getShippingMethodsViewState([{ id: "ship_standard" }]), "ready")

assert.equal(canContinueFromShipping([], undefined), false)
assert.equal(canContinueFromShipping([], "so_standard"), true)
assert.equal(canContinueFromShipping([{ id: "sm_123" }], undefined), true)

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
