"use client"

import type { NameSuggestion } from "@/lib/mock-data"
import {
  getDomainAvailabilityFraction,
  getIndustryFit,
  getMemorability,
  getNameLength,
  getPronunciationEase,
  getUniqueness,
} from "@/lib/naming-heuristics"
import { cn } from "@/lib/utils"

function winningIndexes(ranks: number[]): Set<number> {
  const valid = ranks.filter((rank) => rank >= 0)
  if (valid.length === 0) return new Set()
  const max = Math.max(...valid)
  const indexes = new Set<number>()
  ranks.forEach((rank, index) => {
    if (rank === max) indexes.add(index)
  })
  return indexes
}

const TIER_RANK: Record<string, number> = { High: 2, Strong: 2, Moderate: 1, Low: 0, Weak: 0 }

interface Row {
  label: string
  cells: string[]
  ranks?: number[]
}

export function CompareTable({ items }: { items: NameSuggestion[] }) {
  const rows: Row[] = [
    {
      label: "Brand match",
      cells: items.map((item) => `${item.brandMatch}%`),
      ranks: items.map((item) => item.brandMatch),
    },
    {
      label: "Domain availability",
      cells: items.map(
        (item) => getDomainAvailabilityFraction(item.tldOptions).label
      ),
      ranks: items.map((item) => {
        const { available, total } = getDomainAvailabilityFraction(item.tldOptions)
        return total > 0 ? available / total : 0
      }),
    },
    {
      label: "Name length",
      cells: items.map((item) => `${getNameLength(item.name)} characters`),
      ranks: items.map((item) => -getNameLength(item.name)),
    },
    {
      label: "Pronunciation",
      cells: items.map((item) => getPronunciationEase(item.name)),
    },
    {
      label: "Memorability",
      cells: items.map((item) => getMemorability(item.name)),
      ranks: items.map((item) => TIER_RANK[getMemorability(item.name)]),
    },
    {
      label: "Industry fit",
      cells: items.map((item) => getIndustryFit(item.brandMatch)),
      ranks: items.map((item) => TIER_RANK[getIndustryFit(item.brandMatch)]),
    },
    {
      label: "Uniqueness",
      cells: items.map((item) => getUniqueness(item.name)),
      ranks: items.map((item) => TIER_RANK[getUniqueness(item.name)]),
    },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-landing-fg/25">
      <div
        className="grid min-w-[480px]"
        style={{
          gridTemplateColumns: `minmax(130px,1fr) repeat(${items.length}, minmax(120px,1fr))`,
        }}
      >
        <div className="border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted sm:text-xs">
          Factor
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-landing-fg/10 p-4 font-sans text-sm font-black uppercase tracking-tight"
          >
            {item.name}
          </div>
        ))}

        {rows.map((row) => {
          const winners = row.ranks ? winningIndexes(row.ranks) : new Set<number>()

          return (
            <div key={row.label} className="contents">
              <div className="border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted last:border-b-0 sm:text-xs">
                {row.label}
              </div>
              {row.cells.map((cell, index) => (
                <div
                  key={items[index].id}
                  className={cn(
                    "border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] last:border-b-0 sm:text-xs",
                    winners.has(index) ? "text-landing-accent" : "text-landing-fg"
                  )}
                >
                  {cell}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
