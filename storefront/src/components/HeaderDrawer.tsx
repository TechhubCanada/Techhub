"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Drawer } from "@/components/Drawer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { RegionSwitcher } from "@/components/RegionSwitcher"
import { SearchField } from "@/components/SearchField"
import { BrandLogo } from "@/components/BrandLogo"
import { useSearchParams } from "next/navigation"

const navLinks = [
  { href: "/store", label: "Shop" },
  { href: "/inquiry", label: "Inquiry" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/about", label: "About" },
]

export const HeaderDrawer: React.FC<{
  countryOptions: {
    country: string | undefined
    region: string
    label: string | undefined
  }[]
}> = ({ countryOptions }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("query")

  React.useEffect(() => {
    if (searchQuery) setIsMenuOpen(false)
  }, [searchQuery])

  return (
    <>
      <Button
        variant="ghost"
        className="min-h-11 min-w-11 p-2.5 max-md:text-white group-data-[light=true]:md:text-white"
        onPress={() => setIsMenuOpen(true)}
        aria-label="Open menu"
      >
        <Icon name="menu" className="w-6 h-6" wrapperClassName="w-6 h-6" />
      </Button>
      <Drawer
        animateFrom="left"
        isOpen={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        className="w-[85vw] max-w-90 rounded-none !p-0"
      >
        {({ close }) => (
          <>
            <div className="flex h-full flex-col overflow-hidden bg-black text-white">
              <div className="flex min-h-18 w-full items-center justify-between gap-4 border-b border-white/20 px-5 py-3">
                <LocalizedLink
                  href="/"
                  className="min-w-0"
                  aria-label="TechHub home"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BrandLogo
                    markClassName="size-9 border-white/60"
                    textClassName="text-sm"
                  />
                </LocalizedLink>
                <button
                  className="flex min-h-11 min-w-11 items-center justify-center"
                  onClick={close}
                  aria-label="Close menu"
                >
                  <Icon name="close" className="w-5" />
                </button>
              </div>
              <div className="border-b border-white/20 px-5 py-4">
                <div className="flex min-h-13 items-center border-b border-white/40 px-1">
                  <SearchField
                    countryOptions={countryOptions}
                    isInputAlwaysShown
                  />
                </div>
              </div>
              <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-2">
                {navLinks.map(({ href, label }) => (
                  <LocalizedLink
                    key={href}
                    href={href}
                    className="group flex min-h-15 items-center border-b border-white/15 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{label}</span>
                    <Icon
                      name="chevron-right"
                      className="ml-auto w-4 text-white/45 transition-transform group-hover:translate-x-0.5"
                    />
                  </LocalizedLink>
                ))}
              </nav>
              <div className="border-t border-white/20 px-5 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))] pt-4">
                <LocalizedLink
                  href="/account"
                  className="mb-3 flex min-h-11 items-center gap-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon name="user" className="w-4" />
                  Account
                </LocalizedLink>
                <RegionSwitcher
                  countryOptions={countryOptions}
                  className="w-full"
                  selectButtonClassName="min-h-11 w-auto gap-2 p-0 text-sm"
                  selectIconClassName="text-current w-6 h-6"
                />
              </div>
            </div>
          </>
        )}
      </Drawer>
    </>
  )
}
