import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    category?: string | string[]
    type?: string | string[]
    page?: string
    sortBy?: SortOptions
  }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, countryCode } = await params

  const collection = await getCollectionByHandle(handle, [
    "id",
    "title",
    "metadata",
  ])

  if (!collection) {
    notFound()
  }

  const collectionDetails = collectionMetadataCustomFieldsSchema.safeParse(
    collection.metadata ?? {}
  )

  return createPageMetadata({
    title: `${collection.title} Collection`,
    description:
      collectionDetails.success && collectionDetails.data.description
        ? collectionDetails.data.description
        : `Shop the ${collection.title} collection from TechHub.`,
    path: getLocalizedPath(countryCode, `collections/${handle}`),
    keywords: [collection.title, "technology collection", "TechHub shop"],
  })
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle, countryCode } = await params
  const { sortBy, page, category, type } = await searchParams

  const collection = await getCollectionByHandle(handle, [
    "id",
    "title",
    "metadata",
  ])

  if (!collection) {
    notFound()
  }

  return (
    <CollectionTemplate
      collection={collection}
      page={page}
      sortBy={sortBy}
      countryCode={countryCode}
      category={
        !category ? undefined : Array.isArray(category) ? category : [category]
      }
      type={!type ? undefined : Array.isArray(type) ? type : [type]}
    />
  )
}
