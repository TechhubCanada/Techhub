import assert from "node:assert/strict"

import {
  createWishlistPayload,
  normalizeAddWishlistVariantInput,
} from "../wishlist-payload.ts"

assert.deepEqual(createWishlistPayload("sc_123"), {
  name: "Favorites",
  sales_channel_id: "sc_123",
})

assert.deepEqual(
  normalizeAddWishlistVariantInput({
    variantId: "variant_123",
    salesChannelId: "sc_123",
  }),
  {
    variantId: "variant_123",
    salesChannelId: "sc_123",
  }
)

assert.throws(
  () =>
    normalizeAddWishlistVariantInput({
      variantId: "variant_123",
      salesChannelId: undefined,
    }),
  /Missing sales channel ID/
)
