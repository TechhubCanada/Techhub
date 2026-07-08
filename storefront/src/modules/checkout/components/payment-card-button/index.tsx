"use client"

import * as React from "react"
import { HttpTypes } from "@medusajs/types"

import { isSquare } from "@lib/constants"
import { Button } from "@/components/Button"
import { usePathname, useRouter } from "next/navigation"
import { useInitiatePaymentSession } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"
import SquarePaymentForm from "@modules/checkout/components/square-payment-form"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}

const PaymentCardButton: React.FC<PaymentButtonProps> = ({
  cart,
  isLoading,
  setIsLoading,
  createQueryString,
  selectedPaymentMethod,
  setError,
}) => {
  if (isSquare(selectedPaymentMethod)) {
    return (
      <SquarePaymentForm
        cart={cart}
        createQueryString={createQueryString}
        isLoading={isLoading}
        selectedPaymentMethod={selectedPaymentMethod}
        setError={setError}
        setIsLoading={setIsLoading}
      />
    )
  }

  return (
    <PaymentMethodButton
      setError={setError}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      createQueryString={createQueryString}
      selectedPaymentMethod={selectedPaymentMethod}
    />
  )
}

const PaymentMethodButton = ({
  isLoading,
  setIsLoading,
  createQueryString,
  selectedPaymentMethod,
  setError,
}: {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  createQueryString: (name: string, value: string) => string
  selectedPaymentMethod: string
  setError: (value: string | null) => void
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const initiatePaymentSession = useInitiatePaymentSession()

  const handleSubmit = () => {
    setIsLoading(true)
    initiatePaymentSession.mutate(
      {
        providerId: selectedPaymentMethod,
      },
      {
        onSuccess: () => {
          return router.push(
            pathname + "?" + createQueryString("step", "review"),
            {
              scroll: false,
            }
          )
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : String(err))
          setIsLoading(false)
        },
      }
    )
  }

  return (
    <Button
      className="mt-6"
      onPress={handleSubmit}
      isLoading={isLoading}
      data-testid="submit-payment-button"
      isDisabled={!selectedPaymentMethod}
    >
      Continue to review
    </Button>
  )
}

export default withReactQueryProvider(PaymentCardButton)
