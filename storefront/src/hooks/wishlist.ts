import {
  addVariantToWishlist,
  removeWishlistItem,
} from "@lib/data/wishlist"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddVariantToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["wishlist", "add-variant"],
    mutationFn: async (variantId: string) => {
      return addVariantToWishlist(variantId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["wishlist"],
      })
    },
  })
}

export const useRemoveWishlistItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["wishlist", "remove-item"],
    mutationFn: async (itemId: string) => {
      return removeWishlistItem(itemId)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["wishlist"],
      })
    },
  })
}
