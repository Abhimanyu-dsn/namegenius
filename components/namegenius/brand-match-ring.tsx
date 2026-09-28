"use client"

import { useEffect, useId, useState } from "react"

import { cn } from "@/lib/utils"

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const DURATION_MS = 1400

export function BrandMatchRing({
  score,
  size = "md",
}: {
  score: number
  size?: "sm" | "md"
}) {
  const gradientId = useId()
  const target = Math.max(0, Math.min(100, score))
  const [animation, setAnimation] = useState({ progress: 0, pulse: 1 })

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    let frameId = 0
    let start: number | null = null

    function tick(now: number) {
      if (reduceMotion) {
        setAnimation({ progress: target, pulse: 1 })
        return
      }

      start ??= now
      const elapsed = now - start
      const t = Math.min(elapsed / DURATION_MS, 1)
      const eased = 1 - Math.pow(1 - t, 3)

      setAnimation({
        progress: target * eased,
        pulse: 1 + Math.sin(elapsed / 166) * 0.05 * (1 - t),
      })

      if (t < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setAnimation({ progress: target, pulse: 1 })
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [target])

  const { progress, pulse } = animation
  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <div
      className={cn(
        "relative shrink-0",
        size === "sm" ? "size-16 sm:size-20" : "size-24 sm:size-28"
      )}
      role="img"
      aria-label={`Brand match ${target}%`}
    >
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${pulse})` }}
        aria-hidden
      >
        <svg
          className="absolute inset-0 size-full -rotate-90"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 200 200"
          style={{ transform: `rotate(${progress * 3.6}deg)` }}
        >
          <circle cx="100" cy="20" r="8" fill="#3b82f6" />
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span
          className={cn(
            "font-sans font-black leading-none tabular-nums",
            size === "sm" ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          )}
        >
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}
