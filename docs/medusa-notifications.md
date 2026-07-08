# Medusa Notifications

Tech Hub uses Medusa's built-in Notification Module with two providers:

- `local` via `@medusajs/medusa/notification-local` for local/admin feed style notification logging.
- `resend` via `medusa/src/modules/resend` for transactional email delivery.

The previous `@codee-sh/medusa-plugin-notification-emails` admin builder plugin was removed. That plugin registered a Builder/Lexical admin page and pulled Lexical editor dependencies into the Medusa Admin bundle. Email templates now live in source code under `medusa/src/modules/resend/emails` instead of being edited through the Builder/Lexical admin UI.

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
    ],
  },
}
```

## Resend templates

Templates are React Email components in `medusa/src/modules/resend/emails` and are registered in `medusa/src/modules/resend/emails/index.ts`.

Registered templates:

- `auth-admin-password-reset`
- `auth-email-confirm`
- `auth-forgot-password`
- `auth-password-reset`
- `customer-welcome`
- `order-placed`
- `order-update`

Each template must have a matching subject in `subjects` and an export in the default template map.

## Environment variables

Required for Resend email delivery:

```sh
RESEND_API_KEY=
RESEND_FROM="TechHub <noreply@your-domain.example>"
```

`RESEND_FROM` must be a sender identity/domain verified in Resend.

## Local behavior

The local provider logs feed-channel notifications. The Resend provider sends email-channel notifications when `RESEND_API_KEY` and `RESEND_FROM` are configured.

## References

- Medusa local notification provider: https://docs.medusajs.com/resources/infrastructure-modules/notification/local
- Medusa Resend integration guide: https://docs.medusajs.com/resources/integrations/guides/resend
