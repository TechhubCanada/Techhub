import { Metadata } from "next"
import { Layout, LayoutColumn } from "@/components/Layout"
import { CookiePreferencesForm } from "@/components/CookiePreferencesForm"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"

export const metadata: Metadata = {
  title: "Cookie Preferences",
  description: "Manage optional cookies for Tech Hub Canada.",
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

export default function CookiePreferencesPage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <h1 className="text-lg md:text-2xl mb-8 md:mb-12">
          Cookie Preferences
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-grayscale-600">
          Essential cookies are always on because they keep cart, checkout,
          security, and consent choices working. You can turn optional cookies
          on or off below.
        </p>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="mt-10"
      >
        <CookiePreferencesForm />
      </LayoutColumn>
    </Layout>
  )
}
