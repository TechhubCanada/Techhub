"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/Button"
import { Link } from "@/components/Link"
import {
  allCookiePreferences,
  CookieConsentPreferences,
  essentialOnlyPreferences,
  readCookieConsent,
  writeCookieConsent,
} from "@lib/cookie-consent"

const autoCloseSeconds = 45

export const CookieConsentBanner = () => {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const [secondsRemaining, setSecondsRemaining] =
    React.useState(autoCloseSeconds)

  React.useEffect(() => {
    setIsMounted(true)

    if (!readCookieConsent()) {
      setIsVisible(true)
    }
  }, [])

  React.useEffect(() => {
    if (!isVisible) {
      return
    }

    if (secondsRemaining <= 0) {
      writeCookieConsent(essentialOnlyPreferences(), "auto-close")
      setIsVisible(false)
      return
    }

    const timer = window.setTimeout(() => {
      setSecondsRemaining((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [isVisible, secondsRemaining])

  if (!isMounted || !isVisible) {
    return null
  }

  const countryCode = pathname.split("/").filter(Boolean)[0] || "ca"
  const progress = Math.max(
    0,
    Math.min(100, (secondsRemaining / autoCloseSeconds) * 100)
  )

  const savePreferences = (
    nextPreferences: CookieConsentPreferences,
    source: "accept-all" | "reject-optional" | "custom"
  ) => {
    writeCookieConsent(nextPreferences, source)
    setIsVisible(false)
  }

  return (
    <section
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 overflow-hidden rounded-sm border border-grayscale-200 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.18)] sm:inset-x-auto sm:right-6 sm:w-[32rem]"
    >
      <div
        className="h-1 bg-grayscale-100"
        aria-label={`Cookie notice closes in ${secondsRemaining} seconds`}
      >
        <div
          className="h-full bg-black transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid gap-5 px-4 py-5 sm:px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-grayscale-500">
            Cookies
          </p>
          <h2 className="mt-1 text-md font-medium text-black">
            We use cookies to keep TechHub working.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-grayscale-600">
            Essential cookies keep cart, checkout, account security, and saved
            choices working. Optional cookies stay off unless you accept them.
            Auto-closes in {secondsRemaining} seconds with essential cookies
            only.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            size="md"
            className="px-3 text-sm"
            onPress={() =>
              savePreferences(allCookiePreferences(), "accept-all")
            }
          >
            Accept all
          </Button>
          <Button
            size="md"
            variant="outline"
            className="px-3 text-sm"
            onPress={() =>
              savePreferences(essentialOnlyPreferences(), "reject-optional")
            }
          >
            Essential only
          </Button>
          <Link
            href={`/${countryCode}/cookie-preferences`}
            className="inline-flex h-12 items-center justify-center rounded-xs border border-grayscale-200 px-3 text-sm text-black transition-colors hover:border-black"
          >
            Manage
          </Link>
        </div>
      </div>
    </section>
  )
}
