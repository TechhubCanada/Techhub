# Medusa-Only Storefront Realtime

The storefront realtime layer should use Medusa as the only realtime backend. It should not use Pusher, Ably, Supabase Realtime, Convex, or another external realtime service.

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

Server-Sent Events are enough for catalog and site updates because messages only need to travel from Medusa to the browser. SSE keeps one lightweight HTTP connection open and avoids constant polling. The browser reconnects automatically if the connection drops.

Use WebSockets later only if the storefront needs browser-to-backend realtime messages, such as live chat or collaborative editing.

## Performance rules

- Send small event messages containing event type and entity IDs, not full product payloads.
- Use React Query invalidation to refetch only the affected query families.
- Do not call `router.refresh()` for normal realtime updates because it refreshes server-rendered route data.
- Do not globally broadcast private cart contents.
- Keep heartbeat comments at roughly 25 seconds so proxies do not close idle streams.

## Single-instance and multi-instance behavior

The first implementation can use an in-memory hub, which is correct for one Medusa process. If production runs multiple Medusa processes, replace or extend the hub with Postgres `LISTEN/NOTIFY` so events published by one process reach SSE clients connected to another process.

## Storefront behavior

The root `RealtimeProvider` listens to `/store/realtime` and invalidates React Query keys:

- Product or inventory events invalidate `['products']` and `['product']`.
- Collection events invalidate `['collections']` and `['products']`.
- Category events invalidate `['categories']` and `['products']`.
- Product type events invalidate `['product-types']` and `['products']`.

Server-rendered data only updates without a page reload after the dynamic portion is moved behind a client component that reads from React Query. Product grids already use React Query in this storefront. Product details need a live client boundary for price, inventory, title, and description updates.

## Implementation status

Implemented pieces in this branch:

- Medusa in-memory realtime hub and event types under `medusa/src/lib/realtime`.
- Medusa SSE endpoint at `GET /store/realtime`.
- Medusa catalog subscriber for product, collection, category, product type, and inventory events.
- Storefront root `RealtimeProvider` connected to the Medusa SSE endpoint.
- Storefront React Query invalidation rules for product, collection, category, product type, and inventory events.
- Live product-detail client boundary so product detail data can refetch without a page reload.
- Product grid query settings that keep previous data visible while realtime invalidation refetches.

Production caveats:

- The current hub is process-local. It is production-suitable for one Medusa process. For multiple Medusa processes or replicas, add a shared event bridge such as Postgres `LISTEN/NOTIFY`.
- The hosting/proxy layer must allow long-lived SSE responses and avoid buffering `/store/realtime`.
- `STORE_CORS` must include the storefront origin so browser EventSource connections are accepted.
- Private cart updates are intentionally not broadcast on the public stream.
