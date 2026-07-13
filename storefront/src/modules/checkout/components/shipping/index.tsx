"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { convertToLocale } from "@lib/util/money"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button } from "@/components/Button"
import {
  UiRadio,
  UiRadioBox,
  UiRadioGroup,
  UiRadioLabel,
} from "@/components/ui/Radio"
import { useCartShippingMethods, useSetShippingMethod } from "hooks/cart"
import { StoreCart } from "@medusajs/types"
import {
  canContinueFromShipping,
  getShippingMethodFulfillmentType,
  getShippingMethodsViewState,
  type ShippingMethodFulfillmentType,
} from "./view-state"

const fulfillmentGroupLabels: Record<ShippingMethodFulfillmentType, string> = {
  pickup: "Pickup",
  shipping: "Shipping",
}

const Shipping = ({ cart }: { cart: StoreCart }) => {
  const [error, setError] = useState<string | null>(null)
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<
    string | null
  >(cart.shipping_methods?.[0]?.shipping_option_id ?? null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "shipping"

  const {
    data: availableShippingMethods,
    isFetching: isFetchingShippingMethods,
    refetch: refetchShippingMethods,
  } = useCartShippingMethods(cart.id)
  const shippingMethodsViewState = getShippingMethodsViewState(
    availableShippingMethods
  )

  const { mutate, isPending } = useSetShippingMethod({ cartId: cart.id })
  const selectedShippingMethod = availableShippingMethods?.find(
    (method) => method.id === selectedShippingMethodId
  )
  const canContinue = canContinueFromShipping(
    cart.shipping_methods,
    selectedShippingMethodId
  )
  const fulfillmentGroups: Record<
    ShippingMethodFulfillmentType,
    NonNullable<typeof availableShippingMethods>
  > = { pickup: [], shipping: [] }

  ;(availableShippingMethods ?? []).forEach((method) => {
    fulfillmentGroups[getShippingMethodFulfillmentType(method)].push(method)
  })

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const set = (id: string) => {
    setError(null)
    mutate(
      { shippingMethodId: id },
      {
        onSuccess: () => {
          setSelectedShippingMethodId(id)
        },
        onError: (err) => setError(err.message),
      }
    )
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  useEffect(() => {
    setSelectedShippingMethodId(
      cart.shipping_methods?.[0]?.shipping_option_id ?? null
    )
  }, [cart.shipping_methods])

  return (
    <>
      <div className="flex justify-between mb-6 md:mb-8 border-t border-grayscale-200 pt-8 mt-8">
        <div>
          <p
            className={twJoin(
              "transition-fontWeight duration-75",
              isOpen && "font-semibold"
            )}
          >
            3. Shipping
          </p>
        </div>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Button
              variant="link"
              onPress={() => {
                router.push(pathname + "?step=shipping", { scroll: false })
              }}
            >
              Change
            </Button>
          )}
      </div>
      {isOpen ? (
        shippingMethodsViewState === "loading" ? (
          <div
            aria-live="polite"
            className="rounded-xs border border-grayscale-200 bg-grayscale-50 px-4 py-5"
            data-testid="delivery-options-loading"
            role="status"
          >
            <p className="text-sm font-medium text-grayscale-900">
              Loading shipping methods
            </p>
            <p className="mt-1 text-sm text-grayscale-600">
              We are checking the available delivery options for this address.
            </p>
          </div>
        ) : shippingMethodsViewState === "unavailable" ? (
          <div
            className="rounded-xs border border-red-200 bg-red-50 px-4 py-5"
            data-testid="delivery-options-unavailable"
          >
            <p className="text-sm font-medium text-red-900">
              Shipping methods could not be loaded.
            </p>
            <p className="mt-1 text-sm text-red-900">
              Please try again, or contact us if the issue continues.
            </p>
            <Button
              className="mt-4"
              isLoading={isFetchingShippingMethods}
              loadingText="Checking"
              onPress={() => {
                void refetchShippingMethods()
              }}
              variant="outline"
            >
              Try again
            </Button>
          </div>
        ) : shippingMethodsViewState === "empty" ? (
          <div data-testid="delivery-options-empty">
            <p className="text-red-900">
              There are no shipping methods available for your location. Please
              contact us for further assistance.
            </p>
          </div>
        ) : (
          <div>
            <UiRadioGroup
              className="flex flex-col gap-4 mb-8"
              value={selectedShippingMethod?.id}
              onChange={set}
              aria-label="Shipping methods"
            >
              {(["pickup", "shipping"] as const).map((group) =>
                fulfillmentGroups[group].length > 0 ? (
                  <div key={group} className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">
                      {fulfillmentGroupLabels[group]}
                    </p>
                    {fulfillmentGroups[group].map((option) => (
                      <UiRadio
                        key={option.id}
                        variant="outline"
                        value={option.id}
                        className="gap-4"
                      >
                        <UiRadioBox />
                        <UiRadioLabel>{option.name}</UiRadioLabel>
                        <UiRadioLabel className="ml-auto group-data-[selected=true]:font-normal">
                          {convertToLocale({
                            amount: option.amount!,
                            currency_code: cart?.currency_code,
                          })}
                        </UiRadioLabel>
                      </UiRadio>
                    ))}
                  </div>
                ) : null
              )}
            </UiRadioGroup>

            <ErrorMessage error={error} />

            <Button
              onPress={handleSubmit}
              isLoading={isPending}
              isDisabled={!canContinue || isPending}
            >
              Next
            </Button>
          </div>
        )
      ) : cart &&
        (cart.shipping_methods?.length ?? 0) > 0 &&
        selectedShippingMethod ? (
        <ul className="flex max-sm:flex-col flex-wrap gap-y-2 gap-x-28">
          <li className="text-grayscale-500">Shipping</li>
          <li className="text-grayscale-600">{selectedShippingMethod.name}</li>
        </ul>
      ) : null}
    </>
  )
}

export default Shipping
