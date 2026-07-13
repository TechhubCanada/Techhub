"use server"

import { sdk } from "@lib/config"

export type MarketplaceAccount = {
  id: string
  name: string
  platform: string
  description?: string | null
  url: string
  cta_label: string
  sort_order: number
}

export type MarketplaceAccountsResponse = {
  marketplace_accounts: MarketplaceAccount[]
}

export const listMarketplaceAccounts = async () => {
  return sdk.client.fetch<MarketplaceAccountsResponse>(
    "/store/marketplace-accounts",
    {
      next: { tags: ["marketplace-accounts"] },
      cache: "force-cache",
    }
  )
}
