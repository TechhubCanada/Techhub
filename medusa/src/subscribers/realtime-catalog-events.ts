import type { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { realtimeHub } from '../lib/realtime/hub'
import type {
  RealtimeAction,
  RealtimeEntity,
  RealtimeEventInput,
} from '../lib/realtime/types'

type CatalogEventData = {
  id: string
  handle?: string
}

const entityByMedusaEventPrefix: Record<string, RealtimeEntity> = {
  product: 'product',
  'product-collection': 'collection',
  'product-category': 'category',
  'product-type': 'product_type',
  'inventory-level': 'inventory',
  'inventory-item': 'inventory',
}

const actionByMedusaEventSuffix: Record<string, RealtimeAction> = {
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
}

export const toRealtimeCatalogEvent = (
  name: string,
  data: CatalogEventData
): RealtimeEventInput | null => {
  const lastDotIndex = name.lastIndexOf('.')

  if (lastDotIndex === -1) {
    return null
  }

  const medusaEntity = name.slice(0, lastDotIndex)
  const medusaAction = name.slice(lastDotIndex + 1)
  const entity = entityByMedusaEventPrefix[medusaEntity]
  const action = actionByMedusaEventSuffix[medusaAction]

  if (!entity || !action || !data.id) {
    return null
  }

  return {
    type: `${entity}.${action}`,
    entity,
    action,
    entity_id: data.id,
    handle: data.handle,
  }
}

export default async function realtimeCatalogEventsHandler({
  event: { data, name },
  container,
}: SubscriberArgs<CatalogEventData>) {
  const logger = container.resolve('logger')
  const realtimeEvent = toRealtimeCatalogEvent(name, data)

  if (!realtimeEvent) {
    logger.warn(`Skipped unsupported realtime catalog event: ${name}`)
    return
  }

  const published = realtimeHub.publish(realtimeEvent)

  logger.info(
    `Published realtime storefront event ${published.type} for ${published.entity_id}`
  )
}

export const config: SubscriberConfig = {
  event: [
    'product.created',
    'product.updated',
    'product.deleted',
    'product-collection.created',
    'product-collection.updated',
    'product-collection.deleted',
    'product-category.created',
    'product-category.updated',
    'product-category.deleted',
    'product-type.created',
    'product-type.updated',
    'product-type.deleted',
    'inventory-level.created',
    'inventory-level.updated',
    'inventory-level.deleted',
    'inventory-item.created',
    'inventory-item.updated',
    'inventory-item.deleted',
  ],
}
