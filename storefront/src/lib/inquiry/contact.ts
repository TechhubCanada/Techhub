import { z } from "zod"

const requestTypes = [
  "business",
  "store",
  "networking",
  "repair",
  "gaming",
  "web",
  "quote",
  "other",
] as const

export const inquiryContactSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z.string().trim().max(40, "Phone number is too long.").optional(),
    company: z.string().trim().max(120, "Company name is too long.").optional(),
    requestType: z.enum(requestTypes, {
      error: "Choose a request type.",
    }),
    otherRequestType: z
      .string()
      .trim()
      .max(120, "Other request type is too long.")
      .optional(),
    message: z
      .string()
      .trim()
      .min(20, "Tell us a little more about the request.")
      .max(2000, "Keep the request under 2000 characters."),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.requestType === "other" && !input.otherRequestType) {
      context.addIssue({
        code: "custom",
        path: ["otherRequestType"],
        message: "Tell us what type of request this is.",
      })
    }
  })

export type InquiryContactInput = z.infer<typeof inquiryContactSchema>

const requestTypeLabels: Record<InquiryContactInput["requestType"], string> = {
  business: "Business hardware",
  store: "Store product request",
  networking: "Networking and IT",
  repair: "Repairs and service",
  gaming: "Gaming products and setup",
  web: "Web development",
  quote: "Quote or bulk pricing",
  other: "Other request",
}

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

export const getInquiryRequestTypeLabel = (
  requestType: InquiryContactInput["requestType"]
) => requestTypeLabels[requestType]

export const buildInquiryEmailHtml = (input: InquiryContactInput) => {
  const phone = input.phone || "Not provided"
  const company = input.company || "Not provided"
  const otherRequestType = input.otherRequestType || "Not provided"

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">New TechHub inquiry</h1>
      <p style="margin: 0 0 24px;">A customer submitted the B2B and store inquiry form.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tr><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0;">${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${escapeHtml(input.email)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${escapeHtml(phone)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${escapeHtml(company)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Request type</td><td style="padding: 8px 0;">${escapeHtml(getInquiryRequestTypeLabel(input.requestType))}</td></tr>
        ${
          input.requestType === "other"
            ? `<tr><td style="padding: 8px 0; color: #666;">Other request</td><td style="padding: 8px 0;">${escapeHtml(otherRequestType)}</td></tr>`
            : ""
        }
      </table>
      <h2 style="font-size: 16px; margin: 24px 0 8px;">Message</h2>
      <p style="white-space: pre-line; margin: 0;">${escapeHtml(input.message)}</p>
    </div>
  `
}
