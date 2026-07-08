# Medusa-Only Realtime Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Convex-style live storefront updates without full page reloads and without external realtime services.

**Architecture:** Medusa remains the source of truth and publishes small realtime events from subscribers into an in-process realtime hub. A public Medusa Server-Sent Events route streams those events to the Next.js storefront, where a root `RealtimeProvider` invalidates or patches React Query caches so visible UI rerenders without `router.refresh()` or a page reload.

**Tech Stack:** Medusa 2 subscribers and API routes, Next.js App Router, Medusa JS SDK/server actions, Server-Sent Events, React Query.

---

## Scope and non-goals

This plan intentionally starts with **SSE**, not raw WebSockets, because the requested flow is backend-to-browser live updates. SSE keeps one quiet HTTP connection open, is simpler to operate inside Medusa, and avoids polling. Use WebSockets only if a later feature needs browser-to-backend realtime messages such as live chat or collaborative admin editing.

Phase 1 covers public catalog/site data:

- Products created, updated, deleted.
- Product grid refetch without page reload.
- Product detail price/title/description/stock refetch without page reload.
- Collection/category/type filter invalidation path.

Cart remains through existing Medusa SDK mutations and React Query invalidation. Do not globally broadcast cart events because carts are private per customer/session.

## File map

### Medusa backend

- Create: `medusa/src/lib/realtime/types.ts` — shared realtime event TypeScript types.
- Create: `medusa/src/lib/realtime/hub.ts` — small in-memory pub/sub hub used by subscribers and the SSE route.
- Create: `medusa/src/lib/realtime/__tests__/hub.unit.spec.ts` — unit tests for subscribe/unsubscribe/publish behavior.
- Create: `medusa/src/api/store/realtime/route.ts` — public SSE route at `GET /store/realtime`.
- Create: `medusa/src/subscribers/realtime-catalog-events.ts` — Medusa subscriber that translates catalog events into public realtime events.
- Create: `medusa/src/subscribers/__tests__/realtime-catalog-events.unit.spec.ts` — unit tests for event mapping and publishing.

### Storefront

- Create: `storefront/src/lib/realtime/types.ts` — browser-side copy of public realtime event shape.
- Create: `storefront/src/lib/realtime/url.ts` — computes the browser Medusa realtime endpoint.
- Create: `storefront/src/lib/realtime/apply-event.ts` — pure React Query cache invalidation rules.
- Create: `storefront/src/lib/realtime/__tests__/apply-event.unit.spec.ts` — unit tests for cache invalidation rules.
- Create: `storefront/src/components/RealtimeProvider.tsx` — root client provider that opens the SSE connection.
- Modify: `storefront/src/lib/util/react-query.tsx` — mark the shared React Query provider as a client module before using it in the root layout.
- Modify: `storefront/src/app/layout.tsx` — wrap the app with `ReactQueryProvider` and mount `RealtimeProvider` once.
- Create: `storefront/src/hooks/products.ts` — React Query hook for live product detail data.
- Create: `storefront/src/modules/products/components/live-product-details/index.tsx` — client boundary that swaps server product props for live query data.
- Modify: `storefront/src/modules/products/templates/index.tsx` — render the live detail boundary.
- Modify: `storefront/src/hooks/store.tsx` — make product list queries respond cleanly to realtime invalidation.

### Docs

- Create: `docs/medusa-only-realtime.md` — operator/developer notes for SSE behavior, performance, and limits.
- Modify: `README.md` — bump `Documentation version:` and link the realtime architecture note.

---

## Task 1: Add Medusa realtime event types and in-memory hub

**Files:**
- Create: `medusa/src/lib/realtime/types.ts`
- Create: `medusa/src/lib/realtime/hub.ts`
- Create: `medusa/src/lib/realtime/__tests__/hub.unit.spec.ts`

- [ ] **Step 1: Create the event type file**

Create `medusa/src/lib/realtime/types.ts`:

```ts
export type RealtimeEntity =
  | 'product'
  | 'collection'
  | 'category'
  | 'product_type'
  | 'inventory'

export type RealtimeAction = 'created' | 'updated' | 'deleted'

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

export type RealtimeEventInput = Omit<
  RealtimeEvent,
  'sequence' | 'happened_at'
> & {
  happened_at?: string
}
```

- [ ] **Step 2: Create the hub**

Create `medusa/src/lib/realtime/hub.ts`:

```ts
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
```

- [ ] **Step 3: Add hub unit tests**

Create `medusa/src/lib/realtime/__tests__/hub.unit.spec.ts`:

```ts
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
```

- [ ] **Step 4: Run the backend unit test**

Run:

```bash
pnpm --filter @techhub/medusa test -- --runTestsByPath src/lib/realtime/__tests__/hub.unit.spec.ts
```

Expected: the new realtime hub tests pass.

- [ ] **Step 5: Commit**

```bash
git add medusa/src/lib/realtime
git commit -m "Add Medusa realtime event hub"
```

---

## Task 2: Add the Medusa SSE route

**Files:**
- Create: `medusa/src/api/store/realtime/route.ts`

- [ ] **Step 1: Create the SSE API route**

Create `medusa/src/api/store/realtime/route.ts`:

```ts
import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { realtimeHub } from '../../../lib/realtime/hub'
import type { RealtimeEvent } from '../../../lib/realtime/types'

const getAllowedOrigin = (req: MedusaRequest) => {
  const requestOrigin = req.headers.origin
  const configuredOrigins = (process.env.STORE_CORS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (
    typeof requestOrigin === 'string' &&
    configuredOrigins.includes(requestOrigin)
  ) {
    return requestOrigin
  }

  return configuredOrigins[0] ?? '*'
}

const writeEvent = (res: MedusaResponse, event: RealtimeEvent) => {
  res.write(`event: ${event.type}\n`)
  res.write(`id: ${event.sequence}\n`)
  res.write(`data: ${JSON.stringify(event)}\n\n`)
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader('Access-Control-Allow-Origin', getAllowedOrigin(req))
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(204).send(null)
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': getAllowedOrigin(req),
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream; charset=utf-8',
    'X-Accel-Buffering': 'no',
  })

  res.write('retry: 5000\n\n')
  res.write(`: connected ${new Date().toISOString()}\n\n`)

  const unsubscribe = realtimeHub.subscribe((event) => {
    writeEvent(res, event)
  })

  const heartbeat = setInterval(() => {
    res.write(`: heartbeat ${new Date().toISOString()}\n\n`)
  }, 25000)

  req.on('close', () => {
    clearInterval(heartbeat)
    unsubscribe()
    res.end()
  })
}
```

- [ ] **Step 2: Verify route compiles**

Run:

```bash
pnpm --filter @techhub/medusa build
```

Expected: TypeScript build completes. If `MedusaResponse.writeHead` is not typed in this project version, replace the `writeHead` block with repeated `res.setHeader(...)` calls followed by `res.status(200)` before the first `res.write(...)`.

- [ ] **Step 3: Commit**

```bash
git add medusa/src/api/store/realtime/route.ts
git commit -m "Add Medusa storefront realtime stream"
```

---

## Task 3: Publish catalog events from Medusa subscribers

**Files:**
- Create: `medusa/src/subscribers/realtime-catalog-events.ts`
- Create: `medusa/src/subscribers/__tests__/realtime-catalog-events.unit.spec.ts`

- [ ] **Step 1: Create the subscriber**

Create `medusa/src/subscribers/realtime-catalog-events.ts`:

```ts
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
  data: CatalogEventData,
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
    `Published realtime storefront event ${published.type} for ${published.entity_id}`,
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
```

- [ ] **Step 2: Add subscriber tests**

Create `medusa/src/subscribers/__tests__/realtime-catalog-events.unit.spec.ts`:

```ts
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
      }),
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
      }),
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
      'Published realtime storefront event product.deleted for prod_123',
    )
  })
})
```

- [ ] **Step 3: Run subscriber tests**

Run:

```bash
pnpm --filter @techhub/medusa test -- --runTestsByPath src/subscribers/__tests__/realtime-catalog-events.unit.spec.ts
```

Expected: tests pass. After manual admin testing, remove any event names that Medusa does not emit in this project version.

- [ ] **Step 4: Commit**

```bash
git add medusa/src/subscribers/realtime-catalog-events.ts medusa/src/subscribers/__tests__/realtime-catalog-events.unit.spec.ts
git commit -m "Publish catalog realtime events"
```

---

## Task 4: Add storefront realtime event utilities

**Files:**
- Create: `storefront/src/lib/realtime/types.ts`
- Create: `storefront/src/lib/realtime/url.ts`
- Create: `storefront/src/lib/realtime/apply-event.ts`
- Create: `storefront/src/lib/realtime/__tests__/apply-event.unit.spec.ts`

- [ ] **Step 1: Add browser event types**

Create `storefront/src/lib/realtime/types.ts`:

```ts
export type RealtimeEntity =
  | 'product'
  | 'collection'
  | 'category'
  | 'product_type'
  | 'inventory'

export type RealtimeAction = 'created' | 'updated' | 'deleted'

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
```

- [ ] **Step 2: Add the endpoint URL helper**

Create `storefront/src/lib/realtime/url.ts`:

```ts
import { getMedusaBackendUrl } from '@lib/medusa-url'

export const getRealtimeUrl = () => {
  const baseUrl = getMedusaBackendUrl({
    isServer: false,
    publicUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    serverUrl: process.env.MEDUSA_BACKEND_URL,
  })

  return `${baseUrl.replace(/\/$/, '')}/store/realtime`
}
```

- [ ] **Step 3: Add pure React Query invalidation rules**

Create `storefront/src/lib/realtime/apply-event.ts`:

```ts
import type { QueryClient } from '@tanstack/react-query'
import type { RealtimeEvent } from './types'

export const applyRealtimeEvent = async (
  queryClient: QueryClient,
  event: RealtimeEvent
) => {
  if (event.entity === 'product' || event.entity === 'inventory') {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ['products'] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ['product'] }),
    ])
    return
  }

  if (event.entity === 'collection') {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ['collections'] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ['products'] }),
    ])
    return
  }

  if (event.entity === 'category') {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ['categories'] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ['products'] }),
    ])
    return
  }

  if (event.entity === 'product_type') {
    await Promise.all([
      queryClient.invalidateQueries({ exact: false, queryKey: ['product-types'] }),
      queryClient.invalidateQueries({ exact: false, queryKey: ['products'] }),
    ])
  }
}
```

- [ ] **Step 4: Add invalidation tests**

Create `storefront/src/lib/realtime/__tests__/apply-event.unit.spec.ts`:

```ts
import { QueryClient } from '@tanstack/react-query'
import { applyRealtimeEvent } from '../apply-event'

describe('applyRealtimeEvent', () => {
  it('invalidates product and product list queries for product events', async () => {
    const queryClient = new QueryClient()
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries')

    await applyRealtimeEvent(queryClient, {
      type: 'product.updated',
      entity: 'product',
      action: 'updated',
      entity_id: 'prod_123',
      sequence: 1,
      happened_at: '2026-07-08T00:00:00.000Z',
      handle: 'gaming-laptop',
    })

    expect(invalidateQueries).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['products'],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['product'],
    })
  })

  it('invalidates filter and product list queries for collection events', async () => {
    const queryClient = new QueryClient()
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries')

    await applyRealtimeEvent(queryClient, {
      type: 'collection.updated',
      entity: 'collection',
      action: 'updated',
      entity_id: 'pcol_123',
      sequence: 2,
      happened_at: '2026-07-08T00:00:00.000Z',
    })

    expect(invalidateQueries).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['collections'],
    })
    expect(invalidateQueries).toHaveBeenCalledWith({
      exact: false,
      queryKey: ['products'],
    })
  })
})
```

- [ ] **Step 5: Run storefront tests or type check**

Run:

```bash
pnpm --filter @techhub/storefront lint
```

Expected: lint passes for the new realtime utility files.

- [ ] **Step 6: Commit**

```bash
git add storefront/src/lib/realtime
git commit -m "Add storefront realtime cache rules"
```

---

## Task 5: Mount the storefront realtime provider once

**Files:**
- Create: `storefront/src/components/RealtimeProvider.tsx`
- Modify: `storefront/src/lib/util/react-query.tsx`
- Modify: `storefront/src/app/layout.tsx`

- [ ] **Step 1: Create the provider**

Create `storefront/src/components/RealtimeProvider.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { applyRealtimeEvent } from '@lib/realtime/apply-event'
import { getRealtimeUrl } from '@lib/realtime/url'
import type { RealtimeEvent, RealtimeEventType } from '@lib/realtime/types'

const eventTypes: RealtimeEventType[] = [
  'product.created',
  'product.updated',
  'product.deleted',
  'collection.created',
  'collection.updated',
  'collection.deleted',
  'category.created',
  'category.updated',
  'category.deleted',
  'product_type.created',
  'product_type.updated',
  'product_type.deleted',
  'inventory.created',
  'inventory.updated',
  'inventory.deleted',
]

export const RealtimeProvider = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const source = new EventSource(getRealtimeUrl())

    const handlers = eventTypes.map((eventType) => {
      const handler = (message: MessageEvent<string>) => {
        const event = JSON.parse(message.data) as RealtimeEvent
        void applyRealtimeEvent(queryClient, event)
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
```

- [ ] **Step 2: Mark the shared React Query provider as a client module**

Modify `storefront/src/lib/util/react-query.tsx` so the first line is:

```tsx
"use client"
```

The file should still export the existing `ReactQueryProvider` and `withReactQueryProvider` helpers.

- [ ] **Step 3: Mount React Query and realtime globally**

Modify `storefront/src/app/layout.tsx` so the body contents are wrapped with `ReactQueryProvider` and `RealtimeProvider` is mounted once:

```tsx
import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Mona_Sans } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

import "../styles/globals.css"
import "lenis/dist/lenis.css"
import React from "react"
import { WebMCPProvider } from "@lib/webmcp/WebMCPProvider"
import { SmoothScroll } from "@/components/SmoothScroll"
import { RealtimeProvider } from "@/components/RealtimeProvider"
import { ReactQueryProvider } from "@lib/util/react-query"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.svg",
  },
}

const monaSans = Mona_Sans({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: "variable",
  variable: "--font-mona-sans",
})

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.className}`}>
        <ReactQueryProvider>
          <SmoothScroll>
            <main className="relative">{props.children}</main>
          </SmoothScroll>
          <RealtimeProvider />
          <SpeedInsights />
          <WebMCPProvider />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Run storefront lint**

Run:

```bash
pnpm --filter @techhub/storefront lint
```

Expected: lint passes.

- [ ] **Step 5: Commit**

```bash
git add storefront/src/components/RealtimeProvider.tsx storefront/src/lib/util/react-query.tsx storefront/src/app/layout.tsx
git commit -m "Mount storefront realtime provider"
```

---

## Task 6: Make product detail data live without page reloads

**Files:**
- Create: `storefront/src/hooks/products.ts`
- Create: `storefront/src/modules/products/components/live-product-details/index.tsx`
- Modify: `storefront/src/modules/products/templates/index.tsx`

- [ ] **Step 1: Add live product hook**

Create `storefront/src/hooks/products.ts`:

```ts
import { getProductByHandle } from '@lib/data/products'
import { HttpTypes } from '@medusajs/types'
import { useQuery } from '@tanstack/react-query'

export const useLiveProduct = ({
  handle,
  regionId,
  initialProduct,
}: {
  handle: string
  regionId: string
  initialProduct: HttpTypes.StoreProduct
}) => {
  return useQuery({
    queryKey: ['product', handle, regionId],
    queryFn: async () => {
      return getProductByHandle(handle, regionId)
    },
    initialData: initialProduct,
    refetchOnWindowFocus: true,
  })
}
```

- [ ] **Step 2: Add live product detail component**

Create `storefront/src/modules/products/components/live-product-details/index.tsx`:

```tsx
'use client'

import { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import ProductInfo from '@modules/products/templates/product-info'
import ProductActions from '@modules/products/components/product-actions'
import { useLiveProduct } from 'hooks/products'

type LiveProductDetailsProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
}

export const LiveProductDetails = ({
  product,
  materials,
  region,
}: LiveProductDetailsProps) => {
  const liveProductQuery = useLiveProduct({
    handle: product.handle ?? product.id,
    regionId: region.id,
    initialProduct: product,
  })

  const liveProduct = liveProductQuery.data ?? product

  return (
    <>
      <ProductInfo product={liveProduct} />
      <Suspense>
        <ProductActions
          product={liveProduct}
          materials={materials}
          region={region}
        />
      </Suspense>
    </>
  )
}
```

- [ ] **Step 3: Use the live detail component in the product template**

Modify the imports and sticky detail block in `storefront/src/modules/products/templates/index.tsx`.

Replace these imports:

```tsx
import ProductActions from "@modules/products/components/product-actions"
import ProductInfo from "@modules/products/templates/product-info"
```

with:

```tsx
import { LiveProductDetails } from "@modules/products/components/live-product-details"
```

Replace this block:

```tsx
<div className="sticky flex-1 top-0">
  <ProductInfo product={product} />
  <Suspense>
    <ProductActions
      product={product}
      materials={materials}
      region={region}
    />
  </Suspense>
</div>
```

with:

```tsx
<div className="sticky flex-1 top-0">
  <LiveProductDetails
    product={product}
    materials={materials}
    region={region}
  />
</div>
```

- [ ] **Step 4: Run storefront lint**

Run:

```bash
pnpm --filter @techhub/storefront lint
```

Expected: lint passes and no unused `Suspense`, `ProductActions`, or `ProductInfo` imports remain in `storefront/src/modules/products/templates/index.tsx`.

- [ ] **Step 5: Commit**

```bash
git add storefront/src/hooks/products.ts storefront/src/modules/products/components/live-product-details/index.tsx storefront/src/modules/products/templates/index.tsx
git commit -m "Make product details update live"
```

---

## Task 7: Tighten product grid realtime behavior

**Files:**
- Modify: `storefront/src/hooks/store.tsx`

- [ ] **Step 1: Tune product list query settings**

Modify `storefront/src/hooks/store.tsx` so `useStoreProducts` keeps existing data visible during realtime refetches and refetches when the tab regains focus:

```ts
import { getProductsListWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useStoreProducts = ({
  page,
  queryParams,
  sortBy,
  countryCode,
}: {
  page: number
  queryParams: HttpTypes.StoreProductListParams
  sortBy: SortOptions | undefined
  countryCode: string
}) => {
  return useQuery({
    queryKey: ["products", "list", { page, queryParams, sortBy, countryCode }],
    queryFn: async () => {
      return getProductsListWithSort({
        page,
        queryParams,
        sortBy,
        countryCode,
      })
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  })
}
```

- [ ] **Step 2: Run storefront lint**

Run:

```bash
pnpm --filter @techhub/storefront lint
```

Expected: lint passes.

- [ ] **Step 3: Commit**

```bash
git add storefront/src/hooks/store.tsx
git commit -m "Tune live product grid refetching"
```

---

## Task 8: Document performance and operating rules

**Files:**
- Create: `docs/medusa-only-realtime.md`
- Modify: `README.md`

- [ ] **Step 1: Create the architecture note**

Create `docs/medusa-only-realtime.md`:

````md
# Medusa-Only Storefront Realtime

The storefront realtime layer uses Medusa as the only realtime backend. It does not use Pusher, Ably, Supabase Realtime, Convex, or another external realtime service.

## Flow

```text
Medusa catalog event
  -> Medusa subscriber
  -> in-process realtime hub
  -> GET /store/realtime Server-Sent Events stream
  -> storefront RealtimeProvider
  -> React Query invalidateQueries/setQueryData
  -> visible React components rerender without page reload
```

## Why SSE first

Server-Sent Events are enough for catalog/site updates because messages only need to travel from Medusa to the browser. SSE keeps one lightweight HTTP connection open and avoids constant polling. The browser reconnects automatically if the connection drops.

## Performance rules

- Send small event messages containing event type and entity IDs, not full product payloads.
- Use React Query invalidation to refetch only the affected query families.
- Do not call `router.refresh()` for normal realtime updates because it refreshes server-rendered route data.
- Do not globally broadcast private cart contents.
- Keep heartbeat comments at roughly 25 seconds so proxies do not close idle streams.

## Single-instance and multi-instance behavior

The first implementation uses an in-memory hub, which is correct for one Medusa process. If production runs multiple Medusa processes, replace or extend the hub with Postgres `LISTEN/NOTIFY` so events published by one process reach SSE clients connected to another process.

## Storefront behavior

The root `RealtimeProvider` listens to `/store/realtime` and invalidates React Query keys:

- Product or inventory events invalidate `['products']` and `['product']`.
- Collection events invalidate `['collections']` and `['products']`.
- Category events invalidate `['categories']` and `['products']`.
- Product type events invalidate `['product-types']` and `['products']`.
````

- [ ] **Step 2: Update README documentation version and docs index**

Modify the top of `README.md`:

```md
Documentation version: 2026.07.08.6
```

Add this bullet under the project documentation/resources area of `README.md`:

```md
- `docs/medusa-only-realtime.md` - Medusa-only SSE architecture for live storefront updates without external realtime services.
```

- [ ] **Step 3: Commit**

```bash
git add docs/medusa-only-realtime.md README.md
git commit -m "Document Medusa-only realtime architecture"
```

---

## Task 9: Manual verification without starting or stopping servers automatically

**Files:**
- No file changes.

- [ ] **Step 1: Build backend and storefront**

Run from the repository root:

```bash
pnpm build
```

Expected: both workspaces build successfully.

- [ ] **Step 2: Ask before starting servers**

Do not start, stop, restart, or kill dev servers unless the user explicitly approves it in the current turn. If servers are not already running, ask the user for permission to run:

```bash
cd medusa && docker compose up -d
pnpm dev:medusa
pnpm dev:storefront
```

- [ ] **Step 3: Verify the SSE stream when servers are running**

Run only after the Medusa backend is already running or the user approves starting it:

```bash
curl -N http://localhost:9000/store/realtime
```

Expected initial output:

```text
retry: 5000

: connected 2026-07-08T...
```

Expected ongoing output every ~25 seconds:

```text
: heartbeat 2026-07-08T...
```

- [ ] **Step 4: Verify no page reload in browser**

Use Agent Browser if available. Open:

```text
http://localhost:8000/ca/store
```

Then update a product in Medusa Admin. Expected behavior:

- The page does not reload.
- The SSE connection receives a `product.updated` event.
- React Query invalidates `['products']`.
- The product grid updates after the affected query refetches.

- [ ] **Step 5: Verify product detail live update**

Open a product page in the storefront. Update the product title, price, or inventory in Medusa Admin. Expected behavior:

- The page does not reload.
- The SSE connection receives a product or inventory event.
- React Query invalidates `['product']`.
- The product detail client boundary shows the updated product data after refetch.

---

## Rollout order

1. Implement Tasks 1-3 first and verify Medusa can publish SSE events.
2. Implement Tasks 4-5 and verify the browser maintains one `/store/realtime` connection.
3. Implement Tasks 6-7 so product detail and product grid queries react to events.
4. Implement Task 8 before finalizing the repository change.
5. Run Task 9 verification.

## Risk notes

- The in-memory hub only broadcasts within one Medusa Node.js process. Use Postgres `LISTEN/NOTIFY` if production has multiple Medusa instances.
- Some Medusa event names beyond `product.created`, `product.updated`, and `product.deleted` may differ by Medusa version. The subscriber tests validate mapping logic; manual admin testing validates which events Medusa emits in this project.
- Server-rendered components only update without page reload after their dynamic data is moved behind React Query client boundaries. Task 6 handles product details; Task 7 already covers the product grid.
- Private customer/cart realtime should be scoped by authenticated customer or cart ID before adding it. Do not send cart payloads on the public `/store/realtime` stream.
