type MedusaBackendUrlInput = {
  isServer: boolean
  serverUrl?: string
  publicUrl?: string
}

function getCodespacesForwardedPort(value?: string) {
  if (!value) {
    return null
  }

  try {
    const { hostname } = new URL(value)
    const match = hostname.match(/-(\d+)\.app\.github\.dev$/)

    return match?.[1] ?? null
  } catch {
    return null
  }
}

function isCodespacesForwardedUrl(value?: string) {
  return Boolean(getCodespacesForwardedPort(value))
}

export function getMedusaBackendUrl({
  isServer,
  serverUrl,
  publicUrl,
}: MedusaBackendUrlInput) {
  if (isServer) {
    const forwardedPort =
      getCodespacesForwardedPort(serverUrl) ??
      getCodespacesForwardedPort(publicUrl)

    if (forwardedPort) {
      return `http://localhost:${forwardedPort}`
    }

    if (serverUrl) {
      return serverUrl
    }
  }

  if (!isServer && isCodespacesForwardedUrl(publicUrl)) {
    return `${window.location.origin}/medusa`
  }

  return publicUrl || serverUrl || "http://localhost:9000"
}
