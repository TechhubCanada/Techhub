"use client"

import * as React from "react"
import { Button } from "@/components/Button"
import {
  allCookiePreferences,
  CookieConsentPreferences,
  cookieConsentCategories,
  essentialOnlyPreferences,
  readCookieConsent,
  writeCookieConsent,
} from "@lib/cookie-consent"

export const CookiePreferencesForm = () => {
  const [preferences, setPreferences] =
    React.useState<CookieConsentPreferences>(essentialOnlyPreferences)
  const [savedMessage, setSavedMessage] = React.useState("")

  React.useEffect(() => {
    const stored = readCookieConsent()

    if (stored) {
      setPreferences(stored.preferences)
    }
  }, [])

  const save = (nextPreferences: CookieConsentPreferences) => {
    writeCookieConsent(nextPreferences, "custom")
    setPreferences(nextPreferences)
    setSavedMessage("Cookie preferences saved.")
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        {cookieConsentCategories.map((category) => (
          <label
            key={category.id}
            className="flex items-start justify-between gap-5 border border-grayscale-200 p-4"
          >
            <span>
              <span className="block text-sm font-medium text-black">
                {category.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-grayscale-600">
                {category.description}
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences[category.id]}
              disabled={category.required}
              onChange={(event) => {
                setPreferences((current) => ({
                  ...current,
                  [category.id]: event.currentTarget.checked,
                }))
              }}
              className="mt-1 size-4 accent-black disabled:opacity-50"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onPress={() => save(preferences)}>Save choices</Button>
        <Button
          variant="outline"
          onPress={() => save(essentialOnlyPreferences())}
        >
          Essential only
        </Button>
        <Button variant="ghost" onPress={() => save(allCookiePreferences())}>
          Accept all
        </Button>
      </div>

      {savedMessage && (
        <p className="text-sm text-grayscale-600" role="status">
          {savedMessage}
        </p>
      )}
    </div>
  )
}
