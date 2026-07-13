import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listContentItems } from "@lib/data/content"
import { getRegion } from "@lib/data/regions"
import {
  getProductByHandle,
  getProductFashionDataByHandle,
} from "@lib/data/products"
import { getProductReviews } from "@lib/data/product-reviews"
import {
  getProductBuyingGuideTags,
  getSortedContentItems,
} from "@lib/util/content"
import ProductTemplate from "@modules/products/templates"
import { createPageMetadata, getAbsoluteUrl, getLocalizedPath } from "@lib/seo"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  const productKeywords = [
    product.title,
    product.type?.value,
    ...(product.categories?.map((category) => category.name) ?? []),
    typeof product.metadata?.brand === "string" ? product.metadata.brand : "",
  ].filter((keyword): keyword is string => Boolean(keyword))
  const description =
    product.description?.replace(/\s+/g, " ").trim() ||
    `Shop ${product.title} from TechHub.`

  return createPageMetadata({
    title: product.title,
    description,
    path: getLocalizedPath(countryCode, `products/${handle}`),
    keywords: productKeywords,
    image: product.thumbnail,
  })
}

export default async function ProductPage({ params }: Props) {
  const { handle, countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const [pricedProduct, fashionData] = await Promise.all([
    getProductByHandle(handle, region.id),
    getProductFashionDataByHandle(handle),
  ])

  if (!pricedProduct) {
    notFound()
  }

  const guideTags = getProductBuyingGuideTags(pricedProduct)
  const [reviews, guideResponses] = await Promise.all([
    getProductReviews(pricedProduct.id),
    Promise.all(
      guideTags.map((tag) =>
        listContentItems("buying-guides", { tag, limit: 3 }).catch(() => null)
      )
    ),
  ])
  const buyingGuides = getSortedContentItems(
    Array.from(
      new Map(
        guideResponses
          .flatMap((response) => response?.content_items ?? [])
          .map((item) => [item.id, item])
      ).values()
    )
  ).slice(0, 3)
  const productDescription =
    pricedProduct.description?.replace(/\s+/g, " ").trim() ||
    `Shop ${pricedProduct.title} from TechHub.`
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pricedProduct.title,
    description: productDescription,
    url: getAbsoluteUrl(
      getLocalizedPath(countryCode, `products/${pricedProduct.handle}`)
    ),
    ...(pricedProduct.thumbnail ? { image: [pricedProduct.thumbnail] } : {}),
    ...(typeof pricedProduct.metadata?.brand === "string"
      ? {
          brand: {
            "@type": "Brand",
            name: pricedProduct.metadata.brand,
          },
        }
      : {}),
    ...(pricedProduct.variants?.[0]?.sku
      ? { sku: pricedProduct.variants[0].sku }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <ProductTemplate
        product={pricedProduct}
        materials={fashionData.materials}
        region={region}
        countryCode={countryCode}
        reviews={reviews}
        buyingGuides={buyingGuides}
      />
    </>
  )
}
