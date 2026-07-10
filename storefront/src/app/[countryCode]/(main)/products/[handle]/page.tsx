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

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

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

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
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

  return (
    <ProductTemplate
      product={pricedProduct}
      materials={fashionData.materials}
      region={region}
      countryCode={countryCode}
      reviews={reviews}
      buyingGuides={buyingGuides}
    />
  )
}
