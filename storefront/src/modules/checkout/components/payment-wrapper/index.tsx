"use client"

import * as React from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { isPaypal } from "@lib/constants"
import { withReactQueryProvider } from "@lib/util/react-query"
import { StoreCart } from "@medusajs/types"

type WrapperProps = {
  children: React.ReactNode
  cart: StoreCart
}

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const Wrapper: React.FC<WrapperProps> = ({ children, cart }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isPaypal(paymentSession?.provider_id) &&
    paypalClientId !== undefined &&
    cart
  ) {
    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          currency: cart?.currency_code.toUpperCase(),
          intent: "authorize",
          components: "buttons",
        }}
      >
        {children}
      </PayPalScriptProvider>
    )
  }

  return <div>{children}</div>
}

export default withReactQueryProvider(Wrapper)
