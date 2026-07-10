"use server"

import { sdk } from "@lib/config"

export type ContentFormat = "html" | "img" | "json" | "md" | "text"
export type ContentStatus = "draft" | "published" | "archived"

export type ContentField = {
  id: string
  name: string
  label: string
  field_type: string
  sort_order?: number
}

export type ContentTag = {
  id: string
  value: string
  metadata?: Record<string, unknown> | null
}

export type ContentCreator = {
  id: string
  name: string
  bio?: string | null
  avatar_url?: string | null
  metadata?: Record<string, unknown> | null
}

export type ContentCollection = {
  id: string
  label: string
  slug: string
  format: ContentFormat
  prefix?: string | null
  metadata?: Record<string, unknown> | null
  content_fields?: ContentField[]
}

export type ContentItem = {
  id: string
  title: string
  slug: string
  body?: string | null
  status: ContentStatus
  published_at?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  content_collection?: Pick<
    ContentCollection,
    "id" | "label" | "slug" | "format"
  >
  creator?: ContentCreator | null
  tags?: ContentTag[]
}

type ContentFindParams = {
  fields?: string | string[]
  limit?: number
  offset?: number
}

type ListContentCollectionsParams = ContentFindParams & {
  q?: string
}

type ListContentItemsParams = ContentFindParams & {
  q?: string
  tag?: string
}

type ContentCollectionsResponse = {
  content_collections: ContentCollection[]
  count?: number
  limit?: number
  offset?: number
}

type ContentItemsResponse = {
  content_items: ContentItem[]
  count?: number
  limit?: number
  offset?: number
}

const resolveFields = (fields?: string | string[]) => {
  return Array.isArray(fields) ? fields.join(",") : fields
}

export const listContentCollections = async function ({
  fields,
  limit = 50,
  offset = 0,
  q,
}: ListContentCollectionsParams = {}) {
  return sdk.client.fetch<ContentCollectionsResponse>("/content", {
    query: {
      fields: resolveFields(fields),
      limit,
      offset,
      q,
    },
    next: { tags: ["content"] },
    cache: "force-cache",
  })
}

export const getContentCollection = async function (
  slug: string,
  fields?: string | string[]
) {
  return sdk.client
    .fetch<{ content_collection: ContentCollection }>(`/content/${slug}`, {
      query: { fields: resolveFields(fields) },
      next: { tags: ["content", `content:${slug}`] },
      cache: "force-cache",
    })
    .then(({ content_collection }) => content_collection)
}

export const listContentItems = async function (
  collectionSlug: string,
  { fields, limit = 15, offset = 0, q, tag }: ListContentItemsParams = {}
) {
  return sdk.client.fetch<ContentItemsResponse>(
    `/content/${collectionSlug}/items`,
    {
      query: {
        fields: resolveFields(fields),
        limit,
        offset,
        q,
        tag,
      },
      next: { tags: ["content", `content:${collectionSlug}`] },
      cache: "force-cache",
    }
  )
}

export const getContentItem = async function (
  collectionSlug: string,
  itemSlug: string,
  fields?: string | string[]
) {
  return sdk.client
    .fetch<{ content_item: ContentItem }>(
      `/content/${collectionSlug}/items/${itemSlug}`,
      {
        query: { fields: resolveFields(fields) },
        next: {
          tags: ["content", `content:${collectionSlug}`, `content:${itemSlug}`],
        },
        cache: "force-cache",
      }
    )
    .then(({ content_item }) => content_item)
}
