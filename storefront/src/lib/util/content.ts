import type { ContentItem } from "@lib/data/content"

type ContentMetadata = Record<string, unknown> | null | undefined

type SortableContentItem = {
  metadata?: ContentMetadata
}

export const getContentMetadataString = (
  metadata: ContentMetadata,
  key: string
) => {
  const value = metadata?.[key]

  if (typeof value !== "string") {
    return undefined
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : undefined
}

export const getContentMetadataNumber = (
  metadata: ContentMetadata,
  key: string
) => {
  const value = metadata?.[key]

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

export const getSortedContentItems = <T extends SortableContentItem>(
  items: T[]
) => {
  return [...items].sort((first, second) => {
    const firstOrder = getContentMetadataNumber(first.metadata, "sort_order")
    const secondOrder = getContentMetadataNumber(second.metadata, "sort_order")

    if (typeof firstOrder === "number" && typeof secondOrder === "number") {
      return firstOrder - secondOrder
    }

    if (typeof firstOrder === "number") {
      return -1
    }

    if (typeof secondOrder === "number") {
      return 1
    }

    return 0
  })
}

export const getContentSummary = (item: ContentItem, maxLength = 180) => {
  const metadataSummary = getContentMetadataString(item.metadata, "summary")

  if (metadataSummary) {
    return metadataSummary
  }

  const body = item.body
    ?.replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!body) {
    return undefined
  }

  if (body.length <= maxLength) {
    return body
  }

  return `${body.slice(0, maxLength).trim()}...`
}

type BuyingGuideTaggedProduct = {
  type?: { value?: string | null } | null
  collection?: { handle?: string | null } | null
  categories?: { handle?: string | null }[] | null
}

export const getProductBuyingGuideTags = (
  product: BuyingGuideTaggedProduct
) => {
  return [
    product.type?.value,
    product.collection?.handle,
    ...(product.categories?.map((category) => category.handle) ?? []),
  ].filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
}
