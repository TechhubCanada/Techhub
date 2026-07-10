import { NextRequest } from "next/server"
import { getMedusaBackendUrl } from "@lib/medusa-url"
import { getAuthHeaders } from "@lib/data/cookies"

const BACKEND_URL = getMedusaBackendUrl({
  isServer: true,
  serverUrl: process.env.MEDUSA_BACKEND_URL,
  publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
})

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const targetUrl = `${BACKEND_URL.replace(/\/$/, "")}/store/orders/${encodeURIComponent(id)}/invoice`

  const response = await fetch(targetUrl, {
    headers: await getAuthHeaders(),
    redirect: "manual",
    cache: "no-store",
  })

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location")

    if (location) {
      return Response.redirect(location)
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}
