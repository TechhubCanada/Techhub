# Square OAuth

Square OAuth behaves differently between production and sandbox. Keep the Medusa backend `MEDUSA_BACKEND_URL` set to the public backend origin that Square can redirect to, such as the active Codespaces `*.app.github.dev` URL.

## Production

Use the production Square application credentials. Production authorization can include `session=false`; Square uses this to force the seller through the normal production authorization flow.

For Apple Pay, register the exact production storefront host in the Square Admin extension's **Apple Pay** tab. The registered host must serve Square's domain association file at `/.well-known/apple-developer-merchantid-domain-association` over valid HTTPS with a `200` response. Apple Pay is host-specific, so registering `techhubcanada.com` does not cover `www.techhubcanada.com` if shoppers use the `www` host or if that host redirects before Square/Apple can verify it.

Production checkout can show Google Pay while Apple Pay stays hidden when Square's Web Payments SDK loads but `payments.applePay(...)` rejects the current browser or domain. When this happens, verify:

- The active shopper URL host is the same domain registered in Square.
- The host has a valid TLS certificate for that exact hostname.
- The association file returns `200` without authentication or country-code redirects.
- The storefront was tested in Safari on an Apple Pay-capable Apple device.

After DNS or Square domain changes, run:

```sh
node scripts/check-square-apple-pay-production.mjs
```

This check must pass for every checkout hostname before Apple Pay can be considered production-ready.

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
