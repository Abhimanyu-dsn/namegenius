"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { PanelRightOpen } from "lucide-react"

import { useShortlist } from "@/hooks/use-shortlist"
import {
  filterTldOptions,
  type NameSuggestion,
} from "@/lib/mock-data"
import {
  buildHomeUrl,
  buildResultsUrl,
  parseResultsSearchParams,
} from "@/lib/search-params"
import { cn } from "@/lib/utils"

import { MarketingHeader } from "./marketing-header"
import { ResultsDetailPanel } from "./results-detail-panel"
import { ResultsFooter } from "./results-footer"
import { ResultsNameList } from "./results-name-list"
import { ResultsShell } from "./results-shell"

export function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const parsed = useMemo(
    () => parseResultsSearchParams(searchParams),
    [searchParams]
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(true)
  const { toggle, isSaved } = useShortlist()

  function getDefaultSelectedId(items: NameSuggestion[]) {
    if (items.length === 0) return null
    const middleIndex = Math.min(2, items.length - 1)
    return items[middleIndex]?.id ?? items[0].id
  }

  useEffect(() => {
    if (!parsed) {
      router.replace("/")
    }
  }, [parsed, router])

  useEffect(() => {
    if (!parsed) return

    let cancelled = false
    setIsLoading(true)
    setLoadError(null)

    fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        concept: parsed.concept,
        competitors: parsed.competitors,
        description: parsed.description,
        tlds: parsed.tlds,
        seed: parsed.seed,
      }),
    })
      .then(async (response) => {
        const data = await response.json()
        if (cancelled) return

        if (!response.ok || data.error) {
          setSuggestions([])
          setLoadError(
            typeof data.error === "string"
              ? data.error
              : "Something went wrong generating names. Try again."
          )
          return
        }

        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
          setLoadError("Something went wrong generating names. Try again.")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [parsed])

  const displaySuggestions: NameSuggestion[] = suggestions.map((suggestion) => ({
    ...suggestion,
    tldOptions: filterTldOptions(
      suggestion.tldOptions,
      parsed?.tlds ?? "any"
    ),
  }))

  useEffect(() => {
    if (displaySuggestions.length === 0) return
    if (selectedId && displaySuggestions.some((item) => item.id === selectedId)) {
      return
    }
    setSelectedId(getDefaultSelectedId(displaySuggestions))
  }, [displaySuggestions, selectedId])

  const activeSelectedId =
    selectedId && displaySuggestions.some((item) => item.id === selectedId)
      ? selectedId
      : getDefaultSelectedId(displaySuggestions) ?? ""

  if (!parsed) {
    return null
  }

  const search = parsed

  const selectedSuggestion =
    displaySuggestions.find((item) => item.id === activeSelectedId) ?? null

  const editSearchHref = buildHomeUrl({
    concept: search.concept,
    competitors: search.competitors,
    description: search.description,
    tlds: search.tlds,
  })

  function handleRefresh() {
    setIsRefreshing(true)
    router.push(
      buildResultsUrl({
        concept: search.concept,
        competitors: search.competitors,
        description: search.description,
        tlds: search.tlds,
        seed: search.seed + 1,
      })
    )
  }

  return (
    <ResultsShell>
      <MarketingHeader tagline="Turn ideas into iconic names." />

      <div className="flex flex-1 flex-col px-6 pb-6 sm:px-8">
        <div
          className={cn(
            "mx-auto grid w-full max-w-7xl flex-1 gap-8 md:gap-10",
            detailOpen
              ? "lg:grid-cols-[minmax(180px,1fr)_minmax(260px,1.15fr)_minmax(300px,1.35fr)]"
              : "lg:grid-cols-[minmax(180px,1fr)_1fr]",
            !detailOpen && "md:grid-cols-1 lg:grid-cols-[minmax(180px,1fr)_1fr]"
          )}
        >
          <section className="flex flex-col justify-between lg:min-h-[min(60vh,520px)]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
                Results
              </p>
              <div className="mt-2 h-px w-12 bg-landing-fg/30" />
              <h1 className="mt-8 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                Your names
                <br />
                are ready.
              </h1>
              <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                Scroll to explore
                <br />
                find the one that fits.
              </p>
              {loadError ? (
                <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                  {loadError}
                </p>
              ) : null}
              <Link
                href={editSearchHref}
                className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted underline-offset-4 transition-colors hover:text-landing-fg hover:underline sm:text-xs"
              >
                Edit search
              </Link>
            </div>
            <p className="mt-8 hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted lg:block sm:text-xs">
              {isLoading
                ? "Generating names..."
                : `${displaySuggestions.length} names generated`}
              <br />
              based on your brief
            </p>
          </section>

          <section className="relative min-w-0 md:col-span-1">
            <div
              className={cn(
                "grid gap-8",
                detailOpen
                  ? "md:grid-cols-1 lg:grid-cols-1"
                  : "md:grid-cols-1 lg:grid-cols-1"
              )}
            >
              <ResultsNameList
                suggestions={displaySuggestions}
                selectedId={activeSelectedId}
                onSelect={setSelectedId}
              />
            </div>

            {!detailOpen ? (
              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                aria-label="Show selected name details"
                className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-landing-fg/40 p-2 text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10 lg:inline-flex"
              >
                <PanelRightOpen className="size-4" strokeWidth={1.5} />
              </button>
            ) : null}
          </section>

          {detailOpen ? (
            <section className="min-w-0">
              <ResultsDetailPanel
                suggestion={selectedSuggestion}
                tldOptions={selectedSuggestion?.tldOptions ?? []}
                isOpen={true}
                onToggle={() => setDetailOpen(false)}
                isSaved={
                  selectedSuggestion ? isSaved(selectedSuggestion.id) : false
                }
                onToggleSave={() => {
                  if (selectedSuggestion) toggle(selectedSuggestion)
                }}
              />
            </section>
          ) : null}
        </div>

        {!detailOpen && (
          <div className="mx-auto mt-6 flex w-full max-w-7xl justify-center lg:hidden">
            <ResultsDetailPanel
              suggestion={selectedSuggestion}
              tldOptions={selectedSuggestion?.tldOptions ?? []}
              isOpen={false}
              onToggle={() => setDetailOpen(true)}
              isSaved={
                selectedSuggestion ? isSaved(selectedSuggestion.id) : false
              }
              onToggleSave={() => {
                if (selectedSuggestion) toggle(selectedSuggestion)
              }}
            />
          </div>
        )}

        <p className="mx-auto mt-6 w-full max-w-7xl font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted lg:hidden sm:text-xs">
          {isLoading
            ? "Generating names..."
            : `${displaySuggestions.length} names generated based on your brief`}
        </p>
      </div>

      <ResultsFooter
        onGenerateMore={handleRefresh}
        isRefreshing={isRefreshing || isLoading}
      />
    </ResultsShell>
  )
}
