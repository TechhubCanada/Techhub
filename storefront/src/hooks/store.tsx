import { getProductsListWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useStoreProducts = ({
  page,
  queryParams,
  sortBy,
  countryCode,
}: {
  page: number
  queryParams: HttpTypes.StoreProductListParams
  sortBy: SortOptions | undefined
  countryCode: string
}) => {
  return useQuery({
    queryKey: ["products", "list", { page, queryParams, sortBy, countryCode }],
    queryFn: async () => {
      return getProductsListWithSort({
        page,
        queryParams,
        sortBy,
        countryCode,
      })
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  })
}
