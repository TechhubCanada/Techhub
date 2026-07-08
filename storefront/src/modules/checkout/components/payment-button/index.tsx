"use client"

import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"

import Spinner from "@modules/common/icons/spinner"
import { isManual, isPaypal, isSquare } from "@lib/constants"
import { Button } from "@/components/Button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { usePlaceOrder } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  selectPaymentMethod: () => void
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  selectPaymentMethod,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isSquare(paymentSession?.provider_id):
      return <SquarePaymentButton notReady={notReady} cart={cart} />
    case isManual(paymentSession?.provider_id):
      return <ManualTestPaymentButton notReady={notReady} />
    case isPaypal(paymentSession?.provider_id):
      return <PayPalPaymentButton notReady={notReady} cart={cart} />
    default:
      return (
        <Button
          className="w-full"
          onPress={() => {
            selectPaymentMethod()
          }}
        >
          Select a payment method
        </Button>
      )
  }
}

const SquarePaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  return (
    <PlaceOrderButton
      isDisabled={notReady || !session?.data?.token}
      loadingLabel="Place order"
    />
  )
}

const PayPalPaymentButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const router = useRouter()

  const placeOrder = usePlaceOrder()

  const onPaymentCompleted = () => {
    placeOrder.mutate(null, {
      onSuccess: (data) => {
        if (data?.type === "order") {
          const countryCode =
            data.order.shipping_address?.country_code?.toLowerCase()
          router.push("/" + countryCode + "/order/confirmed/" + data.order.id)
        } else if (data?.error) {
          setErrorMessage(data.error.message)
        }
        setSubmitting(false)
      },
      onError: (error) => {
        setErrorMessage(error.message)
        setSubmitting(false)
      },
    })
  }

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const handlePayment = async (
    _data: OnApproveData,
    actions: OnApproveActions
  ) => {
    setSubmitting(true)
    actions?.order
      ?.authorize()
      .then((authorization) => {
        if (authorization.status !== "COMPLETED") {
          setErrorMessage("An error occurred, status: " + authorization.status)
          setSubmitting(false)
          return
        }
        onPaymentCompleted()
      })
      .catch(() => {
        setErrorMessage("An unknown error occurred, please try again.")
        setSubmitting(false)
      })
  }

  const [{ isPending, isResolved }] = usePayPalScriptReducer()

  if (isPending) {
    return <Spinner />
  }

  if (isResolved) {
    return (
      <>
        <PayPalButtons
          style={{ layout: "horizontal" }}
          createOrder={async () => session?.data.id as string}
          onApprove={handlePayment}
          disabled={notReady || submitting || isPending}
        />
        <ErrorMessage error={errorMessage} />
      </>
    )
  }
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  return <PlaceOrderButton isDisabled={notReady} loadingLabel="Place order" />
}

const PlaceOrderButton = ({
  isDisabled,
  loadingLabel,
}: {
  isDisabled: boolean
  loadingLabel: string
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const placeOrder = usePlaceOrder()

  const router = useRouter()

  const handlePayment = () => {
    placeOrder.mutate(null, {
      onSuccess: (data) => {
        if (data?.type === "order") {
          const countryCode =
            data.order.shipping_address?.country_code?.toLowerCase()
          router.push("/" + countryCode + "/order/confirmed/" + data.order.id)
        } else if (data?.error) {
          setErrorMessage(data.error.message)
        }
      },
      onError: (error) => {
        setErrorMessage(error.message)
      },
    })
  }

  return (
    <>
      <Button
        isDisabled={isDisabled}
        isLoading={placeOrder.isPending}
        onPress={handlePayment}
        className="w-full"
      >
        {loadingLabel}
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

export default withReactQueryProvider(PaymentButton)
