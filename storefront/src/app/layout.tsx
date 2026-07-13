import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Mona_Sans } from "next/font/google"
import { getBaseURL } from "@lib/util/env"
import { getAbsoluteUrl, defaultSeoKeywords, siteName } from "@lib/seo"
import { storeBusinessInfo } from "@lib/business-info"

import "../styles/globals.css"
import "lenis/dist/lenis.css"
import React from "react"
import { WebMCPProvider } from "@lib/webmcp/WebMCPProvider"
import { SmoothScroll } from "@/components/SmoothScroll"
import { RealtimeProvider } from "@/components/RealtimeProvider"
import { CookieConsentBanner } from "@/components/CookieConsentBanner"
import { ReactQueryProvider } from "@lib/util/react-query"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "TechHub | Computers, Repairs & Business IT",
    template: "%s | TechHub",
  },
  description:
    "Shop computers, printers, networking equipment, parts, accessories, repairs, and business IT support from TechHub in Markham, Ontario.",
  keywords: defaultSeoKeywords,
  applicationName: siteName,
  creator: "TechHub",
  publisher: "Tech Hub Canada",
  category: "Technology retail and services",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_CA",
    title: "TechHub | Computers, Repairs & Business IT",
    description:
      "Shop computers, printers, networking equipment, parts, accessories, repairs, and business IT support from TechHub.",
    images: [
      {
        url: "/images/content/techhub-pc-hardware-hero.png",
        alt: "TechHub computer hardware",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechHub | Computers, Repairs & Business IT",
    description:
      "Shop computers, printers, networking equipment, parts, accessories, repairs, and business IT support from TechHub.",
    images: ["/images/content/techhub-pc-hardware-hero.png"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.svg",
  },
}

const monaSans = Mona_Sans({
  preload: true,
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: "variable",
  variable: "--font-mona-sans",
})

const shouldRenderSpeedInsights = process.env.NODE_ENV === "production"

export default function RootLayout(props: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ElectronicsStore",
        "@id": `${getAbsoluteUrl()}#organization`,
        name: "Tech Hub Canada",
        alternateName: siteName,
        url: getAbsoluteUrl(),
        logo: getAbsoluteUrl("/favicon.svg"),
        email: storeBusinessInfo.email.label,
        telephone: "+19055540641",
        address: {
          "@type": "PostalAddress",
          streetAddress: storeBusinessInfo.address.street,
          addressLocality: storeBusinessInfo.address.city,
          addressRegion: storeBusinessInfo.address.province,
          postalCode: storeBusinessInfo.address.postalCode,
          addressCountry: "CA",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${getAbsoluteUrl()}#website`,
        name: siteName,
        url: getAbsoluteUrl(),
        publisher: {
          "@id": `${getAbsoluteUrl()}#organization`,
        },
        inLanguage: "en-CA",
      },
    ],
  }

  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
        <ReactQueryProvider>
          <SmoothScroll>
            <main className="relative">{props.children}</main>
          </SmoothScroll>
          <RealtimeProvider />
          {shouldRenderSpeedInsights ? <SpeedInsights /> : null}
          <WebMCPProvider />
          <CookieConsentBanner />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
