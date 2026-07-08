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
      expect(notifications.createNotifications).toHaveBeenCalledWith({
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
    } finally {
      if (previousAdminUrl === undefined) {
        delete process.env.ADMIN_URL
      } else {
        process.env.ADMIN_URL = previousAdminUrl
      }
    }
  })
})
