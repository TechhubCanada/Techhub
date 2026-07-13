import { MetadataRoute } from "next"
import { getAbsoluteUrl } from "@lib/seo"

export default function robots(): MetadataRoute.Robots {
  if (process.env.DISALLOW_ROBOTS) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/medusa/",
        "/*/account/",
        "/*/auth/",
        "/*/cart/",
        "/*/checkout/",
        "/*/order/",
        "/*/search/",
        "/*/cookie-preferences/",
      ],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  }
}
