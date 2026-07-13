import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    collection?: string | string[]
    category?: string | string[]
    type?: string | string[]
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata({
  params,
}: Pick<Params, "params">): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "Shop Computers, Printers & Technology",
    description:
      "Shop laptops, desktops, printers, networking gear, parts, accessories, ink, toner, and technology products from TechHub.",
    path: getLocalizedPath(countryCode, "store"),
    keywords: [
      "shop computers",
      "laptops",
      "desktops",
      "printers",
      "networking gear",
      "computer accessories",
      "ink and toner",
    ],
  })
}

export default async function StorePage({ searchParams, params }: Params) {
  const { countryCode } = await params
  const { sortBy, page, collection, category, type } = await searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      collection={
        !collection
          ? undefined
          : Array.isArray(collection)
            ? collection
            : [collection]
      }
      category={
        !category ? undefined : Array.isArray(category) ? category : [category]
      }
      type={!type ? undefined : Array.isArray(type) ? type : [type]}
    />
  )
}
