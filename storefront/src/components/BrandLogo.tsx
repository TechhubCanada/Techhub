import * as React from "react"
import { twMerge } from "tailwind-merge"

type BrandLogoProps = {
  className?: string
  markClassName?: string
  textClassName?: string
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  markClassName,
  textClassName,
}) => {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-2.5 leading-none text-current",
        className
      )}
    >
      <span
        className={twMerge(
          "relative flex size-7 shrink-0 items-center justify-center rounded-[0.375rem] border border-current/80",
          markClassName
        )}
        aria-hidden="true"
      >
        <span className="absolute left-1.5 right-1.5 top-1.5 h-px bg-current/70" />
        <span className="absolute bottom-1.5 left-1.5 h-2 w-px bg-current/70" />
        <span className="absolute bottom-1.5 right-1.5 h-2 w-px bg-current/70" />
        <span className="text-[0.625rem] font-semibold tracking-normal">
          TH
        </span>
      </span>
      <span
        className={twMerge(
          "font-medium tracking-normal whitespace-nowrap",
          textClassName
        )}
      >
        TechHub
      </span>
    </span>
  )
}
