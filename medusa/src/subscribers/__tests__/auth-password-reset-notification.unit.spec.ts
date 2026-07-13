import sendPasswordResetNotification from "../auth-password-reset-notification"

describe("sendPasswordResetNotification", () => {
  const createContainer = () => {
    const query = {
      graph: jest.fn(),
    }
    const notifications = {
      createNotifications: jest.fn(),
    }

    return {
      query,
      notifications,
      container: {
        resolve: jest.fn((key: string) => {
          if (key === "query") {
            return query
          }

          if (key === "notification") {
            return notifications
          }

          throw new Error(`Unexpected dependency: ${key}`)
        }),
      },
    }
  }

  it("sends admin password reset notifications to the Admin reset route", async () => {
    const previousAdminUrl = process.env.ADMIN_URL
    process.env.ADMIN_URL = "https://admin.techhubcanada.com"

    const { container, query, notifications } = createContainer()

    try {
      await sendPasswordResetNotification({
        event: {
          data: {
            entity_id: "admin@techhubcanada.com",
            actor_type: "user",
            token: "reset.token",
          },
        },
        container,
      } as any)

      expect(query.graph).not.toHaveBeenCalled()
      expect(notifications.createNotifications).toHaveBeenNthCalledWith(1, {
        to: "admin@techhubcanada.com",
        channel: "email",
        template: "auth-admin-password-reset",
        data: {
          email: "admin@techhubcanada.com",
          resetUrl:
            "https://admin.techhubcanada.com/reset-password?token=reset.token",
          token: "reset.token",
        },
      })
      expect(notifications.createNotifications).toHaveBeenNthCalledWith(2, {
        to: "admin",
        channel: "feed",
        template: "admin-ui",
        resource_id: "admin@techhubcanada.com",
        resource_type: "user",
        trigger_type: "auth.password_reset",
        data: {
          title: "Admin password reset requested",
          description:
            "admin@techhubcanada.com requested an Admin password reset.",
        },
      })
    } finally {
      if (previousAdminUrl === undefined) {
        delete process.env.ADMIN_URL
      } else {
        process.env.ADMIN_URL = previousAdminUrl
      }
    }
  })

  it("sends customer password reset email and feed notifications", async () => {
    const { container, query, notifications } = createContainer()
    query.graph.mockResolvedValue({
      data: [
        {
          id: "cus_123",
          email: "customer@example.com",
          first_name: "Jane",
          last_name: "Customer",
        },
      ],
    })

    await sendPasswordResetNotification({
      event: {
        data: {
          entity_id: "customer@example.com",
          actor_type: "customer",
          token: "reset.token",
        },
      },
      container,
    } as any)

    expect(notifications.createNotifications).toHaveBeenNthCalledWith(1, {
      to: "customer@example.com",
      channel: "email",
      template: "auth-forgot-password",
      data: {
        customer: {
          id: "cus_123",
          email: "customer@example.com",
          first_name: "Jane",
          last_name: "Customer",
        },
        token: "reset.token",
      },
    })
    expect(notifications.createNotifications).toHaveBeenNthCalledWith(2, {
      to: "admin",
      channel: "feed",
      template: "admin-ui",
      resource_id: "cus_123",
      resource_type: "customer",
      trigger_type: "auth.password_reset",
      data: {
        title: "Customer password reset requested",
        description: "customer@example.com requested a password reset.",
      },
    })
  })
})
