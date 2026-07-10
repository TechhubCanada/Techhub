export type AddWishlistVariantInput = {
  variantId: unknown
  salesChannelId: unknown
}

const assertString = (value: unknown, message: string) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(message)
  }

  return value
}

export const createWishlistPayload = (salesChannelId: unknown) => ({
  name: "Favorites",
  sales_channel_id: assertString(
    salesChannelId,
    "Missing sales channel ID when creating wishlist"
  ),
})

export const normalizeWishlistVariantId = (variantId: unknown) =>
  assertString(variantId, "Missing variant ID when adding to wishlist")

export const normalizeAddWishlistVariantInput = (
  input: AddWishlistVariantInput
) => ({
  variantId: normalizeWishlistVariantId(input.variantId),
  salesChannelId: assertString(
    input.salesChannelId,
    "Missing sales channel ID when adding to wishlist"
  ),
})
