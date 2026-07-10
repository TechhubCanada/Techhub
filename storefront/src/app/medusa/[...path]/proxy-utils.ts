const excludedRequestHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
])

export function isRealtimeProxyPath(path: string[] = []) {
  return path.length === 2 && path[0] === "store" && path[1] === "realtime"
}

export function getProxyTimeoutMs(path: string[] = []) {
  return isRealtimeProxyPath(path) ? undefined : 10000
}

export function prepareForwardHeaders(
  requestHeaders: Headers,
  path: string[] = [],
  publishableKey?: string
) {
  const headers = new Headers(requestHeaders)

  excludedRequestHeaders.forEach((header) => headers.delete(header))

  if (
    isRealtimeProxyPath(path) &&
    publishableKey &&
    !headers.has("x-publishable-api-key")
  ) {
    headers.set("x-publishable-api-key", publishableKey)
  }

  return headers
}

export function getRealtimePublishableKey(requestUrl: URL) {
  return requestUrl.searchParams.get("publishable_key") ?? undefined
}
