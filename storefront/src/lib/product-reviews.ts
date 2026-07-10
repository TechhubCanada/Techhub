import { z } from "zod"

export type ProductReview = {
  id: string
  product_id: string
  rating: number
  title?: string | null
  content: string
  customer_name?: string | null
  verified_purchase: boolean
  status: "approved"
  created_at?: string | Date | null
  published_at?: string | Date | null
}

export type ProductReviewSummary = {
  average_rating: number
  review_count: number
}

export type ProductReviewsResponse = {
  reviews: ProductReview[]
  count: number
  limit: number
  offset: number
  summary: ProductReviewSummary
}

export const submitProductReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().trim().max(120).optional(),
  content: z
    .string()
    .trim()
    .min(10, "Write at least 10 characters")
    .max(4000),
})

export type SubmitProductReviewInput = z.infer<
  typeof submitProductReviewSchema
>
