# Storefront SEO

The Next.js storefront uses the App Router metadata API for site-wide and route-level search metadata.

## Public routes

The root layout supplies TechHub's default title template, description, keyword set, social card metadata, and Organization/WebSite JSON-LD. Public country-aware pages use self-referencing canonical URLs:

- Home, Shop, About, Inspiration, and B2B Inquiry
- Product collections, products, and buying guides
- Privacy, cookie, return, and terms pages

Product metadata uses catalog title, description, brand, type, categories, and thumbnail. Product pages also emit Product JSON-LD using the live catalog record.

## Crawling and sitemap

- `src/app/sitemap.ts` generates `/sitemap.xml` from country routes, collections, products, and buying guides.
- `src/app/robots.ts` publishes `/robots.txt`, references the sitemap, and blocks API, Medusa proxy, account, authentication, cart, checkout, order, search, and cookie-preference URLs.
- Sitemap collection failures fall back to the static public page entries so a temporary catalog outage does not remove the site map entirely.

Keep only canonical, public URLs in the sitemap. Do not add filtered Shop URLs or user/session-specific routes.
