import type { MetadataRoute } from "next"
import { getCollectionsList } from "@lib/data/collections"
import { listContentItems } from "@lib/data/content"
import { getProductsList } from "@lib/data/products"
import { listRegionCountryCodes } from "@lib/data/regions"
import { getAbsoluteUrl, getLocalizedPath } from "@lib/seo"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"

const staticPaths = [
  "",
  "store",
  "about",
  "inspiration",
  "inquiry",
  "privacy-policy",
  "cookie-policy",
  "refund-policy",
  "terms-of-use",
]

const SITEMAP_PAGE_SIZE = 100

const getSitemapProducts = async (countryCode: string) => {
  const firstPage = await getProductsList({
    countryCode,
    queryParams: {
      limit: SITEMAP_PAGE_SIZE,
      fields: "handle,updated_at",
    },
  })

  const pageCount = Math.ceil(firstPage.response.count / SITEMAP_PAGE_SIZE)

  if (pageCount <= 1) {
    return firstPage.response.products
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      getProductsList({
        countryCode,
        pageParam: index + 2,
        queryParams: {
          limit: SITEMAP_PAGE_SIZE,
          fields: "handle,updated_at",
        },
      })
    )
  )

  return [
    ...firstPage.response.products,
    ...remainingPages.flatMap((page) => page.response.products),
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configuredCountryCodes = getStaticCountryCodes()
  const regionCountryCodes = await listRegionCountryCodes().catch(() => [])
  const countryCodes = Array.from(
    new Set([...configuredCountryCodes, ...regionCountryCodes])
  )

  const staticEntries = countryCodes.flatMap((countryCode) =>
    staticPaths.map((path) => ({
      url: getAbsoluteUrl(getLocalizedPath(countryCode, path)),
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    }))
  )

  const [collectionsResult, guidesResult, productResults] = await Promise.all([
    getCollectionsList(0, 100, ["handle", "updated_at"]).catch(() => ({
      collections: [],
      count: 0,
    })),
    listContentItems("buying-guides", { limit: 100 }).catch(() => ({
      content_items: [],
    })),
    Promise.all(
      countryCodes.map(async (countryCode) => {
        const products = await getSitemapProducts(countryCode).catch(() => [])

        return { countryCode, products }
      })
    ),
  ])

  const collectionEntries = countryCodes.flatMap((countryCode) =>
    collectionsResult.collections
      .filter((collection) => Boolean(collection.handle))
      .map((collection) => ({
        url: getAbsoluteUrl(
          getLocalizedPath(countryCode, `collections/${collection.handle}`)
        ),
        lastModified: collection.updated_at
          ? new Date(collection.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  )

  const guideEntries = countryCodes.flatMap((countryCode) =>
    guidesResult.content_items
      .filter((guide) => guide.status === "published" && Boolean(guide.slug))
      .map((guide) => ({
        url: getAbsoluteUrl(
          getLocalizedPath(countryCode, `buying-guides/${guide.slug}`)
        ),
        lastModified: guide.published_at
          ? new Date(guide.published_at)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
  )

  const productEntries = productResults.flatMap(({ countryCode, products }) =>
    products
      .filter((product) => Boolean(product.handle))
      .map((product) => ({
        url: getAbsoluteUrl(
          getLocalizedPath(countryCode, `products/${product.handle}`)
        ),
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  )

  return [
    ...staticEntries,
    ...collectionEntries,
    ...guideEntries,
    ...productEntries,
  ]
}
