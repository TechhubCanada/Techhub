import { z } from "zod"

const specItemSchema = z.object({
  label: z.string(),
  value: z.string().optional().default(""),
})

export const techProductDetailsSchema = z.object({
  buying_summary: z.string().optional().default(""),
  specs: z.array(specItemSchema).optional().default([]),
  best_for: z.array(z.string()).optional().default([]),
  included: z.array(z.string()).optional().default([]),
  compatibility: z.string().optional().default(""),
  support_note: z.string().optional().default(""),
})

export type TechProductDetails = z.infer<typeof techProductDetailsSchema>

const parseLegacySpecs = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => {
      const [label, ...rest] = item.split(":")
      const parsedValue = rest.join(":").trim()

      return parsedValue
        ? { label: label.trim(), value: parsedValue }
        : { label: item.trim(), value: "" }
    })
    .filter((item) => item.label || item.value)
}

export const getTechProductDetails = (
  metadata: Record<string, unknown> | null | undefined
): TechProductDetails => {
  const parsed = techProductDetailsSchema.safeParse(
    metadata?.tech_product_details
  )

  if (parsed.success) {
    return parsed.data
  }

  return {
    buying_summary: "",
    specs: parseLegacySpecs(metadata?.specs),
    best_for: [],
    included: [],
    compatibility: "",
    support_note: "",
  }
}
