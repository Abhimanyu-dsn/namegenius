"use client"

import { X } from "lucide-react"

import type { NameSuggestion } from "@/lib/mock-data"
import {
  formatKeywordLine,
  formatTldStatusLabel,
  getCardDisplayDomain,
  getCompareAvatarClass,
  getTldStatusDotClass,
} from "@/lib/results-display"
import { cn } from "@/lib/utils"

import { BrandMatchRing } from "./brand-match-ring"

export function CompareColumn({
  suggestion,
  index,
  onRemove,
}: {
  suggestion: NameSuggestion
  index: number
  onRemove: () => void
}) {
  const display = getCardDisplayDomain(suggestion)
  const initial = suggestion.name.charAt(0).toUpperCase()

  return (
    <article className="relative flex h-full min-w-[240px] flex-col rounded-xl border border-landing-fg/25 p-5 sm:p-6">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${display.domain} from compare`}
        className="absolute right-4 top-4 text-landing-muted transition-colors hover:text-landing-fg sm:right-5 sm:top-5"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>

      <div className="flex items-start justify-between gap-4 pr-8">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg border font-sans text-lg font-black uppercase",
            getCompareAvatarClass(index)
          )}
        >
          {initial}
        </div>
        <BrandMatchRing score={suggestion.brandMatch} size="sm" />
      </div>

      <div className="mt-5 min-w-0">
        <h2 className="font-sans text-[clamp(1.1rem,2.6vw,1.5rem)] font-black uppercase leading-tight tracking-tight">
          <span className="break-words">{display.slug}</span>
          <span className="ml-1 whitespace-nowrap font-mono text-sm font-normal text-landing-muted sm:text-base">
            {display.tld}
          </span>
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
          {formatKeywordLine(suggestion.matchContext)}
        </p>
      </div>

      <ul className="mt-6 space-y-3 border-t border-landing-fg/10 pt-5">
        {suggestion.tldOptions.map((option) => (
          <li
            key={option.tld}
            className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.1em] sm:text-xs"
          >
            <span className="text-landing-fg">{option.tld}</span>
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

      <button
        type="button"
        onClick={onRemove}
        className="mt-6 w-full rounded-full border border-landing-fg/40 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10 sm:text-xs"
      >
        Remove
      </button>
    </article>
  )
}
