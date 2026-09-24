"use client"

import type { NameSuggestion } from "@/lib/mock-data"
import {
  getMemorability,
  getNameLength,
  getPronunciationEase,
  getUniqueness,
} from "@/lib/naming-heuristics"
import { getCompareAvatarClass } from "@/lib/results-display"
import { cn } from "@/lib/utils"

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-landing-fg/10 py-3 font-mono text-[10px] uppercase tracking-[0.1em] last:border-b-0 sm:text-xs">
      <span className="text-landing-muted">{label}</span>
      <span className="text-landing-fg">{value}</span>
    </div>
  )
}

export function CompareNamingAnalysis({ items }: { items: NameSuggestion[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border border-landing-fg/25 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg border font-sans text-sm font-black uppercase",
                getCompareAvatarClass(index)
              )}
            >
              {item.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-sans text-lg font-black uppercase tracking-tight">
              {item.name}
            </h3>
          </div>

          <div className="mt-5">
            <MetricRow label="Name length" value={`${getNameLength(item.name)} characters`} />
            <MetricRow label="Pronunciation" value={getPronunciationEase(item.name)} />
            <MetricRow label="Memorability" value={getMemorability(item.name)} />
            <MetricRow label="Uniqueness" value={getUniqueness(item.name)} />
          </div>
        </div>
      ))}
    </div>
  )
}
