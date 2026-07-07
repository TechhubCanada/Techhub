import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle } from "@lib/data/collections"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { collectionMetadataCustomFieldsSchema } from "@lib/util/collections"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    category?: string | string[]
    type?: string | string[]
    page?: string
    sortBy?: SortOptions
  }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params

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

  const metadata = {
    title: `${collection.title} | Medusa Store`,
    description:
      collectionDetails.success && collectionDetails.data.description
        ? collectionDetails.data.description
        : `${collection.title} collection`,
  } as Metadata

  return metadata
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
