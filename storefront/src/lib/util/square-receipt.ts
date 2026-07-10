type PaymentDataWithSquareReceipt = {
  payment?: {
    receipt_url?: unknown
    receiptUrl?: unknown
  }
  receipt_url?: unknown
  receiptUrl?: unknown
}

type OrderWithPaymentCollections = {
  payment_collections?: Array<{
    payments?: Array<{
      data?: unknown
    }> | null
  }> | null
}

const isHttpUrl = (value: unknown): value is string =>
  typeof value === "string" && /^https?:\/\//.test(value)

const isCustomerFacingReceiptUrl = (value: unknown): value is string => {
  if (!isHttpUrl(value)) {
    return false
  }

  try {
    const { hostname } = new URL(value)

    return !hostname.includes("squareupsandbox.com")
  } catch {
    return false
  }
}

export const getSquareReceiptUrl = (
  order: OrderWithPaymentCollections
): string | null => {
  for (const collection of order.payment_collections ?? []) {
    for (const payment of collection.payments ?? []) {
      const data = payment.data as PaymentDataWithSquareReceipt | null
      const receiptUrl =
        data?.payment?.receipt_url ||
        data?.payment?.receiptUrl ||
        data?.receipt_url ||
        data?.receiptUrl

      if (isCustomerFacingReceiptUrl(receiptUrl)) {
        return receiptUrl
      }
    }
  }

  return null
}
