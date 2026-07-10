# Square OAuth

Square OAuth behaves differently between production and sandbox. Keep the Medusa backend `MEDUSA_BACKEND_URL` set to the public backend origin that Square can redirect to, such as the active Codespaces `*.app.github.dev` URL.

## Production

Use the production Square application credentials. Production authorization can include `session=false`; Square uses this to force the seller through the normal production authorization flow.

## Sandbox

Use the Square sandbox application credentials and open the sandbox seller dashboard before starting the Medusa Admin link flow. Sandbox authorization should redirect to `https://connect.squareupsandbox.com/oauth2/authorize` and should not include `session=false`.

The Square plugin is patched in `patches/@weareseeed__medusa-square-plugin@0.0.30.patch` to normalize sandbox redirects from `squareupsandbox.com` to `connect.squareupsandbox.com` and to remove `session=false` only for sandbox. If the Admin link flow still shows a white Square page, verify that the generated URL has:

- `connect.squareupsandbox.com` as the host.
- No `session=false` query parameter.
- The sandbox client ID, not the production client ID.
- An active sandbox seller session in Square Dashboard.

Run the integration guard after changing Square payment setup:

```sh
node scripts/check-square-payment-integration.mjs
```
