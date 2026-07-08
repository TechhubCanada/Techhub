import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export type SquarePaymentConfig = {
  location_id: string
  application_id: string
  currency: string
  capabilities?: string[]
} | null

// Shipping actions
export const listCartPaymentMethods = async function (regionId: string) {
  return sdk.client
    .fetch<HttpTypes.StorePaymentProviderListResponse>(
      "/store/payment-providers",
      {
        query: { region_id: regionId },
        next: { tags: ["payment_providers"] },
        cache: "force-cache",
      }
    )
    .then(({ payment_providers }) => payment_providers)
    .catch(() => {
      return null
    })
}

export const getSquarePaymentConfig = async function () {
  return sdk.client
    .fetch<SquarePaymentConfig>("/store/square/config", {
      cache: "no-store",
    })
    .catch(() => {
      return null
    })
}
