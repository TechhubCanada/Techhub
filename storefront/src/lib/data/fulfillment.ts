"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { isPricedShippingOption } from "@lib/data/fulfillment-utils"

// Shipping actions
export const listCartShippingMethods = async function (cartId: string) {
  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(
      `/store/shipping-options`,
      {
        query: { cart_id: cartId, fields: "*" },
        cache: "no-store",
      }
    )
    .then(({ shipping_options }) =>
      shipping_options.filter(isPricedShippingOption)
    )
    .catch(() => {
      return null
    })
}
