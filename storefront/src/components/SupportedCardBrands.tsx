import { twMerge } from "tailwind-merge"

const supportedCards = [
  {
    brand: "Visa",
    className: "bg-[#1434cb] text-white",
    mark: "VISA",
  },
  {
    brand: "Mastercard",
    className: "bg-grayscale-900 text-white",
    mark: "MC",
  },
  {
    brand: "American Express",
    className: "bg-[#2e77bb] text-white",
    mark: "AMEX",
  },
  {
    brand: "Discover",
    className: "bg-white text-grayscale-900",
    mark: "DISC",
  },
]

const supportedWallets = [
  {
    label: "Apple Pay",
    className: "bg-black text-white",
    icon: (
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="relative h-3.5 w-3">
          <span className="absolute left-1 top-0 h-1.5 w-1.5 rounded-full bg-current" />
          <span className="absolute bottom-0 left-0 h-3 w-3 rounded-[45%_45%_50%_50%] bg-current" />
        </span>
        <span className="text-[0.5rem] font-semibold leading-none">Pay</span>
      </span>
    ),
  },
  {
    label: "Google Pay",
    className: "bg-white text-grayscale-900",
    icon: (
      <span className="flex items-center gap-1" aria-hidden="true">
        <span className="grid size-3 grid-cols-2 overflow-hidden rounded-full">
          <span className="bg-[#4285f4]" />
          <span className="bg-[#ea4335]" />
          <span className="bg-[#34a853]" />
          <span className="bg-[#fbbc05]" />
        </span>
        <span className="text-[0.5rem] font-semibold leading-none">Pay</span>
      </span>
    ),
  },
]

type SupportedCardBrandsProps = {
  className?: string
}

export const SupportedCardBrands = ({
  className,
}: SupportedCardBrandsProps) => {
  return (
    <div className={twMerge("flex flex-wrap items-center gap-2", className)}>
      <p className="mr-1 text-xs font-medium uppercase tracking-wide text-grayscale-500">
        Supported payments
      </p>
      <div className="flex flex-wrap gap-1.5">
        {supportedCards.map((card) => (
          <span
            key={card.brand}
            aria-label={card.brand}
            className="group block h-7 w-11 [perspective:700px]"
          >
            <span className="relative block h-full rounded-[0.3rem] transition-transform duration-300 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
              <div
                className={twMerge(
                  "absolute inset-0 overflow-hidden rounded-[0.3rem] border border-grayscale-200 shadow-[0_4px_10px_rgba(15,23,42,0.12)] [backface-visibility:hidden]",
                  card.className
                )}
              >
                <span className="absolute left-1.5 top-1.5 h-2 w-2.5 rounded-[0.125rem] border border-current/55 bg-current/15" />
                <span className="absolute left-1.5 right-1.5 top-[0.95rem] h-px bg-current/30" />
                <span className="absolute bottom-1.5 left-1.5 h-px w-4 bg-current/35" />
                <span className="absolute bottom-1.5 right-1.5 text-[0.45rem] font-bold leading-none tracking-tight">
                  {card.mark}
                </span>
                {card.brand === "Mastercard" && (
                  <span className="absolute bottom-1 right-1.5 h-2.5 w-4">
                    <span className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-[#eb001b]" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-[#f79e1b] mix-blend-screen" />
                  </span>
                )}
                {card.brand === "Discover" && (
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#f58220] via-[#fdbb30] to-[#f58220]" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-[0.3rem] border border-grayscale-300 bg-grayscale-50 text-grayscale-700 shadow-[0_4px_10px_rgba(15,23,42,0.1)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span
                  className="relative size-3.5 rounded-full border border-grayscale-300"
                  aria-hidden="true"
                >
                  <span className="absolute left-[0.21875rem] top-[0.375rem] h-1 w-2 rotate-[-45deg] border-b border-l border-grayscale-700" />
                </span>
              </div>
            </span>
          </span>
        ))}
        {supportedWallets.map((wallet) => (
          <span
            key={wallet.label}
            aria-label={wallet.label}
            className={`inline-flex h-7 items-center rounded-[0.3rem] border border-grayscale-200 px-2.5 shadow-[0_4px_10px_rgba(15,23,42,0.12)] ${wallet.className}`}
          >
            {wallet.icon}
          </span>
        ))}
      </div>
    </div>
  )
}
