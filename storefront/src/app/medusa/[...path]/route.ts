import { NextRequest } from "next/server"
import { getMedusaBackendUrl } from "@lib/medusa-url"

export const dynamic = "force-dynamic"

const BACKEND_URL = getMedusaBackendUrl({
  isServer: true,
  serverUrl: process.env.MEDUSA_BACKEND_URL,
  publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
})

const excludedRequestHeaders = new Set(["connection", "content-length", "host"])

const excludedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
])

type RouteContext = {
  params: Promise<{ path?: string[] }>
}

function getTargetUrl(request: NextRequest, path: string[] = []) {
  const requestUrl = new URL(request.url)
  const baseUrl = BACKEND_URL.replace(/\/$/, "")
  const targetPath = path.map(encodeURIComponent).join("/")

  return `${baseUrl}/${targetPath}${requestUrl.search}`
}

function getForwardHeaders(request: NextRequest) {
  const headers = new Headers(request.headers)

  excludedRequestHeaders.forEach((header) => headers.delete(header))

  return headers
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

  const response = await fetch(getTargetUrl(request, path), {
    method,
    headers: getForwardHeaders(request),
    body,
    cache: "no-store",
    redirect: "manual",
  })

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
