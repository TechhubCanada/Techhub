import { twMerge } from "tailwind-merge"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <span
      className={twMerge(
        "inline-flex h-7 items-center rounded-xs border border-grayscale-200 bg-grayscale-50 px-2 text-xs font-medium text-grayscale-600",
        className
      )}
    >
      Test mode
    </span>
  )
}

export default PaymentTest
