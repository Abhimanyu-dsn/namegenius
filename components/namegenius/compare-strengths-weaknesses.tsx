"use client"

import { Check, Minus } from "lucide-react"

import type { NameSuggestion } from "@/lib/mock-data"
import { getStrengthsAndWeaknesses } from "@/lib/naming-heuristics"
import { getCompareAvatarClass } from "@/lib/results-display"
import { cn } from "@/lib/utils"

export function CompareStrengthsWeaknesses({ items }: { items: NameSuggestion[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const { strengths, weaknesses } = getStrengthsAndWeaknesses(item)

        return (
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

            <ul className="mt-5 space-y-2">
              {strengths.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-landing-fg sm:text-xs"
                >
                  <Check className="size-4 shrink-0 text-results-accent" strokeWidth={2} />
                  {label}
                </li>
              ))}
            </ul>

            {weaknesses.length > 0 ? (
              <ul className="mt-3 space-y-2 border-t border-landing-fg/10 pt-3">
                {weaknesses.map((label) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-landing-muted sm:text-xs"
                  >
                    <Minus className="size-4 shrink-0 text-landing-muted/50" strokeWidth={2} />
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
