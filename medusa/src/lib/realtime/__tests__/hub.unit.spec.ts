import { realtimeHub } from '../hub'

describe('realtimeHub', () => {
  beforeEach(() => {
    realtimeHub.resetForTests()
  })

  it('publishes sequenced events to subscribers', () => {
    const received: unknown[] = []

    realtimeHub.subscribe((event) => {
      received.push(event)
    })

    const event = realtimeHub.publish({
      type: 'product.updated',
      entity: 'product',
      action: 'updated',
      entity_id: 'prod_123',
      handle: 'gaming-laptop',
      happened_at: '2026-07-08T00:00:00.000Z',
    })

    expect(event.sequence).toBe(1)
    expect(received).toEqual([
      {
        type: 'product.updated',
        entity: 'product',
        action: 'updated',
        entity_id: 'prod_123',
        handle: 'gaming-laptop',
        sequence: 1,
        happened_at: '2026-07-08T00:00:00.000Z',
      },
    ])
  })

  it('stops publishing to unsubscribed listeners', () => {
    const received: unknown[] = []
    const unsubscribe = realtimeHub.subscribe((event) => {
      received.push(event)
    })

    unsubscribe()

    realtimeHub.publish({
      type: 'product.deleted',
      entity: 'product',
      action: 'deleted',
      entity_id: 'prod_123',
    })

    expect(received).toEqual([])
    expect(realtimeHub.getClientCount()).toBe(0)
  })
})
