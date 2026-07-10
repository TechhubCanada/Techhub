"use server"

import { revalidateTag } from "next/cache"
import { z } from "zod"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"
import type {
  ProductReviewsResponse,
  SubmitProductReviewInput,
} from "@lib/product-reviews"

export const getProductReviews = async (
  productId: string
): Promise<ProductReviewsResponse> => {
  return sdk.client.fetch<ProductReviewsResponse>(
    `/store/products/${productId}/reviews`,
    {
      query: {
        limit: 20,
        offset: 0,
      },
      cache: "no-store",
      next: { tags: [`product-reviews-${productId}`] },
    }
  )
}

export const submitProductReview = async (
  productId: string,
  input: SubmitProductReviewInput
): Promise<{ success: true } | { success: false; message: string }> => {
  const submitProductReviewSchema = z.object({
    rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
    title: z.string().trim().max(120).optional(),
    content: z
      .string()
      .trim()
      .min(10, "Write at least 10 characters")
      .max(4000),
  })
  const parsed = submitProductReviewSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message || "Check the review form and try again.",
    }
  }

  try {
    await sdk.client.fetch(`/store/products/${productId}/reviews`, {
      method: "POST",
      body: parsed.data,
      headers: await getAuthHeaders(),
    })

    revalidateTag(`product-reviews-${productId}`, { expire: 0 })

    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Sign in before submitting a review."

    return { success: false, message }
  }
}
