"use client"

export const COOKIE_CONSENT_STORAGE_KEY = "techhub_cookie_consent_v1"
export const COOKIE_CONSENT_COOKIE_NAME = "techhub_cookie_consent"

export type CookieConsentCategory =
  "essential" | "preferences" | "analytics" | "marketing"

export type CookieConsentPreferences = Record<CookieConsentCategory, boolean>

export type CookieConsentRecord = {
  preferences: CookieConsentPreferences
  savedAt: string
  source: "accept-all" | "reject-optional" | "custom" | "auto-close"
}

export const cookieConsentCategories: {
  id: CookieConsentCategory
  title: string
  description: string
  required?: boolean
}[] = [
  {
    id: "essential",
    title: "Essential",
    description:
      "Required for cart, checkout, security, account access, region selection, and consent storage.",
    required: true,
  },
  {
    id: "preferences",
    title: "Preferences",
    description:
      "Remember choices such as display preferences and returning visitor settings.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Help us understand how visitors use the site so we can improve product discovery and checkout.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "Support measuring campaigns or showing more relevant offers when enabled.",
  },
]

export const essentialOnlyPreferences = (): CookieConsentPreferences => ({
  essential: true,
  preferences: false,
  analytics: false,
  marketing: false,
})

export const allCookiePreferences = (): CookieConsentPreferences => ({
  essential: true,
  preferences: true,
  analytics: true,
  marketing: true,
})

const isConsentRecord = (value: unknown): value is CookieConsentRecord => {
  if (!value || typeof value !== "object") {
    return false
  }

  const record = value as Partial<CookieConsentRecord>
  const preferences = record.preferences

  return Boolean(
    preferences &&
    preferences.essential === true &&
    typeof preferences.preferences === "boolean" &&
    typeof preferences.analytics === "boolean" &&
    typeof preferences.marketing === "boolean" &&
    typeof record.savedAt === "string"
  )
}

export const readCookieConsent = (): CookieConsentRecord | null => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored) as unknown
    return isConsentRecord(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const writeCookieConsent = (
  preferences: CookieConsentPreferences,
  source: CookieConsentRecord["source"]
): CookieConsentRecord => {
  const record: CookieConsentRecord = {
    preferences: {
      ...preferences,
      essential: true,
    },
    savedAt: new Date().toISOString(),
    source,
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(record)
    )

    document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(record.preferences)
    )}; Max-Age=31536000; Path=/; SameSite=Lax`

    window.dispatchEvent(
      new CustomEvent("techhub-cookie-consent-updated", { detail: record })
    )
  }

  return record
}
