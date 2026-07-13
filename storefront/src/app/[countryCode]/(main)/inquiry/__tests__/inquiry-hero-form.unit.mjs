import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../../..")
const pageSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/inquiry/page.tsx"),
  "utf8"
)

const heroStart = pageSource.indexOf("<section")
const heroEnd = pageSource.indexOf("</section>")
const heroSource = pageSource.slice(heroStart, heroEnd)
const belowHeroSource = pageSource.slice(heroEnd)

assert.notEqual(heroStart, -1)
assert.notEqual(heroEnd, -1)
assert.equal(heroSource.includes("<ContactInquiryForm />"), true)
assert.equal(heroSource.includes("Contact form"), true)
assert.equal(heroSource.includes("Send the details directly."), true)
assert.equal(heroSource.includes("Call {storeBusinessInfo.phone.label}"), true)
assert.equal(heroSource.includes("Direct intake"), true)
assert.equal(heroSource.includes("Product, repair, and setup requests."), true)
assert.equal(heroSource.includes("requestHighlights.map"), false)
assert.equal(heroSource.includes("Typical reply"), false)
assert.equal(heroSource.includes("Step 1"), false)
assert.equal(heroSource.includes("lg:min-h-svh"), false)
assert.equal(heroSource.includes("lg:min-h-[calc"), false)
assert.equal(heroSource.includes("min-h-[calc(100vh-7rem)]"), false)
assert.equal(heroSource.includes("lg:text-[2.25rem]"), true)
assert.equal(heroSource.includes("lg:py-2.5"), true)
assert.equal(heroSource.includes("lg:p-3"), true)
assert.equal(heroSource.includes("Include products, quantities"), false)
assert.equal(heroSource.includes("Secure form"), false)
assert.equal(heroSource.includes("bg-white"), true)
assert.equal(heroSource.includes("text-black"), true)
assert.equal(heroSource.includes("border-grayscale-200 bg-white"), true)
assert.equal(heroSource.includes("techhub-dual-monitor-workstation.png"), false)
assert.equal(heroSource.includes("bg-black/45"), false)
assert.equal(belowHeroSource.includes("<ContactInquiryForm />"), false)
assert.equal(pageSource.includes("lg:grid-cols-[0.42fr_0.58fr]"), false)

const formSource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/app/[countryCode]/(main)/inquiry/ContactInquiryForm.tsx"
  ),
  "utf8"
)

assert.equal(formSource.includes("rows={2}"), true)
assert.equal(formSource.includes("rows={3}"), false)
assert.equal(formSource.includes("rows={4}"), false)
assert.equal(formSource.includes("rows={6}"), false)
assert.equal(formSource.includes("md:gap-5"), true)
assert.equal(formSource.includes('uiSize: "md"'), true)
assert.equal(formSource.includes("lg:gap-3"), true)
