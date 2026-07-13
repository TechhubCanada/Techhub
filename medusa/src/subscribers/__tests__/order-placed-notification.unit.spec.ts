import sendOrderConfirmationHandler from '../order-placed-notification'

const createOrder = () => ({
  id: 'order_123',
  display_id: 42,
  currency_code: 'cad',
  email: 'customer@example.com',
  customer_id: 'cus_123',
  total: 129.99,
  subtotal: 109.99,
  tax_total: 10,
  discount_total: 0,
  discount_tax_total: 0,
  original_total: 129.99,
  original_tax_total: 10,
  item_total: 129.99,
  item_subtotal: 109.99,
  item_tax_total: 10,
  original_item_total: 129.99,
  original_item_subtotal: 109.99,
  original_item_tax_total: 10,
  shipping_total: 10,
  shipping_subtotal: 10,
  shipping_tax_total: 0,
  original_shipping_tax_total: 0,
  original_shipping_subtotal: 10,
  original_shipping_total: 10,
  shipping_address: null,
  billing_address: null,
  summary: {},
  items: [
    {
      id: 'line_123',
      quantity: 1,
      total: 129.99,
      thumbnail: null,
      product_title: 'Laptop',
      variant_title: '16GB RAM',
      variant_option_values: {},
      product: {
        thumbnail: null,
        images: [],
      },
      variant: {
        options: [],
      },
    },
  ],
})

describe('sendOrderConfirmationHandler', () => {
  it('sends order email, Admin feed, and Slack order alert notifications', async () => {
    const order = createOrder()
    const query = {
      graph: jest.fn().mockResolvedValue({ data: [order] }),
    }
    const notifications = {
      createNotifications: jest.fn().mockResolvedValue({}),
    }
    const container = {
      resolve: jest.fn((key: string) => {
        if (key === 'query') {
          return query
        }

        if (key === 'notification') {
          return notifications
        }

        throw new Error(`Unexpected dependency: ${key}`)
      }),
    }

    await sendOrderConfirmationHandler({
      event: {
        data: {
          id: order.id,
        },
      },
      container,
    } as any)

    expect(notifications.createNotifications).toHaveBeenNthCalledWith(1, {
      to: order.email,
      channel: 'email',
      template: 'order-placed',
      data: {
        order: expect.objectContaining({
          id: order.id,
          email: order.email,
          total: 129.99,
          items: [
            expect.objectContaining({
              id: 'line_123',
              product_title: 'Laptop',
              quantity: 1,
              total: 129.99,
            }),
          ],
        }),
      },
    })

    expect(notifications.createNotifications).toHaveBeenNthCalledWith(2, {
      to: 'admin',
      channel: 'feed',
      template: 'admin-ui',
      resource_id: order.id,
      resource_type: 'order',
      trigger_type: 'order.placed',
      data: {
        title: 'New order #42',
        description:
          'customer@example.com placed an order for CAD 129.99.',
      },
    })

    expect(notifications.createNotifications).toHaveBeenNthCalledWith(3, {
      to: 'slack-channel',
      channel: 'slack',
      template: 'order-created',
      data: {
        order: expect.objectContaining({
          id: order.id,
          email: order.email,
          total: 129.99,
          items: [
            expect.objectContaining({
              id: 'line_123',
              product_title: 'Laptop',
              quantity: 1,
              total: 129.99,
            }),
          ],
        }),
      },
    })
  })
})
