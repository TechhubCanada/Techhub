"use client"

import Lenis from "lenis"
import { useEffect, type ReactNode } from "react"

type SmoothScrollProps = {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.1,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.85,
    })

    document.documentElement.setAttribute("data-lenis", "true")

    return () => {
      document.documentElement.removeAttribute("data-lenis")
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
