"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useController } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/Button"
import { Form, InputField, getInputClassNames } from "@/components/Forms"
import { LocalizedLink } from "@/components/LocalizedLink"
import {
  submitProductReview,
} from "@lib/data/product-reviews"
import {
  ProductReviewsResponse,
  submitProductReviewSchema,
} from "@lib/product-reviews"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useCustomer } from "hooks/customer"

type ProductReviewsProps = {
  productId: string
  initialReviews: ProductReviewsResponse
}

const ReviewTextareaField: React.FC<{
  name: string
  placeholder: string
}> = ({ name, placeholder }) => {
  const { field, fieldState } = useController<{ __name__: string }, "__name__">(
    { name: name as "__name__" }
  )

  return (
    <div>
      <textarea
        {...field}
        id={name}
        placeholder={placeholder}
        rows={5}
        value={field.value ?? ""}
        aria-invalid={Boolean(fieldState.error)}
        className={`${getInputClassNames({})} min-h-32 resize-y py-4 placeholder:visible`}
      />
      {fieldState.error && (
        <div className="pt-2 text-red-900 text-small-regular">
          <span>{fieldState.error.message}</span>
        </div>
      )}
    </div>
  )
}

const formatReviewDate = (value?: string | Date | null) => {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

const ratingLabel = (rating: number) => `${rating} out of 5 stars`

const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number
  size?: "sm" | "lg"
}) => (
  <span
    aria-label={ratingLabel(rating)}
    className={size === "lg" ? "text-md tracking-normal" : "text-sm"}
  >
    {Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        aria-hidden="true"
        className={index < Math.round(rating) ? "text-black" : "text-grayscale-200"}
      >
        ★
      </span>
    ))}
  </span>
)

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  initialReviews,
}) => {
  const router = useRouter()
  const { data: customer, isLoading: isCustomerLoading } = useCustomer()
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const mutation = useMutation({
    mutationKey: ["product-review", productId],
    mutationFn: (values: z.infer<typeof submitProductReviewSchema>) =>
      submitProductReview(productId, values),
    onSuccess: (result) => {
      if (result.success) {
        setError(null)
        setMessage("Thanks. Your review is pending approval.")
        router.refresh()
        return
      }

      setMessage(null)
      setError(result.message)
    },
    onError: (reviewError) => {
      setMessage(null)
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Unable to submit your review."
      )
    },
  })

  const { reviews, summary } = initialReviews
  const averageRating = Number(summary.average_rating || 0)
  const reviewCount = summary.review_count

  return (
    <section className="border-t border-grayscale-200 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div>
          <p className="mb-3 text-xs uppercase text-grayscale-500">
            Customer reviews
          </p>
          <h2 className="mb-4 text-md md:text-xl">Reviews</h2>

          {reviewCount > 0 ? (
            <div className="flex items-center gap-3">
              <StarRating rating={averageRating} size="lg" />
              <p className="text-sm text-grayscale-600">
                {averageRating.toFixed(1)} from {reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-grayscale-600">
              No reviews yet. Be the first to review this product.
            </p>
          )}
        </div>

        <div className="grid gap-10">
          <div className="grid gap-5">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="border-b border-grayscale-200 pb-5 last:border-b-0 last:pb-0"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <StarRating rating={review.rating} />
                    <p className="text-sm font-medium">
                      {review.title || "Product review"}
                    </p>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-grayscale-700">
                    {review.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-grayscale-500">
                    <span>{review.customer_name || "Verified customer"}</span>
                    {review.verified_purchase && (
                      <span className="text-black">Verified purchase</span>
                    )}
                    {formatReviewDate(review.published_at || review.created_at) && (
                      <span>
                        {formatReviewDate(review.published_at || review.created_at)}
                      </span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-grayscale-200 p-5">
                <p className="text-sm text-grayscale-600">
                  Reviews will appear here after approval.
                </p>
              </div>
            )}
          </div>

          <div className="border border-grayscale-200 p-5">
            <h3 className="mb-4 text-base">Write a review</h3>
            {customer ? (
              <Form
                schema={submitProductReviewSchema}
                defaultValues={{ rating: 5, title: "", content: "" }}
                onSubmit={(values, form) => {
                  mutation.mutate(values, {
                    onSuccess: (result) => {
                      if (result.success) {
                        form.reset({ rating: 5, title: "", content: "" })
                      }
                    },
                  })
                }}
                formProps={{ className: "grid gap-6" }}
              >
                <InputField
                  name="rating"
                  type="number"
                  placeholder="Rating from 1 to 5"
                  inputProps={{ min: 1, max: 5, step: 1 }}
                />
                <InputField name="title" placeholder="Review title (optional)" />
                <ReviewTextareaField name="content" placeholder="Review" />

                {message && (
                  <p className="text-sm text-green-700" role="status">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-primary" role="alert">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="md"
                  isLoading={mutation.isPending}
                  loadingText="Submitting"
                  className="mt-2"
                >
                  Submit review
                </Button>
              </Form>
            ) : (
              <div className="grid gap-4">
                <p className="text-sm text-grayscale-600">
                  {isCustomerLoading
                    ? "Checking your account..."
                    : "Sign in to write a review."}
                </p>
                {!isCustomerLoading && (
                  <LocalizedLink
                    href="/auth/login"
                    variant="underline"
                    className="w-fit text-sm"
                  >
                    Sign in
                  </LocalizedLink>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default withReactQueryProvider(ProductReviews)
