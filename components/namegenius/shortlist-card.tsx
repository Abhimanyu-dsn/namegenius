"use client"

import { X } from "lucide-react"

import { BrandMatchRing } from "./brand-match-ring"
import {
  formatKeywordLine,
  formatTldStatusLabel,
  getCardDisplayDomain,
  getTldStatusDotClass,
} from "@/lib/results-display"
import type { NameSuggestion } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function ShortlistCard({
  suggestion,
  onRemove,
}: {
  suggestion: NameSuggestion
  onRemove: () => void
}) {
  const display = getCardDisplayDomain(suggestion)

  return (
    <article
      className="flex h-full flex-col rounded-xl border border-landing-fg/25 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
          Saved name
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${display.domain} from shortlist`}
          className="text-landing-muted transition-colors hover:text-landing-fg"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="min-w-0">
        <h2 className="font-sans text-[clamp(1.25rem,3vw,1.75rem)] font-black uppercase leading-none tracking-tight">
          {display.slug}
          <span className="ml-2 font-mono text-sm font-normal text-landing-muted sm:text-base">
            {display.tld}
          </span>
        </h2>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted sm:text-xs">
          {formatKeywordLine(suggestion.matchContext)}
        </p>
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <ul className="min-w-0 flex-1 space-y-2">
          {suggestion.tldOptions.map((option) => (
            <li
              key={option.tld}
              className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.1em] sm:text-xs"
            >
              <span>{option.tld}</span>
              <span className="inline-flex items-center gap-2 text-landing-muted">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    getTldStatusDotClass(option.status)
                  )}
                  aria-hidden
                />
                {formatTldStatusLabel(option)}
              </span>
            </li>
          ))}
        </ul>
        <BrandMatchRing score={suggestion.brandMatch} size="sm" />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="mt-6 w-full rounded-full border border-landing-fg/40 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10 sm:text-xs"
      >
        Remove from shortlist
      </button>
    </article>
  )
}
