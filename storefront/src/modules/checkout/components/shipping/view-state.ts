export type ShippingMethodsViewState =
  "loading" | "unavailable" | "empty" | "ready"

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
