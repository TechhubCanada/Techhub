import assert from "node:assert/strict"

import { getShippingMethodsViewState } from "../view-state.ts"

assert.equal(getShippingMethodsViewState(undefined), "loading")
assert.equal(getShippingMethodsViewState(null), "unavailable")
assert.equal(getShippingMethodsViewState([]), "empty")
assert.equal(getShippingMethodsViewState([{ id: "ship_standard" }]), "ready")
