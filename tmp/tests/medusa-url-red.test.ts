const assert = require('node:assert/strict')
const { getMedusaBackendUrl } = require('../../storefront/src/lib/medusa-url.ts')

assert.equal(
  getMedusaBackendUrl({
    isServer: true,
    serverUrl: 'http://localhost:9000',
    publicUrl: 'https://example-9000.app.github.dev',
  }),
  'http://localhost:9000'
)

assert.equal(
  getMedusaBackendUrl({
    isServer: false,
    serverUrl: 'http://localhost:9000',
    publicUrl: 'https://example-9000.app.github.dev',
  }),
  'https://example-9000.app.github.dev'
)
