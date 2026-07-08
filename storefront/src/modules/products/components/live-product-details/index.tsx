"use client"

import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductInfo from "@modules/products/templates/product-info"
import ProductActions from "@modules/products/components/product-actions"
import { useLiveProduct } from "hooks/products"

type LiveProductDetailsProps = {
  product: HttpTypes.StoreProduct
  materials: {
    id: string
    name: string
    colors: {
      id: string
      name: string
      hex_code: string
    }[]
  }[]
  region: HttpTypes.StoreRegion
}

export const LiveProductDetails = ({
  product,
  materials,
  region,
}: LiveProductDetailsProps) => {
  const liveProductQuery = useLiveProduct({
    handle: product.handle ?? product.id,
    regionId: region.id,
    initialProduct: product,
  })

  const liveProduct = liveProductQuery.data ?? product

  return (
    <>
      <ProductInfo product={liveProduct} />
      <Suspense>
        <ProductActions
          product={liveProduct}
          materials={materials}
          region={region}
        />
      </Suspense>
    </>
  )
}
