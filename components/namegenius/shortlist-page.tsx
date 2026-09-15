"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useShortlist } from "@/hooks/use-shortlist"

import { MarketingHeader } from "./marketing-header"
import { ResultsShell } from "./results-shell"
import { ShortlistCard } from "./shortlist-card"
import { ShortlistFooter } from "./shortlist-footer"

export function ShortlistPage() {
  const { items, count, clear, toggle } = useShortlist()

  return (
    <ResultsShell>
      <MarketingHeader tagline="Names worth keeping." />

      <main className="flex flex-1 flex-col px-6 pb-6 sm:px-8">
        <div className="mx-auto w-full max-w-7xl flex-1">
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
              Shortlist
            </p>
            <div className="mt-2 h-px w-12 bg-landing-fg/30" />

            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                  Your
                  <br />
                  favorites.
                </h1>
                <p className="mt-6 max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                  {count === 0
                    ? "Save names from results to compare and revisit later."
                    : `${count} name${count === 1 ? "" : "s"} saved for later.`}
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
            <div className="mt-16 flex flex-col items-start gap-8 border border-landing-fg/20 rounded-xl px-6 py-12 sm:px-10 sm:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
                Nothing saved yet
              </p>
              <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:text-xs">
                Run a brief, explore generated names, and tap + Shortlist on the
                ones you want to keep.
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
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((suggestion) => (
                <ShortlistCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onRemove={() => toggle(suggestion)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ShortlistFooter />
    </ResultsShell>
  )
}
