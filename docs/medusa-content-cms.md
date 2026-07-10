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

The plugin package currently declares Medusa `2.16.0` peer dependencies while this project runs Medusa `2.17.2`. Keep that in mind when upgrading Medusa or the plugin, and verify Admin rendering plus content API responses after dependency updates.

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
