import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const routeSource = readFileSync(
  resolve(import.meta.dirname, "../route.ts"),
  "utf8"
)
const normalizedRouteSource = routeSource.replace(/\s+/g, " ")

assert.equal(routeSource.includes("inquiryContactSchema.safeParse(payload)"), true)
assert.equal(routeSource.includes('{ message: "Invalid request body." }'), true)
assert.equal(
  normalizedRouteSource.includes(
    '{ message: "Please check the form and try again.", errors: parsed.error.flatten().fieldErrors, }'
  ),
  true
)
assert.equal(routeSource.includes("status: 400"), true)
assert.equal(routeSource.includes("if (!apiKey || !from)"), true)
assert.equal(
  routeSource.includes(
    'process.env.CONTACT_INQUIRY_TO || storeBusinessInfo.email.label'
  ),
  true
)
assert.equal(routeSource.includes("to: [getInquiryRecipient()]"), true)
assert.equal(routeSource.includes("reply_to: parsed.data.email"), true)
assert.equal(
  routeSource.includes(
    "subject: `TechHub inquiry: ${getInquiryRequestTypeLabel(parsed.data.requestType)}`"
  ),
  true
)
assert.equal(routeSource.includes("html: buildInquiryEmailHtml(parsed.data)"), true)
assert.equal(routeSource.includes("if (!response.ok)"), true)
assert.equal(
  routeSource.includes('{ message: "Could not send the inquiry right now." }'),
  true
)
assert.equal(routeSource.includes("status: 502"), true)
assert.equal(routeSource.includes("return NextResponse.json({ ok: true })"), true)
