import assert from "node:assert/strict"
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
const paymentButton = readText(
  "storefront/src/modules/checkout/components/payment-button/index.tsx"
)
const paymentCardButton = readText(
  "storefront/src/modules/checkout/components/payment-card-button/index.tsx"
)
const squarePaymentForm = readText(
  "storefront/src/modules/checkout/components/square-payment-form/index.tsx"
)

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
assert.match(
  squarePaymentForm,
  /GooglePay/,
  "Square payment form must include Google Pay"
)
assert.match(
  paymentButton,
  /isSquare/,
  "Review payment button must place Square orders without Stripe confirmation"
)

console.log("Square payment integration checks passed")
