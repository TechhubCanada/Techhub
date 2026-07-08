export type CheckoutAddressLike = {
  first_name?: string | null
  last_name?: string | null
  address_1?: string | null
  city?: string | null
  postal_code?: string | null
  country_code?: string | null
}

const hasText = (value?: string | null) => Boolean(value?.trim())

export const isCheckoutAddressComplete = (address?: CheckoutAddressLike) => {
  return Boolean(
    address &&
    hasText(address.first_name) &&
    hasText(address.last_name) &&
    hasText(address.address_1) &&
    hasText(address.city) &&
    hasText(address.postal_code) &&
    hasText(address.country_code)
  )
}
