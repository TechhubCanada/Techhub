import { getMedusaBackendUrl } from "@lib/medusa-url"

export const getRealtimeUrl = () => {
  const baseUrl = getMedusaBackendUrl({
    isServer: false,
    publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  })

  return `${baseUrl.replace(/\/$/, "")}/store/realtime`
}
