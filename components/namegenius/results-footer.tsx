"use client"

import { RefreshCw } from "lucide-react"

export function ResultsFooter({
  onGenerateMore,
  isRefreshing = false,
}: {
  onGenerateMore: () => void
  isRefreshing?: boolean
}) {
  return (
    <footer className="flex flex-col gap-4 border-t border-landing-fg/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
      <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
        <p>A better name</p>
        <p className="mt-1">a brighter tomorrow.</p>
      </div>

      <button
        type="button"
        onClick={onGenerateMore}
        disabled={isRefreshing}
        className="inline-flex items-center gap-3 self-start font-mono text-xs uppercase tracking-[0.15em] text-landing-fg transition-opacity hover:opacity-80 disabled:opacity-40 sm:self-auto"
      >
        Generate 5 more
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-landing-fg">
          <RefreshCw
            className={isRefreshing ? "size-3.5 animate-spin" : "size-3.5"}
            strokeWidth={1.5}
          />
        </span>
      </button>
    </footer>
  )
}
