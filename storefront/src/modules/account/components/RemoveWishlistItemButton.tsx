"use client"

import { Button } from "@/components/Button"
import { useRemoveWishlistItem } from "hooks/wishlist"

export default function RemoveWishlistItemButton({
  itemId,
}: {
  itemId: string
}) {
  const { mutateAsync, isPending } = useRemoveWishlistItem()

  return (
    <Button
      variant="outline"
      size="sm"
      iconName="trash"
      isLoading={isPending}
      onPress={() => mutateAsync(itemId)}
    >
      Remove
    </Button>
  )
}
