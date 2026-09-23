"use client"

import { cn } from "@/lib/utils"

export function BrandMatchRing({
  score,
  size = "md",
}: {
  score: number
  size?: "sm" | "md"
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      className={cn(
        "relative shrink-0",
        size === "sm" ? "size-16 sm:size-20" : "size-24 sm:size-28"
      )}
    >
      <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--results-accent-muted)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--results-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={cn(
            "font-sans font-black tabular-nums",
            size === "sm" ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
          )}
        >
          {score}%
        </span>
        <span
          className={cn(
            "mt-0.5 font-mono uppercase leading-tight tracking-[0.1em] text-landing-muted",
            "text-[11px]"
          )}
        >
          Brand
          <br />
          match
        </span>
      </div>
    </div>
  )
}
