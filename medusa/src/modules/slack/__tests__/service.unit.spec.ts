import SlackNotificationProviderService from '../service'

describe('SlackNotificationProviderService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: jest.fn().mockResolvedValue('ok'),
    }) as any
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('posts order-created notifications to the configured webhook', async () => {
    const logger = {
      warn: jest.fn(),
      error: jest.fn(),
    }
    const provider = new SlackNotificationProviderService(
      { logger } as any,
      {
        webhook_url: 'https://hooks.slack.com/services/test',
        admin_url: 'https://manage.techhubcanada.com/app',
      }
    )

    const result = await provider.send({
      to: 'slack-channel',
      channel: 'slack',
      template: 'order-created',
      data: {
        order: {
          id: 'order_123',
          display_id: 42,
          email: 'customer@example.com',
          currency_code: 'cad',
          total: 129.99,
          subtotal: 109.99,
          shipping_total: 10,
          tax_total: 10,
          items: [
            {
              product_title: 'Laptop',
              variant_title: '16GB RAM',
              quantity: 1,
              total: 129.99,
            },
          ],
        },
      },
    } as any)

    expect(result).toEqual({ id: 'order_123' })
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hooks.slack.com/services/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      })
    )

    const [, request] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(request.body)

    expect(body.text).toBe('New order placed: #42')
    expect(body.blocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'section',
          text: expect.objectContaining({
            text: expect.stringContaining('New order placed'),
          }),
        }),
        expect.objectContaining({
          type: 'actions',
          elements: expect.arrayContaining([
            expect.objectContaining({
              text: expect.objectContaining({ text: 'View order' }),
              url: 'https://manage.techhubcanada.com/app/orders/order_123',
            }),
          ]),
        }),
      ])
    )
  })

  it('ignores unsupported templates without posting to Slack', async () => {
    const logger = {
      warn: jest.fn(),
      error: jest.fn(),
    }
    const provider = new SlackNotificationProviderService(
      { logger } as any,
      {
        webhook_url: 'https://hooks.slack.com/services/test',
      }
    )

    await expect(
      provider.send({
        to: 'slack-channel',
        channel: 'slack',
        template: 'unknown-template',
        data: {},
      } as any)
    ).resolves.toEqual({})

    expect(global.fetch).not.toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(
      'No Slack template found for unknown-template. Supported templates: order-created'
    )
  })
})
