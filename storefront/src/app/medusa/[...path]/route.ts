import { NextRequest } from "next/server"
import { getMedusaBackendUrl } from "@lib/medusa-url"
import {
  getProxyTimeoutMs,
  getRealtimePublishableKey,
  prepareForwardHeaders,
} from "./proxy-utils"

export const dynamic = "force-dynamic"

const excludedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
])

type RouteContext = {
  params: Promise<{ path?: string[] }>
}

function getBackendUrl() {
  return getMedusaBackendUrl({
    isServer: true,
    serverUrl: process.env.MEDUSA_BACKEND_URL,
    publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  }).replace(/\/$/, "")
}

function getTargetUrl(request: NextRequest, path: string[] = []) {
  const requestUrl = new URL(request.url)
  const targetPath = path.map(encodeURIComponent).join("/")

  return `${getBackendUrl()}/${targetPath}${requestUrl.search}`
}

function getResponseHeaders(response: Response) {
  const headers = new Headers(response.headers)

  excludedResponseHeaders.forEach((header) => headers.delete(header))

  return headers
}

async function proxyMedusaRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const method = request.method.toUpperCase()
  const hasBody = method !== "GET" && method !== "HEAD"
  const body = hasBody ? await request.arrayBuffer() : undefined
  const timeoutMs = getProxyTimeoutMs(path)
  const controller = timeoutMs ? new AbortController() : undefined
  const timeout = timeoutMs
    ? setTimeout(() => controller?.abort(), timeoutMs)
    : undefined

  let response: Response

  try {
    response = await fetch(getTargetUrl(request, path), {
      method,
      headers: prepareForwardHeaders(
        request.headers,
        path,
        getRealtimePublishableKey(new URL(request.url)) ??
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      ),
      body,
      cache: "no-store",
      redirect: "manual",
      signal: controller?.signal,
    })
  } catch (error) {
    return Response.json(
      {
        error: "Medusa proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    )
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: getResponseHeaders(response),
  })
}

export const GET = proxyMedusaRequest
export const POST = proxyMedusaRequest
export const PUT = proxyMedusaRequest
export const PATCH = proxyMedusaRequest
export const DELETE = proxyMedusaRequest
export const OPTIONS = proxyMedusaRequest
