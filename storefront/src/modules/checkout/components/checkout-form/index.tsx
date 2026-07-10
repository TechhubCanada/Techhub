"use client"
import { withReactQueryProvider } from "@lib/util/react-query"
import React from "react"
import { useRouter } from "next/navigation"

import Wrapper from "@modules/checkout/components/payment-wrapper"
import Email from "@modules/checkout/components/email"
import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import { useCart } from "hooks/cart"
import { getCheckoutStep } from "@modules/cart/utils/getCheckoutStep"
import { Icon } from "@/components/Icon"
import type { StoreCart } from "@medusajs/types"

export const CheckoutForm = withReactQueryProvider<{
  countryCode: string
  step: string | undefined
  initialCart: StoreCart
}>(({ countryCode, step, initialCart }) => {
  const { data: cart, isPending } = useCart({
    enabled: true,
    initialData: initialCart,
  })
  const displayCart = cart ?? initialCart

  const router = useRouter()

  React.useEffect(() => {
    if (!step && displayCart) {
      const checkoutStep = getCheckoutStep(displayCart)
      router.push(`/${countryCode}/checkout?step=${checkoutStep}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, countryCode, displayCart])

  if (isPending && !displayCart) {
    return (
      <div className="absolute left-0 top-20 md:top-40 lg:top-0 w-[100vw] lg:max-w-[calc(100vw-((50vw-50%)+448px))] xl:max-w-[calc(100vw-((50vw-50%)+540px))] -ml-[calc(50vw-50%)] h-screen lg:w-full flex items-center justify-center">
        <Icon name="loader" className="w-10 md:w-20 animate-spin" />
      </div>
    )
  }

  if (!displayCart) {
    return null
  }

  return (
    <Wrapper cart={displayCart}>
      <Email countryCode={countryCode} cart={displayCart} />
      <Addresses cart={displayCart} />
      <Shipping cart={displayCart} />
      <Payment cart={displayCart} />
      <Review cart={displayCart} />
    </Wrapper>
  )
})
