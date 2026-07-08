const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const codespaceHost =
  process.env.CODESPACES === "true" &&
  process.env.CODESPACE_NAME &&
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-8000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : undefined

const isDevelopment = process.env.NODE_ENV !== "production"
const devActionOrigins = isDevelopment
  ? ["localhost:8000", ...(codespaceHost ? [codespaceHost] : [])]
  : []

const getHostname = (value) => {
  if (!value) {
    return undefined
  }

  try {
    return new URL(value).hostname
  } catch {
    return undefined
  }
}

const medusaFileHost = getHostname(
  process.env.NEXT_PUBLIC_MEDUSA_FILE_URL || process.env.S3_FILE_URL
)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: isDevelopment
    ? [
        "http://localhost:8000",
        ...(codespaceHost ? [`https://${codespaceHost}`] : []),
      ]
    : undefined,
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    serverActions: {
      allowedOrigins: devActionOrigins,
    },
  },
  images: {
    qualities: [50, 75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pub-7f577dfb54474739bd8983ff26f855de.r2.dev",
      },
      ...(medusaFileHost
        ? [
            {
              protocol: "https",
              hostname: medusaFileHost,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
