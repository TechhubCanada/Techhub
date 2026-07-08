"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { applyRealtimeEvent } from "@lib/realtime/apply-event"
import { getRealtimeUrl } from "@lib/realtime/url"
import type { RealtimeEvent, RealtimeEventType } from "@lib/realtime/types"

const eventTypes: RealtimeEventType[] = [
  "product.created",
  "product.updated",
  "product.deleted",
  "collection.created",
  "collection.updated",
  "collection.deleted",
  "category.created",
  "category.updated",
  "category.deleted",
  "product_type.created",
  "product_type.updated",
  "product_type.deleted",
  "inventory.created",
  "inventory.updated",
  "inventory.deleted",
]

export const RealtimeProvider = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const source = new EventSource(getRealtimeUrl())

    const handlers = eventTypes.map((eventType) => {
      const handler = (message: Event) => {
        const eventMessage = message as MessageEvent<string>

        try {
          const event = JSON.parse(eventMessage.data) as RealtimeEvent
          void applyRealtimeEvent(queryClient, event)
        } catch {
          // Ignore malformed realtime messages; EventSource reconnects on stream errors.
        }
      }

      source.addEventListener(eventType, handler)

      return { eventType, handler }
    })

    source.onerror = () => {
      // EventSource reconnects automatically using the retry value sent by Medusa.
    }

    return () => {
      for (const { eventType, handler } of handlers) {
        source.removeEventListener(eventType, handler)
      }

      source.close()
    }
  }, [queryClient])

  return null
}
