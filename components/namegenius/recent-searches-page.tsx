"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useRecentSearches } from "@/hooks/use-recent-searches"

import { MarketingHeader } from "./marketing-header"
import { RecentSearchCard } from "./recent-search-card"
import { ResultsShell } from "./results-shell"

export function RecentSearchesPage() {
  const { items, count, clear, remove, add } = useRecentSearches()

  return (
    <ResultsShell>
      <MarketingHeader tagline="Everywhere you've looked." />

      <main className="flex flex-1 flex-col px-6 pb-6 sm:px-8">
        <div className="mx-auto w-full max-w-7xl flex-1">
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
              Recent searches
            </p>
            <div className="mt-2 h-px w-12 bg-landing-fg/30" />

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                  Your
                  <br />
                  searches.
                </h1>
                <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                  {count === 0
                    ? "Nothing searched yet."
                    : `${count} search${count === 1 ? "" : "es"} saved.`}
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

          {count === 0 ? (
            <div className="mt-16 flex flex-col items-start gap-8 rounded-xl border border-landing-fg/20 px-6 py-12 sm:px-10 sm:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
                Nothing searched yet
              </p>
              <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                Run a brief and it&apos;ll show up here, ready to revisit any
                time.
              </p>
              <Link
                href="/brief"
                className="inline-flex items-center gap-3 rounded-full bg-landing-cta-bg px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-sm"
              >
                Start your brief
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <div className="mt-12 flex flex-col gap-4">
              {items.map((item) => (
                <RecentSearchCard
                  key={item.id}
                  item={item}
                  onRun={() =>
                    add({
                      concept: item.concept,
                      competitors: item.competitors,
                      description: item.description,
                      tlds: item.tlds,
                    })
                  }
                  onRemove={() => remove(item.id)}
                />
              ))}
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
