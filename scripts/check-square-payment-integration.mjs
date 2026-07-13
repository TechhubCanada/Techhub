import assert from "node:assert/strict"
import { existsSync, statSync } from "node:fs"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

const readJson = (path) => JSON.parse(readFileSync(join(root, path), "utf8"))
const readText = (path) => readFileSync(join(root, path), "utf8")

const medusaPackage = readJson("medusa/package.json")
const storefrontPackage = readJson("storefront/package.json")
const medusaConfig = readText("medusa/medusa-config.js")
const seed = readText("medusa/src/scripts/seed.ts")
const constants = readText("storefront/src/lib/constants.tsx")
const paymentData = readText("storefront/src/lib/data/payment.ts")
const cartData = readText("storefront/src/lib/data/cart.ts")
const hooks = readText("storefront/src/hooks/cart.ts")
const payment = readText("storefront/src/modules/checkout/components/payment/index.tsx")
const footer = readText("storefront/src/components/Footer.tsx")
const supportedCardBrands = readText(
  "storefront/src/components/SupportedCardBrands.tsx"
)
const paymentButton = readText(
  "storefront/src/modules/checkout/components/payment-button/index.tsx"
)
const paymentCardButton = readText(
  "storefront/src/modules/checkout/components/payment-card-button/index.tsx"
)
const squarePaymentForm = readText(
  "storefront/src/modules/checkout/components/square-payment-form/index.tsx"
)
const proxy = readText("storefront/src/proxy.ts")
const squarePluginPatch = readText(
  "patches/@weareseeed__medusa-square-plugin@0.0.30.patch"
)
const applePayAssociationPath =
  "storefront/public/.well-known/apple-developer-merchantid-domain-association"
const applePayAssociationFile = join(root, applePayAssociationPath)

assert.equal(
  medusaPackage.dependencies["@weareseeed/medusa-square-plugin"],
  "^0.0.30",
  "Medusa backend must depend on the Square plugin"
)
assert.equal(
  storefrontPackage.dependencies["react-square-web-payments-sdk"],
  "^3.3.0",
  "Storefront must depend on Square Web Payments React SDK"
)

assert.match(
  medusaConfig,
  /@weareseeed\/medusa-square-plugin\/providers\/square-payment/,
  "Medusa payment module must register the Square payment provider"
)
assert.match(
  medusaConfig,
  /plugins:\s*\[/,
  "Medusa config must register plugin entries"
)
assert.match(
  medusaConfig,
  /resolve:\s*["']@weareseeed\/medusa-square-plugin["']/,
  "Medusa config must register the Square plugin for Admin UI/routes"
)
assert.doesNotMatch(
  medusaConfig,
  /@medusajs\/medusa\/payment-stripe/,
  "Stripe payment provider should no longer be registered"
)
assert.match(
  seed,
  /pp_square_square/,
  "Seed regions must enable the Square payment provider"
)

assert.match(constants, /pp_square_square/, "Payment labels must include Square")
assert.match(constants, /isSquare/, "Payment helpers must detect Square provider IDs")

assert.match(
  paymentData,
  /\/store\/square\/config/,
  "Storefront must fetch Square public config through Medusa SDK"
)
assert.match(
  cartData,
  /data\?:\s*Record<string, unknown>/,
  "Payment session action must accept provider data"
)
assert.match(
  cartData,
  /provider_id,\s*\n\s*data,/,
  "Payment session action must pass provider data to Medusa"
)
assert.match(
  hooks,
  /data\?:\s*Record<string, unknown>/,
  "Payment session hook must accept provider data"
)

assert.match(
  paymentCardButton,
  /SquarePaymentForm/,
  "Payment card button must render the Square payment form"
)
assert.match(
  paymentCardButton,
  /isSquare/,
  "Payment card button must advance Square checkout after tokenization"
)
assert.match(
  squarePaymentForm,
  /ApplePay/,
  "Square payment form must include Apple Pay"
)
assert.ok(
  existsSync(applePayAssociationFile),
  "Square Apple Pay domain association file must be served from storefront public/.well-known"
)
assert.ok(
  statSync(applePayAssociationFile).size > 0,
  "Square Apple Pay domain association file must not be empty"
)
assert.match(
  proxy,
  /\\\.well-known/,
  "Storefront country-code proxy must exclude .well-known Apple Pay verification paths"
)
assert.ok(
  existsSync(join(root, "scripts/check-square-apple-pay-production.mjs")),
  "Repository must include a production Apple Pay domain verification check"
)
assert.match(
  squarePaymentForm,
  /GooglePay/,
  "Square payment form must include Google Pay"
)
assert.match(
  squarePaymentForm,
  /SupportedCardBrands/,
  "Square payment form must show supported card brands outside the credit card element"
)
assert.match(
  supportedCardBrands,
  /rotateY\(180deg\)/,
  "Supported card brands must include a hover flip treatment"
)
assert.match(
  footer,
  /SupportedCardBrands/,
  "Footer must show supported payment brands"
)
assert.match(
  supportedCardBrands,
  /Apple Pay/,
  "Supported payment brands must include Apple Pay"
)
assert.match(
  supportedCardBrands,
  /Google Pay/,
  "Supported payment brands must include Google Pay"
)
assert.match(
  paymentButton,
  /isSquare/,
  "Review payment button must place Square orders without Stripe confirmation"
)
assert.match(
  squarePluginPatch,
  /hostname === "squareupsandbox\.com"/,
  "Square plugin patch must detect the sandbox OAuth host"
)
assert.match(
  squarePluginPatch,
  /hostname = "connect\.squareupsandbox\.com"/,
  "Square plugin patch must normalize sandbox OAuth redirects to Square's connect host"
)
assert.match(
  squarePluginPatch,
  /searchParams\.delete\("session"\)/,
  "Square plugin patch must remove session=false from sandbox OAuth redirects"
)

console.log("Square payment integration checks passed")
