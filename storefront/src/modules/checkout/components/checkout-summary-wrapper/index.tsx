"use client"
import type { StoreCart } from "@medusajs/types"

import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SkeletonCheckoutSummary from "@modules/skeletons/templates/skeleton-checkout-summary"

function CheckoutSummaryWrapper({
  initialCart,
}: {
  initialCart: StoreCart | null
}) {
  const { data: cart, isPending } = useCart({
    enabled: true,
    initialData: initialCart,
  })
  const displayCart = cart ?? initialCart

  if (isPending && !displayCart) {
    return <SkeletonCheckoutSummary />
  }

  if (!displayCart) {
    return null
  }

  return <CheckoutSummary cart={displayCart} />
}

export default withReactQueryProvider(CheckoutSummaryWrapper)
