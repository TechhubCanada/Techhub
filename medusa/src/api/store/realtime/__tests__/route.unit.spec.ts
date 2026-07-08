import { formatSseEvent, getAllowedOrigin } from '../route'

describe('store realtime route helpers', () => {
  it('formats named SSE events with sequence IDs and JSON data', () => {
    expect(
      formatSseEvent({
        type: 'product.updated',
        entity: 'product',
        action: 'updated',
        entity_id: 'prod_123',
        sequence: 7,
        happened_at: '2026-07-08T00:00:00.000Z',
      })
    ).toBe(
      'event: product.updated\n' +
        'id: 7\n' +
        'data: {"type":"product.updated","entity":"product","action":"updated","entity_id":"prod_123","sequence":7,"happened_at":"2026-07-08T00:00:00.000Z"}\n\n'
    )
  })

  it('allows configured storefront origins only', () => {
    const previousStoreCors = process.env.STORE_CORS
    process.env.STORE_CORS = 'http://localhost:8000,https://shop.example.com'

    try {
      expect(
        getAllowedOrigin({
          headers: { origin: 'https://shop.example.com' },
        } as any)
      ).toBe('https://shop.example.com')

      expect(
        getAllowedOrigin({
          headers: { origin: 'https://bad.example.com' },
        } as any)
      ).toBe('http://localhost:8000')
    } finally {
      if (previousStoreCors === undefined) {
        delete process.env.STORE_CORS
      } else {
        process.env.STORE_CORS = previousStoreCors
      }
    }
  })
})
