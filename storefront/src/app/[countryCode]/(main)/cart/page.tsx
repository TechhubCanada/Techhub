import { Metadata } from "next"
import CartTemplate from "@modules/cart/templates"
import { noIndexMetadata } from "@lib/seo"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
  robots: noIndexMetadata,
}
export default function Cart() {
  return <CartTemplate />
}
