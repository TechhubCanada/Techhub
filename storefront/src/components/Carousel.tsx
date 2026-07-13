"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { Icon } from "@/components/Icon"
import { IconCircle } from "@/components/IconCircle"
import { Layout, LayoutColumn } from "@/components/Layout"

export type CarouselProps = {
  heading?: React.ReactNode
  button?: React.ReactNode
  arrows?: boolean
  autoScroll?: boolean
  autoScrollOnHover?: boolean
  autoScrollIntervalMs?: number
} & React.ComponentPropsWithRef<"div">

export const Carousel: React.FC<CarouselProps> = ({
  heading,
  button,
  arrows = true,
  autoScroll = false,
  autoScrollOnHover = false,
  autoScrollIntervalMs = 2800,
  children,
  className,
  ...rest
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    skipSnaps: true,
    active: true,
    loop: autoScroll,
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
  const autoScrollTimer = React.useRef<number | null>(null)
  const isFocusPaused = React.useRef(false)
  const isPointerPaused = React.useRef(false)

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollTimer.current !== null) {
      window.clearInterval(autoScrollTimer.current)
      autoScrollTimer.current = null
    }
  }, [])
  const advanceAutoScroll = React.useCallback(() => {
    if (!emblaApi) return

    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext()
    } else {
      emblaApi.scrollTo(0)
    }
  }, [emblaApi])
  const startAutoScroll = React.useCallback(() => {
    if (
      (!autoScroll && !autoScrollOnHover) ||
      !emblaApi ||
      isFocusPaused.current ||
      isPointerPaused.current ||
      autoScrollTimer.current !== null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    autoScrollTimer.current = window.setInterval(
      advanceAutoScroll,
      autoScrollIntervalMs
    )
  }, [
    advanceAutoScroll,
    autoScroll,
    autoScrollIntervalMs,
    autoScrollOnHover,
    emblaApi,
  ])
  const handleMouseEnter = React.useCallback(() => {
    if (autoScroll) {
      isPointerPaused.current = true
      stopAutoScroll()
      return
    }

    startAutoScroll()
  }, [autoScroll, startAutoScroll, stopAutoScroll])
  const handleMouseLeave = React.useCallback(() => {
    if (autoScroll) {
      isPointerPaused.current = false
      startAutoScroll()
      return
    }

    stopAutoScroll()
  }, [autoScroll, startAutoScroll, stopAutoScroll])
  const handleFocusCapture = React.useCallback(() => {
    isFocusPaused.current = true
    stopAutoScroll()
  }, [stopAutoScroll])
  const handleBlurCapture = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return
      }

      isFocusPaused.current = false

      if (autoScroll) {
        startAutoScroll()
      }
    },
    [autoScroll, startAutoScroll]
  )
  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  React.useEffect(() => {
    if (!autoScroll) return

    startAutoScroll()

    return stopAutoScroll
  }, [autoScroll, startAutoScroll, stopAutoScroll])

  React.useEffect(() => stopAutoScroll, [stopAutoScroll])

  return (
    <div {...rest} className={twMerge("overflow-hidden", className)}>
      <Layout>
        <LayoutColumn className="relative">
          <div className="mb-8 md:mb-15 flex max-sm:flex-col justify-between sm:items-center gap-x-10 gap-y-6">
            {heading}
            {(arrows || button) && (
              <div className="flex md:gap-6 shrink-0">
                {button}
                {arrows && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={scrollPrev}
                      disabled={prevBtnDisabled}
                      className={twJoin(
                        "max-md:hidden transition-opacity",
                        prevBtnDisabled && "opacity-50"
                      )}
                      aria-label="Previous"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-left"
                          className="w-6 h-6 text-black"
                        />
                      </IconCircle>
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      disabled={nextBtnDisabled}
                      className={twJoin(
                        "max-md:hidden transition-opacity",
                        nextBtnDisabled && "opacity-50"
                      )}
                      aria-label="Next"
                    >
                      <IconCircle>
                        <Icon
                          name="arrow-right"
                          className="w-6 h-6 text-black"
                        />
                      </IconCircle>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            ref={emblaRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocusCapture={handleFocusCapture}
            onBlurCapture={handleBlurCapture}
            className="cursor-grab active:cursor-grabbing"
            aria-roledescription={
              autoScroll
                ? "auto-advancing carousel"
                : autoScrollOnHover
                  ? "hovering carousel"
                  : undefined
            }
          >
            <div className="flex touch-pan-y gap-4 md:gap-10">{children}</div>
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
