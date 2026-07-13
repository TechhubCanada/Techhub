import assert from "node:assert/strict"

import { addressesFormSchema } from "../../modules/checkout/utils/address-schema.ts"

const parsed = addressesFormSchema.safeParse({
  shipping_address: {
    first_name: "Test",
    last_name: "Account",
    company: null,
    address_1: "7595 Markham Rd Unit 2",
    address_2: null,
    city: "Markham",
    postal_code: "L3S 0B6",
    province: "ON",
    country_code: "ca",
    phone: "9055550100",
  },
  same_as_billing: "on",
})

assert.equal(parsed.success, true)
