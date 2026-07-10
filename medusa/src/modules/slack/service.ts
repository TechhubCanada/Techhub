import { AbstractNotificationProviderService } from '@medusajs/framework/utils'
import { Logger } from '@medusajs/medusa'
import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from '@medusajs/types'

type InjectedDependencies = {
  logger: Logger
}

type SlackProviderOptions = {
  webhook_url?: string
  admin_url?: string
}

type SlackOrderLineItem = {
  product_title?: string | null
  variant_title?: string | null
  quantity?: number | null
  total?: number | null
}

type SlackOrder = {
  id?: string
  display_id?: number | string | null
  email?: string | null
  currency_code?: string | null
  total?: number | null
  subtotal?: number | null
  shipping_total?: number | null
  tax_total?: number | null
  items?: SlackOrderLineItem[] | null
}

type SlackOrderCreatedData = {
  order?: SlackOrder
}

type SlackTextObject = {
  type: 'mrkdwn' | 'plain_text'
  text: string
  emoji?: boolean
}

type SlackBlock =
  | {
      type: 'header'
      text: SlackTextObject
    }
  | {
      type: 'section'
      text?: SlackTextObject
      fields?: SlackTextObject[]
    }
  | {
      type: 'context'
      elements: SlackTextObject[]
    }
  | {
      type: 'actions'
      elements: {
        type: 'button'
        text: SlackTextObject
        url: string
      }[]
    }

type SlackWebhookPayload = {
  text: string
  blocks: SlackBlock[]
}

const SUPPORTED_TEMPLATES = ['order-created'] as const

const trimTrailingSlash = (url: string) => url.replace(/\/$/, '')

const escapeSlackText = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const formatOrderName = (order: SlackOrder): string => {
  if (order.display_id !== undefined && order.display_id !== null) {
    return `#${order.display_id}`
  }

  return order.id ?? 'unknown order'
}

const formatCurrency = (
  value: number | null | undefined,
  currencyCode: string | null | undefined
): string => {
  const amount = typeof value === 'number' ? value : 0
  const currency = (currencyCode || 'CAD').toUpperCase()

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(amount)
}

const buildAdminOrderUrl = (
  adminUrl: string | undefined,
  orderId: string | undefined
): string | undefined => {
  if (!adminUrl || !orderId) {
    return undefined
  }

  return `${trimTrailingSlash(adminUrl)}/orders/${encodeURIComponent(orderId)}`
}

const formatLineItems = (items: SlackOrderLineItem[] | null | undefined) => {
  if (!items?.length) {
    return 'No line items found'
  }

  const visibleItems = items.slice(0, 8).map((item) => {
    const title = item.product_title || 'Untitled item'
    const variant = item.variant_title ? ` (${item.variant_title})` : ''
    const quantity = item.quantity ?? 0

    return `- ${escapeSlackText(title)}${escapeSlackText(variant)} x ${quantity}`
  })

  const hiddenItemCount = items.length - visibleItems.length

  if (hiddenItemCount > 0) {
    visibleItems.push(
      `- +${hiddenItemCount} more item${hiddenItemCount === 1 ? '' : 's'}`
    )
  }

  return visibleItems.join('\n')
}

const buildOrderCreatedPayload = (
  data: SlackOrderCreatedData,
  adminUrl?: string
): SlackWebhookPayload => {
  const order = data.order ?? {}
  const orderName = formatOrderName(order)
  const currencyCode = order.currency_code
  const adminOrderUrl = buildAdminOrderUrl(adminUrl, order.id)
  const itemCount =
    order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0
  const blocks: SlackBlock[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*New order placed*\n${escapeSlackText(orderName)}`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Customer*\n${escapeSlackText(order.email || 'No email')}`,
        },
        {
          type: 'mrkdwn',
          text: `*Total*\n${escapeSlackText(formatCurrency(order.total, currencyCode))}`,
        },
        {
          type: 'mrkdwn',
          text: `*Items*\n${itemCount}`,
        },
        {
          type: 'mrkdwn',
          text: `*Order ID*\n${escapeSlackText(order.id || 'Unknown')}`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: formatLineItems(order.items),
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Subtotal ${escapeSlackText(
            formatCurrency(order.subtotal, currencyCode)
          )} | Shipping ${escapeSlackText(
            formatCurrency(order.shipping_total, currencyCode)
          )} | Tax ${escapeSlackText(formatCurrency(order.tax_total, currencyCode))}`,
        },
      ],
    },
  ]

  if (adminOrderUrl) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View order',
            emoji: true,
          },
          url: adminOrderUrl,
        },
      ],
    })
  }

  return {
    text: `New order placed: ${orderName}`,
    blocks,
  }
}

export default class SlackNotificationProviderService extends AbstractNotificationProviderService {
  public static identifier = 'slack'
  private logger: Logger
  private webhookUrl?: string
  private adminUrl?: string

  constructor(
    { logger }: InjectedDependencies,
    options: SlackProviderOptions = {}
  ) {
    super()

    this.logger = logger
    this.webhookUrl = options.webhook_url
    this.adminUrl = options.admin_url
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!SUPPORTED_TEMPLATES.includes(notification.template as any)) {
      this.logger.warn(
        `No Slack template found for ${notification.template}. Supported templates: ${SUPPORTED_TEMPLATES.join(
          ', '
        )}`
      )
      return {}
    }

    if (!this.webhookUrl) {
      this.logger.warn(
        'Slack webhook URL is not configured. Skipping Slack notification.'
      )
      return {}
    }

    const payloadData = (notification.data ?? {}) as SlackOrderCreatedData
    const payload = buildOrderCreatedPayload(payloadData, this.adminUrl)
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const responseBody = await response.text().catch(() => '')
      this.logger.error(
        `Failed to send Slack notification: ${response.status} ${response.statusText}${
          responseBody ? ` - ${responseBody}` : ''
        }`
      )
      return {}
    }

    return payloadData.order?.id ? { id: payloadData.order.id } : {}
  }
}
