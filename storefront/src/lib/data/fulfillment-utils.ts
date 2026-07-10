import { HttpTypes } from "@medusajs/types"

type ShippingOptionWithAmount = HttpTypes.StoreCartShippingOption & {
  amount: number
}

export const isPricedShippingOption = (
  option: Partial<Pick<HttpTypes.StoreCartShippingOption, "amount">>
): option is ShippingOptionWithAmount => {
  return typeof option.amount === "number" && Number.isFinite(option.amount)
}
