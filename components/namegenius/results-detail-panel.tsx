"use client"

import { Check, PanelRightClose, PanelRightOpen } from "lucide-react"

import {
  buildChecklist,
  formatKeywordLine,
  formatTldStatusLabel,
  getCardDisplayDomain,
  getTldStatusDotClass,
} from "@/lib/results-display"
import type { NameSuggestion, TldOption } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

import { BrandMatchRing } from "./brand-match-ring"

export function ResultsDetailPanel({
  suggestion,
  tldOptions,
  isOpen,
  onToggle,
  isSaved,
  onToggleSave,
  isComparing = false,
  onToggleCompare,
  canAddToCompare = true,
}: {
  suggestion: NameSuggestion | null
  tldOptions: TldOption[]
  isOpen: boolean
  onToggle: () => void
  isSaved: boolean
  onToggleSave: () => void
  isComparing?: boolean
  onToggleCompare?: () => void
  canAddToCompare?: boolean
}) {
  if (!suggestion) {
    return null
  }

  const display = getCardDisplayDomain({
    ...suggestion,
    tldOptions,
  })
  const checklist = buildChecklist(
    suggestion,
    display.tld,
    display.status === "available"
  )

  if (!isOpen) {
    return (
      <div className="flex justify-end lg:justify-center">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Show selected name details"
          className="inline-flex size-10 items-center justify-center rounded-full border border-landing-fg/40 text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10"
        >
          <PanelRightOpen className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col border-landing-fg/10 lg:border-l lg:pl-8",
        "transition-all duration-300"
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
          Selected name
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Hide selected name details"
          className="text-landing-muted transition-colors hover:text-landing-fg"
        >
          <PanelRightClose className="size-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-sans text-[clamp(1.5rem,4vw,2.25rem)] font-black uppercase leading-none tracking-tight">
            {display.slug}
            <span className="ml-2 font-mono text-base font-normal text-landing-muted sm:text-lg">
              {display.tld}
            </span>
          </h2>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted sm:text-xs">
            {formatKeywordLine(suggestion.matchContext)}
          </p>
        </div>
        <BrandMatchRing score={suggestion.brandMatch} />
      </div>

      <ul className="mt-8 space-y-3">
        {checklist.map((item) => (
          <li
            key={item.label}
            className={cn(
              "flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.08em] sm:text-xs",
              item.passed ? "text-landing-fg" : "text-landing-muted/50"
            )}
          >
            <Check
              className={cn(
                "size-4 shrink-0",
                item.passed ? "text-results-accent" : "text-landing-muted/30"
              )}
              strokeWidth={2}
            />
            {item.label}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
          Domain availability
        </p>
        <ul className="space-y-2">
          {tldOptions.map((option) => (
            <li
              key={option.tld}
              className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.1em]"
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
      </div>

      <button
        type="button"
        onClick={onToggleSave}
        className="mt-10 w-full rounded-full bg-landing-cta-bg px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-sm"
      >
        {isSaved ? "Saved to shortlist" : "+ Shortlist"}
      </button>

      {onToggleCompare ? (
        <button
          type="button"
          onClick={onToggleCompare}
          disabled={!isComparing && !canAddToCompare}
          className="mt-3 w-full rounded-full border border-landing-fg/40 px-6 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          {isComparing ? "Remove from compare" : "+ Compare"}
        </button>
      ) : null}
    </aside>
  )
}
