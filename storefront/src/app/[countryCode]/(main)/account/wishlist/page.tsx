import * as React from "react"
import { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { retrieveWishlistItems } from "@lib/data/wishlist"
import { ButtonLink } from "@/components/Button"
import { LocalizedLink } from "@/components/LocalizedLink"
import RemoveWishlistItemButton from "@modules/account/components/RemoveWishlistItemButton"

export const metadata: Metadata = {
  title: "Account - Wishlist",
  description: "Review your saved Tech Hub products",
}

export default async function AccountWishlistPage() {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/`)
  }

  const items = await retrieveWishlistItems()

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">Wishlist</h1>
      {items.length > 0 ? (
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const product = item.product_variant?.product
            const href = product?.handle
              ? `/products/${product.handle}`
              : "/store"

            return (
              <div
                key={item.id}
                className="rounded-xs border border-grayscale-200 flex gap-4 p-4"
              >
                <LocalizedLink
                  href={href}
                  className="relative w-20 shrink-0 overflow-hidden rounded-2xs bg-grayscale-50 aspect-square"
                >
                  {product?.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.title ?? "Wishlist product"}
                      fill
                      className="object-cover"
                    />
                  )}
                </LocalizedLink>
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <LocalizedLink href={href} className="font-semibold">
                      {product?.title ?? "Saved product"}
                    </LocalizedLink>
                    {item.product_variant?.title && (
                      <p className="mt-1 text-xs text-grayscale-500">
                        {item.product_variant.title}
                      </p>
                    )}
                  </div>
                  <RemoveWishlistItemButton itemId={item.id} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-start gap-6">
          <p className="text-md">You haven&apos;t saved any products yet.</p>
          <ButtonLink href="/store" variant="outline">
            Browse products
          </ButtonLink>
        </div>
      )}
    </>
  )
}
