import type { RealtimeEvent, RealtimeEventInput } from './types'

type RealtimeListener = (event: RealtimeEvent) => void

const listeners = new Set<RealtimeListener>()
let sequence = 0

export const realtimeHub = {
  publish(input: RealtimeEventInput): RealtimeEvent {
    sequence += 1

    const event: RealtimeEvent = {
      ...input,
      sequence,
      happened_at: input.happened_at ?? new Date().toISOString(),
    }

    for (const listener of listeners) {
      listener(event)
    }

    return event
  },

  subscribe(listener: RealtimeListener): () => void {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },

  getClientCount(): number {
    return listeners.size
  },

  resetForTests(): void {
    listeners.clear()
    sequence = 0
  },
}
