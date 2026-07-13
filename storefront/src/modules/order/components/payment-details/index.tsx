import { HttpTypes } from "@medusajs/types"

import { paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { getOrderPaymentStatusSummary } from "@lib/util/order-payment-status"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const paymentStatus = getOrderPaymentStatusSummary(order, paymentInfoMap)

  if (!paymentStatus.providerLabel) {
    return (
      <p className="text-grayscale-500">No payment information available</p>
    )
  }

  const paidAt = paymentStatus.latestPaidAt
    ? new Date(paymentStatus.latestPaidAt).toLocaleString()
    : null
  const refundedAt = paymentStatus.latestRefundedAt
    ? new Date(paymentStatus.latestRefundedAt).toLocaleString()
    : null

  return (
    <div className="text-grayscale-500">
      <p>{paymentStatus.providerLabel}</p>
      <p className="mt-2 text-grayscale-900">{paymentStatus.label}</p>
      {paymentStatus.paidAmount > 0 && (
        <p>
          {convertToLocale({
            amount: paymentStatus.paidAmount,
            currency_code: order.currency_code,
          })}
          {paidAt ? ` paid at ${paidAt}` : " paid"}
        </p>
      )}
      {paymentStatus.refundedAmount > 0 && (
        <p>
          {convertToLocale({
            amount: paymentStatus.refundedAmount,
            currency_code: order.currency_code,
          })}
          {refundedAt ? ` refunded at ${refundedAt}` : " refunded"}
        </p>
      )}
    </div>
  )
}

export default PaymentDetails
