"use client"

import { HttpTypes, StoreProduct } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Pagination } from "@modules/store/components/pagination"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NoResults } from "@modules/store/components/no-results.tsx"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useStoreProducts } from "hooks/store"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12
function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  typeId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string | string[]
  categoryId?: string | string[]
  typeId?: string | string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = Array.isArray(collectionId)
      ? collectionId
      : [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = Array.isArray(categoryId)
      ? categoryId
      : [categoryId]
  }

  if (typeId) {
    queryParams["type_id"] = Array.isArray(typeId) ? typeId : [typeId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const productsQuery = useStoreProducts({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  if (productsQuery.isPending) {
    return <SkeletonProductGrid />
  }

  const products = productsQuery.data?.response.products ?? []
  const count = productsQuery.data?.response.count ?? 0
  const hasProductScope = !productsIds || productsIds.length > 0
  const totalPages = hasProductScope ? Math.ceil(count / PRODUCT_LIMIT) : 0

  return (
    <>
      <Layout className="gap-y-10 md:gap-y-16 mb-16">
        {products.length > 0 && hasProductScope ? (
          products.map((p: StoreProduct) => {
            return (
              <LayoutColumn key={p.id} className="md:!col-span-4 !col-span-6">
                <ProductPreview product={p} />
              </LayoutColumn>
            )
          })
        ) : (
          <NoResults />
        )}
      </Layout>
      {totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          data-testid="product-pagination"
        />
      )}
    </>
  )
}

export default withReactQueryProvider(PaginatedProducts)
