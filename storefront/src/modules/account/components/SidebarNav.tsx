"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"

import { useCountryCode } from "hooks/country-code"
import { LocalizedLink } from "@/components/LocalizedLink"

export const SidebarNav: React.FC = () => {
  const pathName = usePathname()
  const countryCode = useCountryCode()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  return (
    <nav
      aria-label="Account navigation"
      className="flex gap-8 md:flex-col md:gap-0"
    >
      <LocalizedLink
        href="/account"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath === "/account" && "font-semibold"
        )}
      >
        Personal &amp; security
      </LocalizedLink>
      <LocalizedLink
        href="/account/my-orders"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath.startsWith("/account/my-orders") && "font-semibold"
        )}
      >
        My orders
      </LocalizedLink>
      <LocalizedLink
        href="/account/wishlist"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath.startsWith("/account/wishlist") && "font-semibold"
        )}
      >
        Wishlist
      </LocalizedLink>
      <LocalizedLink
        href="/account/invoices"
        className={twJoin(
          "inline-flex items-start py-4 max-md:whitespace-nowrap",
          currentPath.startsWith("/account/invoices") && "font-semibold"
        )}
      >
        Invoices
      </LocalizedLink>
    </nav>
  )
}
