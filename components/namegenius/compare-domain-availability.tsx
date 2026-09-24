"use client"

import type { NameSuggestion } from "@/lib/mock-data"
import { SUPPORTED_TLDS } from "@/lib/mock-data"
import { formatTldStatusLabel, getTldStatusDotClass } from "@/lib/results-display"
import { cn } from "@/lib/utils"

const STATUS_RANK: Record<string, number> = {
  available: 2,
  taken: 0,
  unavailable: 1,
}

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

export function CompareDomainAvailability({ items }: { items: NameSuggestion[] }) {
  const tlds = SUPPORTED_TLDS.filter((tld) =>
    items.some((item) => item.tldOptions.some((option) => option.tld === tld))
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-landing-fg/25">
      <div
        className="grid min-w-[480px]"
        style={{
          gridTemplateColumns: `minmax(90px,1fr) repeat(${items.length}, minmax(140px,1fr))`,
        }}
      >
        <div className="border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted sm:text-xs">
          TLD
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-landing-fg/10 p-4 font-sans text-sm font-black uppercase tracking-tight"
          >
            {item.name}
          </div>
        ))}

        {tlds.map((tld) => {
          const ranks = items.map((item) => {
            const option = item.tldOptions.find((opt) => opt.tld === tld)
            return option ? STATUS_RANK[option.status] : -1
          })
          const winners = winningIndexes(ranks)

          return (
            <div key={tld} className="contents">
              <div className="border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted last:border-b-0 sm:text-xs">
                {tld}
              </div>
              {items.map((item, index) => {
                const option = item.tldOptions.find((opt) => opt.tld === tld)
                const isWinner = winners.has(index) && ranks[index] >= 0

                return (
                  <div
                    key={item.id}
                    className="border-b border-landing-fg/10 p-4 font-mono text-[10px] uppercase tracking-[0.1em] last:border-b-0 sm:text-xs"
                  >
                    {option ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-2",
                          isWinner ? "text-results-accent" : "text-landing-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            getTldStatusDotClass(option.status)
                          )}
                          aria-hidden
                        />
                        {formatTldStatusLabel(option)}
                      </span>
                    ) : (
                      <span className="text-landing-muted/40">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
