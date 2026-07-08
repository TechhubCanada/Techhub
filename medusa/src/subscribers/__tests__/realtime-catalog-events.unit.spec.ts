import realtimeCatalogEventsHandler, {
  toRealtimeCatalogEvent,
} from '../realtime-catalog-events'
import { realtimeHub } from '../../lib/realtime/hub'

describe('realtime catalog events', () => {
  beforeEach(() => {
    realtimeHub.resetForTests()
  })

  it('maps product.updated to a public product realtime event', () => {
    expect(
      toRealtimeCatalogEvent('product.updated', {
        id: 'prod_123',
        handle: 'gaming-laptop',
      })
    ).toEqual({
      type: 'product.updated',
      entity: 'product',
      action: 'updated',
      entity_id: 'prod_123',
      handle: 'gaming-laptop',
    })
  })

  it('maps inventory-level.updated to an inventory realtime event', () => {
    expect(
      toRealtimeCatalogEvent('inventory-level.updated', {
        id: 'ilev_123',
      })
    ).toEqual({
      type: 'inventory.updated',
      entity: 'inventory',
      action: 'updated',
      entity_id: 'ilev_123',
      handle: undefined,
    })
  })

  it('publishes supported events to the realtime hub', async () => {
    const received: unknown[] = []
    realtimeHub.subscribe((event) => received.push(event))

    const logger = {
      info: jest.fn(),
      warn: jest.fn(),
    }

    await realtimeCatalogEventsHandler({
      event: {
        name: 'product.deleted',
        data: {
          id: 'prod_123',
        },
      },
      container: {
        resolve: jest.fn(() => logger),
      },
    } as any)

    expect(received).toMatchObject([
      {
        type: 'product.deleted',
        entity: 'product',
        action: 'deleted',
        entity_id: 'prod_123',
        sequence: 1,
      },
    ])
    expect(logger.info).toHaveBeenCalledWith(
      'Published realtime storefront event product.deleted for prod_123'
    )
  })
})
