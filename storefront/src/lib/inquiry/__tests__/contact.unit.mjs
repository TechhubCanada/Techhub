import assert from "node:assert/strict"

import {
  buildInquiryEmailHtml,
  getInquiryRequestTypeLabel,
  inquiryContactSchema,
} from "../contact.ts"

const validInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "905-555-0100",
  company: "Analytical Engines Inc.",
  requestType: "business",
  message: "We need laptops, monitors, and setup support for a new office.",
}

assert.equal(inquiryContactSchema.safeParse(validInput).success, true)
assert.equal(getInquiryRequestTypeLabel("business"), "Business hardware")
assert.equal(getInquiryRequestTypeLabel("gaming"), "Gaming products and setup")

const invalidInput = inquiryContactSchema.safeParse({
  ...validInput,
  email: "not-an-email",
  message: "Too short",
})

assert.equal(invalidInput.success, false)

const invalidOtherInput = inquiryContactSchema.safeParse({
  ...validInput,
  requestType: "other",
  otherRequestType: "",
})

assert.equal(invalidOtherInput.success, false)

assert.equal(
  inquiryContactSchema.safeParse({
    ...validInput,
    requestType: "other",
    otherRequestType: "School lab installation",
  }).success,
  true
)

const html = buildInquiryEmailHtml({
  ...validInput,
  name: "<script>alert(1)</script>",
})

assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
assert.doesNotMatch(html, /<script>alert/)
