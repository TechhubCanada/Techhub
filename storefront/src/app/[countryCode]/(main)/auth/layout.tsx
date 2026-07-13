import type { Metadata } from "next"
import { noIndexMetadata } from "@lib/seo"

export const metadata: Metadata = {
  robots: noIndexMetadata,
}

export default function AuthLayout(props: { children: React.ReactNode }) {
  return props.children
}
