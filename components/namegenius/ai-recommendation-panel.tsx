"use client"

import { Check, Sparkles } from "lucide-react"

import { useShortlist } from "@/hooks/use-shortlist"
import type { NameSuggestion } from "@/lib/mock-data"
import { buildChecklist, getCardDisplayDomain, getCompareAvatarClass } from "@/lib/results-display"
import { cn } from "@/lib/utils"

function pickRecommended(items: NameSuggestion[]): NameSuggestion | null {
  if (items.length === 0) return null

  const fullyAvailable = items.filter((item) =>
    item.tldOptions.some((option) => option.tld === ".com" && option.status === "available")
  )
  const pool = fullyAvailable.length > 0 ? fullyAvailable : items

  return pool.reduce((best, item) => (item.brandMatch > best.brandMatch ? item : best))
}

export function AIRecommendationPanel({ items }: { items: NameSuggestion[] }) {
  const { toggle, isSaved } = useShortlist()
  const recommended = pickRecommended(items)

  if (!recommended) return null

  const index = items.findIndex((item) => item.id === recommended.id)
  const display = getCardDisplayDomain(recommended)
  const checklist = buildChecklist(recommended, display.tld, display.status === "available")
  const saved = isSaved(recommended.id)
  const domainAvailable = display.status === "available"

  return (
    <div className="w-full rounded-xl border border-landing-accent/40 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-landing-accent" strokeWidth={1.5} />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-fg sm:text-xs">
          AI Recommendation
        </p>
        <span className="rounded-full border border-landing-accent px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-landing-accent">
          Beta
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border font-sans text-base font-black uppercase",
            getCompareAvatarClass(index)
          )}
        >
          {recommended.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-sans text-lg font-black uppercase tracking-tight">
            {recommended.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted sm:text-xs">
            Best overall choice
          </p>
        </div>
        <span className="ml-auto shrink-0 font-sans text-xl font-black tabular-nums text-landing-accent">
          {recommended.brandMatch}%
        </span>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-landing-muted sm:text-xs">
        {recommended.name} has the strongest brand match score
        {domainAvailable ? ` and an available ${display.tld} domain ` : " "}
        among the names you&apos;re comparing.
      </p>

      <ul className="mt-5 space-y-2">
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

      <button
        type="button"
        onClick={() => toggle(recommended)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-landing-cta-bg px-6 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-xs"
      >
        {saved ? "Saved to shortlist" : "Keep in Shortlist"}
      </button>
    </div>
  )
}
