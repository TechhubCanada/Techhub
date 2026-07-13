# Medusa Notifications

Tech Hub uses Medusa's built-in Notification Module with three providers:

- `local` via `@medusajs/medusa/notification-local` for local/admin feed style notification logging.
- `resend` via `medusa/src/modules/resend` for transactional email delivery.
- `slack` via `medusa/src/modules/slack` for Slack order alerts through an Incoming Webhook.

The previous `@codee-sh/medusa-plugin-notification-emails` admin builder plugin was removed. That plugin registered a Builder/Lexical admin page and pulled Lexical editor dependencies into the Medusa Admin bundle. Email templates now live in source code under `medusa/src/modules/resend/emails` instead of being edited through the Builder/Lexical admin UI.

The `@codee-sh/medusa-plugin-automations` plugin is also intentionally not installed. Version `1.0.11` imports `@codee-sh/medusa-plugin-notification-emails/utils` at module load time, but that package is not a runtime dependency of the automations plugin. Keeping automations installed without the email builder plugin breaks `medusa build` during type generation.

## Configuration

Notification providers are configured in `medusa/medusa-config.js`:

```js
{
  resolve: '@medusajs/medusa/notification',
  options: {
    providers: [
      {
        resolve: '@medusajs/medusa/notification-local',
        id: 'local',
        options: {
          channels: ['feed'],
        },
      },
      {
        resolve: './src/modules/resend',
        id: 'resend',
        options: {
          channels: ['email'],
          api_key: process.env.RESEND_API_KEY,
          from: process.env.RESEND_FROM,
        },
      },
      {
        resolve: './src/modules/slack',
        id: 'slack',
        options: {
          channels: ['slack'],
          webhook_url: process.env.SLACK_WEBHOOK_URL,
          admin_url: process.env.SLACK_ADMIN_URL,
        },
      },
    ],
  },
}
```

## Resend templates

Templates are React Email components in `medusa/src/modules/resend/emails` and are registered in `medusa/src/modules/resend/emails/index.ts`.

Transactional emails use the shared `EmailLayout` footer. The default storefront link is `https://techhubcanada.com`, and provider config must keep footer links TechHub-owned. Do not add agency or legacy Agilo links to transactional email footers.

Registered templates:

- `auth-admin-password-reset`
- `auth-email-confirm`
- `auth-forgot-password`
- `auth-password-reset`
- `customer-welcome`
- `order-placed`
- `order-update`

Each template must have a matching subject in `subjects` and an export in the default template map.

## Slack order alerts

## Admin feed notifications

The Medusa Admin notification drawer reads notifications on the `feed` channel and only renders entries whose `data` includes a `title`. Use the `admin-ui` template and include `data.title` plus an optional `data.description`.

Current feed entries:

- `order.placed` - new order summary for Admin.
- `customer.welcome` - new customer account.
- `auth.password_reset` - Admin and customer password reset requests.
- Catalog and inventory events - product, collection, category, product type, inventory-level, and inventory-item creates, updates, and deletes.

## Slack order alerts

`medusa/src/subscribers/order-placed-notification.ts` sends a Slack notification after the Resend order email and Admin feed entry:

```ts
await notificationModuleService.createNotifications({
  to: 'slack-channel',
  channel: 'slack',
  template: 'order-created',
  data: { order: orderForEmail },
})
```

The Slack provider formats the order as Block Kit and posts it to the configured Slack Incoming Webhook. The webhook determines the destination channel in Slack. `SLACK_ADMIN_URL` is used to add a `View order` button that links to the Medusa Admin order detail page.

## Environment variables

Required for Resend email delivery:

```sh
RESEND_API_KEY=
RESEND_FROM="TechHub <noreply@your-domain.example>"
```

`RESEND_FROM` must be a sender identity/domain verified in Resend.

Required for Slack order alerts:

```sh
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SLACK_ADMIN_URL=https://manage.techhubcanada.com/app
```

`SLACK_WEBHOOK_URL` is secret and must only be stored in local env files or deployment variables. The Slack app only needs Incoming Webhooks for this integration.

## Local behavior

The local provider logs feed-channel notifications. The Resend provider sends email-channel notifications when `RESEND_API_KEY` and `RESEND_FROM` are configured. The Slack provider sends `order-created` alerts when `SLACK_WEBHOOK_URL` is configured; if the webhook is missing, it logs a warning and skips the Slack post.

## References

- Medusa local notification provider: https://docs.medusajs.com/resources/infrastructure-modules/notification/local
- Medusa Resend integration guide: https://docs.medusajs.com/resources/integrations/guides/resend
- Medusa Slack integration guide: https://docs.medusajs.com/resources/integrations/guides/slack
