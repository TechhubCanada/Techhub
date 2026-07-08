type MedusaBackendUrlInput = {
  isServer: boolean
  serverUrl?: string
  publicUrl?: string
}

function isCodespacesForwardedUrl(value?: string) {
  if (!value) {
    return false
  }

  try {
    return new URL(value).hostname.endsWith(".app.github.dev")
  } catch {
    return false
  }
}

export function getMedusaBackendUrl({
  isServer,
  serverUrl,
  publicUrl,
}: MedusaBackendUrlInput) {
  if (isServer && serverUrl) {
    return serverUrl
  }

  if (!isServer && isCodespacesForwardedUrl(publicUrl)) {
    return "/medusa"
  }

  return publicUrl || serverUrl || "http://localhost:9000"
}
