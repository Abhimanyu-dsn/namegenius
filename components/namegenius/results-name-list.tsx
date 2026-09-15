"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { getCardDisplayDomain } from "@/lib/results-display"
import type { NameSuggestion } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function ResultsNameList({
  suggestions,
  selectedId,
  onSelect,
}: {
  suggestions: NameSuggestion[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const ignoreObserverRef = useRef(false)
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(false)

  const selectedIndex = suggestions.findIndex((item) => item.id === selectedId)

  const scrollToId = useCallback((id: string, behavior: ScrollBehavior = "smooth") => {
    ignoreObserverRef.current = true
    const node = itemRefs.current.get(id)
    node?.scrollIntoView({ behavior, block: "center" })
    window.setTimeout(() => {
      ignoreObserverRef.current = false
    }, 300)
  }, [])

  useEffect(() => {
    if (!selectedId) return
    scrollToId(selectedId, "instant")
    const timer = window.setTimeout(() => setScrollSyncEnabled(true), 200)
    return () => window.clearTimeout(timer)
  }, [selectedId, scrollToId])

  useEffect(() => {
    const root = scrollRef.current
    if (!root || !scrollSyncEnabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const top = visible[0]?.target as HTMLElement | undefined
        if (ignoreObserverRef.current) return

        const id = top?.dataset.suggestionId
        if (id && id !== selectedId) {
          onSelect(id)
        }
      },
      { root, threshold: [0.5, 0.65, 0.8] }
    )

    for (const node of itemRefs.current.values()) {
      observer.observe(node)
    }

    return () => observer.disconnect()
  }, [suggestions, selectedId, onSelect, scrollSyncEnabled])

  function goToOffset(offset: number) {
    const nextIndex = selectedIndex + offset
    if (nextIndex < 0 || nextIndex >= suggestions.length) return
    const next = suggestions[nextIndex]
    onSelect(next.id)
    scrollToId(next.id)
  }

  return (
    <div className="relative flex flex-col">
      <button
        type="button"
        onClick={() => goToOffset(-1)}
        disabled={selectedIndex <= 0}
        aria-label="Previous name"
        className="mx-auto mb-2 text-landing-muted transition-opacity hover:text-landing-fg disabled:opacity-30"
      >
        <ChevronUp className="size-5" strokeWidth={1.5} />
      </button>

      <div
        ref={scrollRef}
        className="flex max-h-[min(60vh,520px)] min-h-[280px] flex-col gap-3 overflow-y-auto scroll-smooth px-1 py-6 [scrollbar-width:none] sm:min-h-[360px] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {suggestions.map((suggestion, index) => {
          const display = getCardDisplayDomain(suggestion)
          const isSelected = suggestion.id === selectedId

          return (
            <button
              key={suggestion.id}
              type="button"
              ref={(node) => {
                if (node) itemRefs.current.set(suggestion.id, node)
                else itemRefs.current.delete(suggestion.id)
              }}
              data-suggestion-id={suggestion.id}
              onClick={() => {
                onSelect(suggestion.id)
                scrollToId(suggestion.id)
              }}
              className={cn(
                "grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all sm:px-5 sm:py-5",
                isSelected
                  ? "border-landing-fg bg-transparent opacity-100"
                  : "border-transparent opacity-35 hover:opacity-60",
                "snap-center"
              )}
            >
              <span className="font-mono text-xs text-landing-muted sm:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "truncate font-sans font-black uppercase tracking-tight",
                  isSelected
                    ? "text-[clamp(1.25rem,4vw,2rem)]"
                    : "text-lg sm:text-xl"
                )}
              >
                {display.slug}
              </span>
              <span className="font-mono text-xs text-landing-muted sm:text-sm">
                {display.tld}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => goToOffset(1)}
        disabled={selectedIndex >= suggestions.length - 1}
        aria-label="Next name"
        className="mx-auto mt-2 text-landing-muted transition-opacity hover:text-landing-fg disabled:opacity-30"
      >
        <ChevronDown className="size-5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
