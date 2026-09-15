"use client"

import { cn } from "@/lib/utils"

export function ResultsShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col bg-landing-bg text-landing-fg",
        className
      )}
    >
      {children}
    </div>
  )
}
