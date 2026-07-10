import assert from "node:assert/strict"

import {
  getProxyTimeoutMs,
  getRealtimePublishableKey,
  isRealtimeProxyPath,
  prepareForwardHeaders,
} from "../proxy-utils.ts"

const baseHeaders = new Headers({
  host: "localhost:8000",
  connection: "keep-alive",
})

assert.equal(isRealtimeProxyPath(["store", "realtime"]), true)
assert.equal(isRealtimeProxyPath(["store", "products"]), false)
assert.equal(getProxyTimeoutMs(["store", "realtime"]), undefined)
assert.equal(getProxyTimeoutMs(["store", "products"]), 10000)

const realtimeHeaders = prepareForwardHeaders(
  baseHeaders,
  ["store", "realtime"],
  "pk_test"
)

assert.equal(realtimeHeaders.get("x-publishable-api-key"), "pk_test")
assert.equal(realtimeHeaders.has("host"), false)

const existingHeader = prepareForwardHeaders(
  new Headers({ "x-publishable-api-key": "pk_existing" }),
  ["store", "realtime"],
  "pk_test"
)

assert.equal(existingHeader.get("x-publishable-api-key"), "pk_existing")
assert.equal(
  getRealtimePublishableKey(
    new URL("http://localhost:8000/medusa/store/realtime?publishable_key=pk_q")
  ),
  "pk_q"
)
