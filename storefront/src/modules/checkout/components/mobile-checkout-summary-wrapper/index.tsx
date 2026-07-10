"use client"
import type { StoreCart } from "@medusajs/types"

import MobileCheckoutSummary from "@modules/checkout/templates/mobile-checkout-summary"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SkeletonMobileCheckoutSummaryTrigger from "@modules/skeletons/components/skeleton-mobile-summary-trigger"

function MobileCheckoutSummaryWrapper({
  initialCart,
}: {
  initialCart: StoreCart | null
}) {
  const { data: cart, isPending } = useCart({
    enabled: Boolean(initialCart),
    initialData: initialCart,
  })
  const displayCart = cart ?? initialCart

  if (isPending && !displayCart) {
    return <SkeletonMobileCheckoutSummaryTrigger />
  }

  if (!displayCart) {
    return null
  }

  return <MobileCheckoutSummary cart={displayCart} />
}

export default withReactQueryProvider(MobileCheckoutSummaryWrapper)
