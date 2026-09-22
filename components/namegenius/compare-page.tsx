"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { useCompare } from "@/hooks/use-compare"

import { AIRecommendationPanel } from "./ai-recommendation-panel"
import { CompareColumn } from "./compare-column"
import { CompareDomainAvailability } from "./compare-domain-availability"
import { CompareNamingAnalysis } from "./compare-naming-analysis"
import {
  COMPARE_SIDEBAR_TABS,
  CompareSidebar,
  type CompareSidebarTab,
} from "./compare-sidebar"
import { CompareStrengthsWeaknesses } from "./compare-strengths-weaknesses"
import { CompareTable } from "./compare-table"
import { CompareVsDivider } from "./compare-vs-divider"
import { MarketingHeader } from "./marketing-header"
import { ResultsShell } from "./results-shell"

const MIN_TO_COMPARE = 2

export function ComparePage() {
  const { items, count, clear, remove } = useCompare()
  const hasEnoughToCompare = count >= MIN_TO_COMPARE
  const [activeTab, setActiveTab] = useState<CompareSidebarTab>(
    COMPARE_SIDEBAR_TABS[0]
  )

  return (
    <ResultsShell>
      <MarketingHeader tagline="Names, side by side." />

      <main className="flex flex-1 flex-col px-6 pb-6 sm:px-8">
        <div className="mx-auto w-full max-w-7xl flex-1">
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
              Compare
            </p>
            <div className="mt-2 h-px w-12 bg-landing-fg/30" />

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                  Side by
                  <br />
                  side.
                </h1>
                <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                  {count === 0
                    ? "Add names from results to compare them here."
                    : hasEnoughToCompare
                      ? `Comparing ${count} names.`
                      : "Add one more name to compare."}
                </p>
              </div>

              {count > 0 ? (
                <button
                  type="button"
                  onClick={clear}
                  className="self-start font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted underline-offset-4 transition-colors hover:text-landing-fg hover:underline sm:text-xs"
                >
                  Clear all
                </button>
              ) : null}
            </div>
          </section>

          {hasEnoughToCompare ? (
            <div className="mt-12 flex flex-col gap-8 lg:flex-row">
              <CompareSidebar active={activeTab} onChange={setActiveTab} />

              <div className="min-w-0 flex-1">
                {activeTab === "Overview" ? (
                  <div className="flex flex-col gap-10">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
                        Comparing {items.length} names
                      </p>
                      <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {items.map((suggestion, index) => (
                          <div key={suggestion.id} className="relative">
                            <CompareColumn
                              suggestion={suggestion}
                              index={index}
                              onRemove={() => remove(suggestion.id)}
                            />
                            {index < items.length - 1 ? <CompareVsDivider /> : null}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="h-px w-full bg-landing-fg/10" />
                      <div className="mt-10">
                        <AIRecommendationPanel items={items} />
                      </div>
                    </div>
                  </div>
                ) : activeTab === "Brand Fit" ? (
                  <CompareTable items={items} />
                ) : activeTab === "Domain Availability" ? (
                  <CompareDomainAvailability items={items} />
                ) : activeTab === "Naming Analysis" ? (
                  <CompareNamingAnalysis items={items} />
                ) : activeTab === "Strengths & Weaknesses" ? (
                  <CompareStrengthsWeaknesses items={items} />
                ) : (
                  <AIRecommendationPanel items={items} />
                )}
              </div>
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-start gap-8 rounded-xl border border-landing-fg/20 px-6 py-12 sm:px-10 sm:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
                {count === 0 ? "Nothing to compare yet" : "One more to go"}
              </p>
              <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                {count === 0
                  ? "Run a brief, explore generated names, and tap + Compare on at least two you want to weigh against each other."
                  : "You've added one name. Add at least one more to see them side by side."}
              </p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-3 rounded-full bg-landing-cta-bg px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-sm"
              >
                Start your brief
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>

              {count === 1 ? (
                <div className="flex flex-wrap gap-4">
                  {items.map((suggestion, index) => (
                    <CompareColumn
                      key={suggestion.id}
                      suggestion={suggestion}
                      index={index}
                      onRemove={() => remove(suggestion.id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <footer className="flex flex-col gap-4 border-t border-landing-fg/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-landing-muted sm:text-xs">
          <p>Simple</p>
          <p className="mt-1">Memorable</p>
          <p className="mt-1">Meaningful</p>
        </div>

        <Link
          href="/brief"
          className="inline-flex items-center gap-3 self-start font-mono text-xs uppercase tracking-[0.15em] text-landing-fg transition-opacity hover:opacity-80 sm:self-auto"
        >
          Find more names
          <span className="inline-flex size-8 items-center justify-center rounded-full border border-landing-fg">
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </span>
        </Link>
      </footer>
    </ResultsShell>
  )
}
