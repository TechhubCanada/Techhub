# Storefront Content Refresh: August 10, 2026

## Scope

This refresh applies the supplied TechHub campaign assets and copy updates to the Home, About, Inquiry, and Inspiration pages.

## Asset Map

| Page | Destination | Public asset |
| --- | --- | --- |
| Home | About TechHub visual | `/images/content/techhub-canadian-excellence-hero.png` |
| About | Hero | `/images/content/techhub-canadian-excellence-hero.png` |
| About | Delivery section | `/images/content/techhub-delivery-box.png` |
| About | Repair section | `/images/content/techhub-laptop-repair-hands.jpg` |
| About | Customer section | `/images/content/techhub-customer-rating.jpg` |
| Inquiry | Procurement section | `/images/content/techhub-inquiry-business-collage.png` |
| Inquiry | Support section | `/images/content/techhub-inquiry-laptop-repair.jpg` |
| Inspiration | Desktop Computers card | `/images/content/techhub-desktop-computer.jpg` |
| Inspiration | Business Laptops card | `/images/content/techhub-business-laptops.jpg` |
| Inspiration | Full-width workspace visual | `/images/content/techhub-imac-workstation.jpg` |
| Inspiration | Gaming Products card | `/images/content/techhub-gaming-products.jpg` |

## CMS Publication Requirement

The About route reads the published Medusa Content CMS item `service-pages/about-techhub`. Its metadata can override the static hero image and its body can override the static opening copy.

Publish the matching production values in Medusa Admin before release:

- `metadata.image_url`: `/images/content/techhub-canadian-excellence-hero.png`
- `metadata.image_alt`: `Laptop displaying TechHub's Canadian-owned service message`
- `body`: `We help customers shop for computers, laptops, tablets, networking equipment, software, printers, and accessories.`

If the item remains unpublished or the CMS is unavailable, the storefront uses the updated static values.

## Inquiry Delivery Requirement

The inquiry route already falls back to `info@techhubcanada.com`. Mail delivery still requires the storefront deployment environment to define valid `RESEND_API_KEY` and `RESEND_FROM` values. Set `CONTACT_INQUIRY_TO=info@techhubcanada.com` explicitly in Preview and Production to make the recipient configuration clear.

## Automated Coverage

Run the supplied-content page checks and inquiry route coverage without starting a server:

```sh
node storefront/src/app/[countryCode]/(main)/__tests__/homepage-support.unit.mjs
node storefront/src/app/[countryCode]/(main)/about/__tests__/about-page-content.unit.mjs
node storefront/src/app/[countryCode]/(main)/inquiry/__tests__/inquiry-hero-form.unit.mjs
node storefront/src/app/[countryCode]/(main)/inspiration/__tests__/inspiration-page-content.unit.mjs
node storefront/src/app/api/inquiry/__tests__/inquiry-route.unit.mjs
```
