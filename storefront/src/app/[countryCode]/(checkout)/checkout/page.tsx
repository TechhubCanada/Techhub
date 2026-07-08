import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCart } from "@lib/data/cart"
import { CheckoutForm } from "@modules/checkout/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const cart = await retrieveCart()
  if (!cart) {
    return notFound()
  }

  const { countryCode } = await params
  const { step } = await searchParams

  return (
    <CheckoutForm countryCode={countryCode} step={step} initialCart={cart} />
  )
}
