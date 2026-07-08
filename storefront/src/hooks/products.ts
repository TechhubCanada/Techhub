import { getLiveProductByHandle } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { useQuery } from "@tanstack/react-query"

export const useLiveProduct = ({
  handle,
  regionId,
  initialProduct,
}: {
  handle: string
  regionId: string
  initialProduct: HttpTypes.StoreProduct
}) => {
  return useQuery({
    queryKey: ["product", handle, regionId],
    queryFn: async () => {
      return getLiveProductByHandle(handle, regionId)
    },
    initialData: initialProduct,
    refetchOnWindowFocus: true,
  })
}
