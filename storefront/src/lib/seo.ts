import type { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"

export const siteName = "TechHub"

export const defaultSeoKeywords = [
  "TechHub",
  "computers",
  "laptops",
  "desktops",
  "printers",
  "networking equipment",
  "computer parts",
  "accessories",
  "computer repair",
  "IT support",
  "business technology",
  "Markham",
  "Canada",
]

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "")

export const getSiteUrl = () => normalizeBaseUrl(getBaseURL())

export const getLocalizedPath = (countryCode: string, path = "") => {
  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : ""

  return `/${countryCode.toLowerCase()}${normalizedPath}`
}

export const getAbsoluteUrl = (path = "") =>
  new URL(path || "/", `${getSiteUrl()}/`).toString()

export const noIndexMetadata: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string | null
  type?: "website" | "article"
  publishedTime?: string | null
}

export const createPageMetadata = ({
  title,
  description,
  path,
  keywords = [],
  image,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata => {
  const imageUrl = image ? getAbsoluteUrl(image) : undefined

  return {
    title,
    description,
    keywords: [...defaultSeoKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName,
      locale: "en_CA",
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}
