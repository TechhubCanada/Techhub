const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

const codespaceHost =
  process.env.CODESPACES === "true" &&
  process.env.CODESPACE_NAME &&
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-8000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : undefined

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: codespaceHost ? [`https://${codespaceHost}`] : undefined,
  experimental: {
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 1,
    serverActions: {
      allowedOrigins: codespaceHost ? [codespaceHost] : [],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "fashion-starter-demo.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
}

module.exports = nextConfig
