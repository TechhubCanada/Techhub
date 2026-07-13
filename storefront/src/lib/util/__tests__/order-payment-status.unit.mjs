import assert from "node:assert/strict"

import { getOrderPaymentStatusSummary } from "../order-payment-status.ts"

const providerLabels = {
  pp_square_square: { title: "Credit card" },
}

const baseOrder = {
  currency_code: "cad",
  payment_status: "captured",
  summary: {
    refunded_total: 0,
  },
  payment_collections: [
    {
      payments: [
        {
          provider_id: "pp_square_square",
          amount: 149.99,
          captured_amount: 149.99,
          created_at: "2026-06-01T12:00:00.000Z",
          captured_at: "2026-06-01T12:05:00.000Z",
        },
      ],
    },
  ],
}

assert.deepEqual(
  getOrderPaymentStatusSummary(baseOrder, providerLabels),
  {
    label: "Paid",
    providerLabel: "Credit card",
    paidAmount: 149.99,
    refundedAmount: 0,
    latestPaidAt: "2026-06-01T12:05:00.000Z",
    latestRefundedAt: null,
    isRefunded: false,
    isPartiallyRefunded: false,
  }
)

assert.deepEqual(
  getOrderPaymentStatusSummary(
    {
      ...baseOrder,
      payment_status: "refunded",
      summary: {
        refunded_total: 149.99,
      },
      payment_collections: [
        {
          payments: [
            {
              ...baseOrder.payment_collections[0].payments[0],
              refunded_amount: 149.99,
              refunds: [
                {
                  amount: 149.99,
                  created_at: "2026-06-03T16:15:00.000Z",
                },
              ],
            },
          ],
        },
      ],
    },
    providerLabels
  ),
  {
    label: "Refunded",
    providerLabel: "Credit card",
    paidAmount: 149.99,
    refundedAmount: 149.99,
    latestPaidAt: "2026-06-01T12:05:00.000Z",
    latestRefundedAt: "2026-06-03T16:15:00.000Z",
    isRefunded: true,
    isPartiallyRefunded: false,
  }
)

assert.deepEqual(
  getOrderPaymentStatusSummary(
    {
      ...baseOrder,
      payment_status: "refunded",
      summary: {
        refunded_total: 0,
      },
    },
    providerLabels
  ),
  {
    label: "Refunded",
    providerLabel: "Credit card",
    paidAmount: 149.99,
    refundedAmount: 0,
    latestPaidAt: "2026-06-01T12:05:00.000Z",
    latestRefundedAt: null,
    isRefunded: true,
    isPartiallyRefunded: false,
  }
)

assert.deepEqual(
  getOrderPaymentStatusSummary(
    {
      ...baseOrder,
      payment_status: "partially_refunded",
      summary: {
        refunded_total: 49.99,
      },
    },
    providerLabels
  ),
  {
    label: "Partially refunded",
    providerLabel: "Credit card",
    paidAmount: 149.99,
    refundedAmount: 49.99,
    latestPaidAt: "2026-06-01T12:05:00.000Z",
    latestRefundedAt: null,
    isRefunded: false,
    isPartiallyRefunded: true,
  }
)

assert.deepEqual(
  getOrderPaymentStatusSummary({
    currency_code: "cad",
    payment_status: "refunded",
    summary: {
      refunded_total: 149.99,
    },
    payment_collections: [],
  }),
  {
    label: "Refunded",
    providerLabel: null,
    paidAmount: 0,
    refundedAmount: 149.99,
    latestPaidAt: null,
    latestRefundedAt: null,
    isRefunded: true,
    isPartiallyRefunded: false,
  }
)
