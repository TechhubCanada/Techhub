import { HttpTypes } from "@medusajs/types"

export type OrderPaymentStatusSummary = {
  label: string
  providerLabel: string | null
  paidAmount: number
  refundedAmount: number
  latestPaidAt: string | Date | null
  latestRefundedAt: string | Date | null
  isRefunded: boolean
  isPartiallyRefunded: boolean
}

type PaymentWithRefunds = NonNullable<
  NonNullable<HttpTypes.StoreOrder["payment_collections"]>[number]["payments"]
>[number]

type RefundRecord = {
  amount?: unknown
  created_at?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null
}

const getNumericValue = (value: unknown): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

const getTimestamp = (value: unknown): string | Date | null => {
  if (typeof value === "string" || value instanceof Date) {
    return value
  }

  return null
}

const getLatestTimestamp = (
  current: string | Date | null,
  candidate: string | Date | null
) => {
  if (!candidate) {
    return current
  }

  if (!current) {
    return candidate
  }

  return new Date(candidate).getTime() > new Date(current).getTime()
    ? candidate
    : current
}

const getRefunds = (payment: PaymentWithRefunds): RefundRecord[] => {
  return Array.isArray(payment.refunds)
    ? (payment.refunds as unknown[]).filter(isRecord)
    : []
}

const getPaymentRefundedAmount = (payment: PaymentWithRefunds) => {
  const explicitRefundedAmount = getNumericValue(payment.refunded_amount)

  if (explicitRefundedAmount > 0) {
    return explicitRefundedAmount
  }

  return getRefunds(payment).reduce(
    (total, refund) => total + getNumericValue(refund.amount),
    0
  )
}

export const getOrderPaymentStatusSummary = (
  order: HttpTypes.StoreOrder,
  providerLabels: Record<string, { title?: string }> = {}
): OrderPaymentStatusSummary => {
  const payments =
    order.payment_collections?.flatMap(
      (collection) => collection.payments ?? []
    ) ?? []
  const paidAmount = payments.reduce(
    (total, payment) =>
      total +
      getNumericValue(payment.captured_amount) +
      (payment.captured_amount ? 0 : getNumericValue(payment.amount)),
    0
  )
  const collectionRefundedAmount = order.payment_collections?.reduce(
    (total, collection) => total + getNumericValue(collection.refunded_amount),
    0
  )
  const paymentRefundedAmount = payments.reduce(
    (total, payment) => total + getPaymentRefundedAmount(payment),
    0
  )
  const refundedAmount = Math.max(
    getNumericValue(order.summary?.refunded_total),
    collectionRefundedAmount ?? 0,
    paymentRefundedAmount
  )
  const firstPayment = payments[0]
  const providerLabel = firstPayment
    ? providerLabels[firstPayment.provider_id]?.title || firstPayment.provider_id
    : null
  const latestPaidAt = payments.reduce<string | Date | null>(
    (latest, payment) => {
      const paymentTimestamp =
        getTimestamp(payment.captured_at) ?? getTimestamp(payment.created_at)

      return getLatestTimestamp(latest, paymentTimestamp)
    },
    null
  )
  const latestRefundedAt = payments.reduce<string | Date | null>(
    (latest, payment) => {
      return getRefunds(payment).reduce(
        (refundLatest, refund) =>
          getLatestTimestamp(refundLatest, getTimestamp(refund.created_at)),
        latest
      )
    },
    null
  )

  const paymentStatus = String(order.payment_status ?? "")
  const isFullyRefundedByAmount =
    refundedAmount > 0 && paidAmount > 0 && refundedAmount >= paidAmount
  const isRefunded =
    paymentStatus === "refunded" ||
    isFullyRefundedByAmount ||
    (refundedAmount > 0 && paymentStatus !== "partially_refunded")
  const isPartiallyRefunded =
    !isRefunded &&
    (paymentStatus === "partially_refunded" ||
      (refundedAmount > 0 && paidAmount > 0 && refundedAmount < paidAmount))

  if (!payments.length && !isRefunded && !isPartiallyRefunded) {
    return {
      label: "No payment information available",
      providerLabel,
      paidAmount,
      refundedAmount,
      latestPaidAt,
      latestRefundedAt,
      isRefunded: false,
      isPartiallyRefunded: false,
    }
  }

  if (isPartiallyRefunded && !isFullyRefundedByAmount) {
    return {
      label: "Partially refunded",
      providerLabel,
      paidAmount,
      refundedAmount,
      latestPaidAt,
      latestRefundedAt,
      isRefunded: false,
      isPartiallyRefunded: true,
    }
  }

  if (isRefunded) {
    return {
      label: "Refunded",
      providerLabel,
      paidAmount,
      refundedAmount,
      latestPaidAt,
      latestRefundedAt,
      isRefunded: true,
      isPartiallyRefunded: false,
    }
  }

  return {
    label: paymentStatus === "authorized" ? "Authorized" : "Paid",
    providerLabel,
    paidAmount,
    refundedAmount,
    latestPaidAt,
    latestRefundedAt,
    isRefunded: false,
    isPartiallyRefunded: false,
  }
}
