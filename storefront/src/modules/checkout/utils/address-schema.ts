import { z } from "zod"

const optionalAddressField = z.string().optional().nullable()

const addressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: optionalAddressField,
  address_1: z.string().min(1),
  address_2: optionalAddressField,
  city: z.string().min(1),
  postal_code: z.string().min(1),
  province: optionalAddressField,
  country_code: z.string().min(2),
  phone: optionalAddressField,
})

export const addressesFormSchema = z
  .object({
    shipping_address: addressSchema,
  })
  .and(
    z.discriminatedUnion("same_as_billing", [
      z.object({
        same_as_billing: z.literal("on"),
      }),
      z.object({
        same_as_billing: z.literal("off").optional(),
        billing_address: addressSchema,
      }),
    ])
  )
