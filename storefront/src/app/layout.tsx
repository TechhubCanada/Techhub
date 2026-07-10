import { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Mona_Sans } from "next/font/google"
import { getBaseURL } from "@lib/util/env"

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
  return (
    <html lang="en" data-mode="light" className="antialiased">
      <body className={`${monaSans.className}`}>
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
