import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { realtimeHub } from '../../../lib/realtime/hub'
import type { RealtimeEvent } from '../../../lib/realtime/types'

export const getAllowedOrigin = (req: Pick<MedusaRequest, 'headers'>) => {
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

export const formatSseEvent = (event: RealtimeEvent) => {
  return [
    `event: ${event.type}`,
    `id: ${event.sequence}`,
    `data: ${JSON.stringify(event)}`,
    '',
    '',
  ].join('\n')
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
    res.write(formatSseEvent(event))
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
