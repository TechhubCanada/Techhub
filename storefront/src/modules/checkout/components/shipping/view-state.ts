export type ShippingMethodsViewState =
  "loading" | "unavailable" | "empty" | "ready"

export type ShippingMethodFulfillmentType = "pickup" | "shipping"

type ShippingMethodWithFulfillmentSet = {
  service_zone?: {
    fulfillment_set?: {
      type?: string | null
    } | null
  } | null
}

export const getShippingMethodFulfillmentType = (
  method: ShippingMethodWithFulfillmentSet
): ShippingMethodFulfillmentType => {
  return method.service_zone?.fulfillment_set?.type === "pickup"
    ? "pickup"
    : "shipping"
}

export const getShippingMethodsViewState = (
  shippingMethods: readonly unknown[] | null | undefined
): ShippingMethodsViewState => {
  if (shippingMethods === undefined) {
    return "loading"
  }

  if (shippingMethods === null) {
    return "unavailable"
  }

  if (shippingMethods.length === 0) {
    return "empty"
  }

  return "ready"
}
