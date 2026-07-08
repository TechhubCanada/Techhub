export type RealtimeEntity =
  | "product"
  | "collection"
  | "category"
  | "product_type"
  | "inventory"

export type RealtimeAction = "created" | "updated" | "deleted"

export type RealtimeEventType = `${RealtimeEntity}.${RealtimeAction}`

export type RealtimeEvent = {
  type: RealtimeEventType
  entity: RealtimeEntity
  action: RealtimeAction
  entity_id: string
  sequence: number
  happened_at: string
  handle?: string
}
