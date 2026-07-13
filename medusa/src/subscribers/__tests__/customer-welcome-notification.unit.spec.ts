import sendCustomerWelcomeNotification from '../customer-welcome-notification'

describe('sendCustomerWelcomeNotification', () => {
  it('sends customer welcome email and Admin feed notifications', async () => {
    const customer = {
      id: 'cus_123',
      email: 'customer@example.com',
      first_name: 'Jane',
      last_name: 'Customer',
    }
    const query = {
      graph: jest.fn().mockResolvedValue({ data: [customer] }),
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

    await sendCustomerWelcomeNotification({
      event: {
        data: {
          id: customer.id,
        },
      },
      container,
    } as any)

    expect(notifications.createNotifications).toHaveBeenNthCalledWith(1, {
      to: customer.email,
      channel: 'email',
      template: 'customer-welcome',
      data: { customer },
    })
    expect(notifications.createNotifications).toHaveBeenNthCalledWith(2, {
      to: 'admin',
      channel: 'feed',
      template: 'admin-ui',
      resource_id: customer.id,
      resource_type: 'customer',
      trigger_type: 'customer.welcome',
      data: {
        title: 'New customer account',
        description: 'customer@example.com created a TechHub account.',
      },
    })
  })
})
