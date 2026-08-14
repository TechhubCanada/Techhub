# Medusa Content CMS

Tech Hub uses `medusa-plugin-content` as the in-admin CMS for structured storefront content.

## Backend

The backend already installs and enables the plugin:

- Dependency: `medusa/package.json` includes `medusa-plugin-content`.
- Config: `medusa/medusa-config.js` includes `{ resolve: 'medusa-plugin-content', options: {} }` in `plugins`.
- Admin: the plugin adds a Content section for collections, fields, items, creators, tags, and status management.

Run backend migrations after installing or pulling plugin changes:

```sh
pnpm --dir medusa exec medusa db:migrate
```

The project pins `medusa-plugin-content` to `0.2.6` because the previously
locked `0.2.2` tarball is no longer available from npm. Version `0.2.6`
declares Medusa `^2.18.0` peer dependencies while this project currently runs
Medusa `2.17.2`. The Vercel-style filtered frozen install
(`pnpm install --frozen-lockfile --filter @techhub/storefront...`) and
storefront production build have been verified. Treat backend compatibility as
provisional until the Medusa version is upgraded or the plugin's Admin UI,
published content responses, migrations, and complete production build are
verified together.

## Public Content API

The plugin exposes published content through public routes at the backend root, not under `/store`:

- `GET /content`
- `GET /content/:slug`
- `GET /content/:slug/items`
- `GET /content/:slug/items/:itemSlug`

The list routes accept Medusa find params such as `fields`, `limit`, and `offset`. Collections also accept `q`; item lists accept `q` and `tag`. Item responses only include published items.

Use globally unique item slugs where possible. In the current plugin build, item detail lookup is by item slug and published status; the collection slug is part of the route shape but not part of the detail-route filter.

## Storefront

Use `storefront/src/lib/data/content.ts` for server-side CMS reads. It calls the existing Medusa JS SDK instance with `sdk.client.fetch()` so Codespaces proxying, backend URL resolution, and SDK request behavior stay consistent with the rest of the storefront.

The storefront currently consumes CMS collections in these places:

- `homepage-banners` - overrides the homepage hero image, title, body, and CTA when a published item exists.
- `homepage-sections` - renders homepage feature cards above the product/category sections.
- `service-pages/about-techhub` - overrides the About page opening image and intro copy.
- `blog-posts` - renders optional cards on the Inspiration page.
- `buying-guides` - renders optional cards on the Inspiration page, product pages by tag, and `/buying-guides/:slug` detail pages.

Use item metadata for reusable presentation fields: `image_url`, `image_alt`, `cta_label`, `cta_href`, `summary`, and `sort_order`.

Example:

```ts
import { listContentItems } from "@lib/data/content";

const { content_items } = await listContentItems("homepage-banners", {
  limit: 3,
  fields: ["id", "title", "slug", "body", "metadata"],
});
```

Content responses are cached with Next.js tags beginning with `content`. Revalidate or bypass those tags when building editing previews or immediate publish workflows.
