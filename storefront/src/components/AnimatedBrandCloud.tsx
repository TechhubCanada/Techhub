"use client"

import * as React from "react"
import { motion } from "motion/react"

type AnimatedBrandCloudProps = {
  brands: readonly string[]
}

export const AnimatedBrandCloud: React.FC<AnimatedBrandCloudProps> = ({
  brands,
}) => {
  const [activeIndex, setActiveIndex] = React.useState(() =>
    brands.length > 0 ? Math.floor(Math.random() * brands.length) : 0
  )

  React.useEffect(() => {
    if (brands.length < 2) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex(() => Math.floor(Math.random() * brands.length))
    }, 2200)

    return () => window.clearInterval(intervalId)
  }, [brands.length])

  if (brands.length === 0) {
    return null
  }

  return (
    <div
      className="overflow-hidden"
      aria-label={`Carried brands: ${brands.join(", ")}.`}
      aria-live="polite"
    >
      <div className="flex flex-wrap gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4">
        {brands.map((brand, index) => {
          const isActive = index === activeIndex

          return (
            <motion.span
              key={brand}
              initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
              animate={{
                opacity: isActive ? 1 : 0.62,
                y: isActive ? 0 : 4,
                filter: isActive ? "blur(0px)" : "blur(1px)",
              }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block text-2xl font-medium text-white md:text-4xl"
            >
              {brand}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
