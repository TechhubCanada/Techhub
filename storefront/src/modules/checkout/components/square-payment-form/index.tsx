"use client"

import { HttpTypes } from "@medusajs/types"
import {
  ApplePay,
  CreditCard,
  GooglePay,
  PaymentForm,
} from "react-square-web-payments-sdk"
import { usePathname, useRouter } from "next/navigation"

import { useInitiatePaymentSession, useSquarePaymentConfig } from "hooks/cart"
import type { SquarePaymentConfig } from "@lib/data/payment"

const getPaymentError = (token: {
  status?: string
  errors?: Array<{ message?: string; detail?: string }>
}) => {
  if (token.status?.toLowerCase() === "cancel") {
    return "Enter complete card details to continue."
  }

  const error = token.errors?.[0]

  return (
    error?.message || error?.detail || "Payment details could not be verified"
  )
}

type SquarePaymentFormProps = {
  cart: HttpTypes.StoreCart
  createQueryString: (name: string, value: string) => string
  isLoading: boolean
  selectedPaymentMethod: string
  setError: (value: string | null) => void
  setIsLoading: (value: boolean) => void
  initialSquarePaymentConfig: SquarePaymentConfig
}

const SquarePaymentForm = ({
  cart,
  createQueryString,
  isLoading,
  selectedPaymentMethod,
  setError,
  setIsLoading,
  initialSquarePaymentConfig,
}: SquarePaymentFormProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: squareConfig, isLoading: isConfigLoading } =
    useSquarePaymentConfig(!initialSquarePaymentConfig, {
      initialData: initialSquarePaymentConfig,
    })
  const initiatePaymentSession = useInitiatePaymentSession()

  const countryCode =
    cart.shipping_address?.country_code?.toUpperCase() ||
    cart.billing_address?.country_code?.toUpperCase() ||
    "US"
  const currencyCode =
    squareConfig?.currency?.toUpperCase() || cart.currency_code.toUpperCase()
  const amount = String(cart.total ?? 0)

  if (isConfigLoading) {
    return (
      <div className="mt-5 min-h-14.5 rounded-xs border border-grayscale-200 px-4 py-4 text-sm text-grayscale-500">
        Loading payment form
      </div>
    )
  }

  if (!squareConfig?.application_id || !squareConfig.location_id) {
    return (
      <div className="mt-5 rounded-xs border border-grayscale-200 px-4 py-4 text-sm text-grayscale-500">
        Square is not configured yet. Connect Square in Medusa Admin and select
        a processing location.
      </div>
    )
  }

  return (
    <div className="mt-5">
      <PaymentForm
        applicationId={squareConfig.application_id}
        locationId={squareConfig.location_id}
        formProps={{ className: "space-y-4" }}
        cardTokenizeResponseReceived={async (token, buyer) => {
          setError(null)

          if (token.status !== "OK") {
            setError(getPaymentError(token))
            return
          }

          setIsLoading(true)

          try {
            await initiatePaymentSession.mutateAsync({
              providerId: selectedPaymentMethod,
              data: {
                token,
                buyer,
                cart_id: cart.id,
              },
            })

            router.push(pathname + "?" + createQueryString("step", "review"), {
              scroll: false,
            })
          } catch (err) {
            setError(err instanceof Error ? err.message : String(err))
          } finally {
            setIsLoading(false)
          }
        }}
        createPaymentRequest={() => ({
          countryCode,
          currencyCode,
          requestBillingInfo: true,
          requestShippingAddress: false,
          total: {
            amount,
            label: "TechHub",
          },
        })}
        createVerificationDetails={() => ({
          amount,
          billingContact: {
            addressLines: [
              cart.billing_address?.address_1 ||
                cart.shipping_address?.address_1 ||
                "",
              cart.billing_address?.address_2 ||
                cart.shipping_address?.address_2 ||
                "",
            ].filter(Boolean),
            city:
              cart.billing_address?.city || cart.shipping_address?.city || "",
            countryCode,
            familyName:
              cart.billing_address?.last_name ||
              cart.shipping_address?.last_name ||
              "",
            givenName:
              cart.billing_address?.first_name ||
              cart.shipping_address?.first_name ||
              "",
            postalCode:
              cart.billing_address?.postal_code ||
              cart.shipping_address?.postal_code ||
              "",
            state:
              cart.billing_address?.province ||
              cart.shipping_address?.province ||
              "",
          },
          currencyCode,
          intent: "CHARGE",
        })}
      >
        <div className="space-y-3">
          <ApplePay />
          <GooglePay />
          <p className="text-xs text-grayscale-500">
            Apple Pay is available in Safari on Apple Pay-capable devices after
            the TechHub domain is registered in Square.
          </p>
        </div>
        <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-wide text-grayscale-500">
          <span className="h-px flex-1 bg-grayscale-200" />
          <span>Card</span>
          <span className="h-px flex-1 bg-grayscale-200" />
        </div>
        <CreditCard
          render={(SquareButton) => (
            <SquareButton
              className="mt-6 flex h-12.5 w-full items-center justify-center rounded-xs bg-grayscale-900 px-5 text-sm font-medium text-white transition-colors hover:bg-grayscale-700 disabled:cursor-not-allowed disabled:opacity-50"
              isLoading={isLoading || initiatePaymentSession.isPending}
            >
              Continue to review
            </SquareButton>
          )}
        />
      </PaymentForm>
    </div>
  )
}

export default SquarePaymentForm
