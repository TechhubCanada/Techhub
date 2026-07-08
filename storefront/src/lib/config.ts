import Medusa from "@medusajs/js-sdk"
import { getMedusaBackendUrl } from "./medusa-url"

const MEDUSA_BACKEND_URL = getMedusaBackendUrl({
  isServer: typeof window === "undefined",
  serverUrl: process.env.MEDUSA_BACKEND_URL,
  publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
})

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
