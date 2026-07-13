"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

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

  const activeBrand = brands[activeIndex]

  return (
    <div
      className="relative h-16 overflow-hidden md:h-20"
      aria-label={`We carry ${activeBrand}.`}
      aria-live="polite"
    >
      <div className="absolute inset-0 flex items-center">
        <span className="text-2xl font-medium md:text-4xl">We carry </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeBrand}
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(12px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-2xl font-medium text-white md:text-4xl"
          >
            {activeBrand}
          </motion.span>
        </AnimatePresence>
        <span className="text-2xl font-medium md:text-4xl">.</span>
      </div>
    </div>
  )
}
