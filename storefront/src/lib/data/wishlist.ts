"use server"

import { revalidateTag } from "next/cache"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import {
  getAuthHeaders,
  getWishlistId,
  removeWishlistId,
  setWishlistId,
} from "@lib/data/cookies"

type WishlistItem = {
  id: string
  product_id?: string
  product_variant_id?: string
  product_variant?: {
    id?: string
    title?: string
    product?: {
      id?: string
      title?: string
      handle?: string
      thumbnail?: string | null
    }
  }
}

export type Wishlist = {
  id: string
  name?: string
  items?: WishlistItem[]
}

type WishlistResponse = {
  wishlist?: Wishlist
  data?: Wishlist
}

type WishlistsResponse = {
  wishlists?: Wishlist[]
  data?: Wishlist[]
}

type WishlistItemsResponse = {
  items?: WishlistItem[]
  wishlist_items?: WishlistItem[]
  data?: WishlistItem[]
}

const getWishlistFromResponse = (response: WishlistResponse) =>
  response.wishlist ?? response.data

const getWishlistsFromResponse = (response: WishlistsResponse) =>
  response.wishlists ?? response.data ?? []

const getItemsFromResponse = (response: WishlistItemsResponse) =>
  response.items ?? response.wishlist_items ?? response.data ?? []

export async function listWishlists() {
  return sdk.client
    .fetch<WishlistsResponse>("/store/wishlists", {
      next: { tags: ["wishlist"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })
    .then(getWishlistsFromResponse)
    .catch(() => [])
}

export async function retrieveWishlist(id?: string | null) {
  const wishlistId = id ?? (await getWishlistId())

  if (!wishlistId) {
    return null
  }

  return sdk.client
    .fetch<WishlistResponse>(`/store/wishlists/${wishlistId}`, {
      next: { tags: ["wishlist"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })
    .then(getWishlistFromResponse)
    .catch(() => null)
}

export async function retrieveWishlistItems(id?: string | null) {
  const wishlistId = id ?? (await getWishlistId())

  if (!wishlistId) {
    return []
  }

  return sdk.client
    .fetch<WishlistItemsResponse>(`/store/wishlists/${wishlistId}/items`, {
      next: { tags: ["wishlist"] },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })
    .then(getItemsFromResponse)
    .catch(() => [])
}

export async function getOrCreateWishlist() {
  const existingWishlist = await retrieveWishlist()

  if (existingWishlist) {
    return existingWishlist
  }

  const [customerWishlist] = await listWishlists()

  if (customerWishlist?.id) {
    await setWishlistId(customerWishlist.id)
    return customerWishlist
  }

  return sdk.client
    .fetch<WishlistResponse>("/store/wishlists", {
      method: "POST",
      body: { name: "Favorites" },
      headers: { ...(await getAuthHeaders()) },
    })
    .then(async (response) => {
      const wishlist = getWishlistFromResponse(response)

      if (!wishlist?.id) {
        throw new Error("Wishlist response did not include an ID")
      }

      await setWishlistId(wishlist.id)
      revalidateTag("wishlist", { expire: 0 })
      return wishlist
    })
    .catch(medusaError)
}

export async function addVariantToWishlist(variantId: unknown) {
  if (typeof variantId !== "string") {
    throw new Error("Missing variant ID when adding to wishlist")
  }

  const wishlist = await getOrCreateWishlist()

  await sdk.client
    .fetch(`/store/wishlists/${wishlist.id}/add-item`, {
      method: "POST",
      body: { product_variant_id: variantId },
      headers: { ...(await getAuthHeaders()) },
    })
    .then(() => {
      revalidateTag("wishlist", { expire: 0 })
    })
    .catch(medusaError)
}

export async function removeWishlistItem(itemId: unknown) {
  if (typeof itemId !== "string") {
    throw new Error("Missing wishlist item ID")
  }

  let wishlistId = await getWishlistId()

  if (!wishlistId) {
    const [wishlist] = await listWishlists()
    wishlistId = wishlist?.id
  }

  if (!wishlistId) {
    throw new Error("Missing wishlist ID")
  }

  await sdk.client
    .fetch(`/store/wishlists/${wishlistId}/items/${itemId}`, {
      method: "DELETE",
      headers: { ...(await getAuthHeaders()) },
    })
    .then(() => {
      revalidateTag("wishlist", { expire: 0 })
    })
    .catch(medusaError)
}

export async function transferWishlist() {
  const wishlistId = await getWishlistId()

  if (!wishlistId) {
    return
  }

  await sdk.client
    .fetch(`/store/wishlists/${wishlistId}/transfer`, {
      method: "POST",
      headers: { ...(await getAuthHeaders()) },
    })
    .then(async () => {
      await removeWishlistId()
      revalidateTag("wishlist", { expire: 0 })
    })
    .catch(() => undefined)
}
