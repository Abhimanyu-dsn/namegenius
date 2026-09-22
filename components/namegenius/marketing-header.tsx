"use client"

import Link from "next/link"
import { useState } from "react"
import { History, Menu, X } from "lucide-react"

import { useCompare } from "@/hooks/use-compare"
import { useRecentSearches } from "@/hooks/use-recent-searches"
import { useShortlist } from "@/hooks/use-shortlist"

import { RecentSearchCard } from "./recent-search-card"

function NavLink({
  href,
  label,
  count,
  onClick,
}: {
  href: string
  label: string
  count: number
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-landing-fg transition-opacity hover:opacity-80"
    >
      {label}
      <span
        className="inline-flex size-7 items-center justify-center rounded-full border border-landing-fg text-[11px] font-medium tabular-nums"
        aria-label={`${count} ${label.toLowerCase()} names`}
      >
        {count}
      </span>
    </Link>
  )
}

function RecentSearchesList({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const { items, remove, add, clear } = useRecentSearches()

  if (items.length === 0) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted sm:text-xs">
        No recent searches yet.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-landing-muted sm:text-xs">
          Recent searches
        </p>
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted underline-offset-4 transition-colors hover:text-landing-fg hover:underline sm:text-xs"
        >
          Clear all
        </button>
      </div>
      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {items.map((item) => (
          <RecentSearchCard
            key={item.id}
            item={item}
            onRun={() => {
              add({
                concept: item.concept,
                competitors: item.competitors,
                description: item.description,
                tlds: item.tlds,
              })
              onNavigate?.()
            }}
            onRemove={() => remove(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function MarketingHeader({ tagline }: { tagline?: string }) {
  const { count } = useShortlist()
  const { count: compareCount } = useCompare()
  const { count: recentCount } = useRecentSearches()
  const [menuOpen, setMenuOpen] = useState(false)
  const [recentOpen, setRecentOpen] = useState(false)

  return (
    <header className="relative mb-8 flex items-center justify-between gap-4 px-6 pt-8 sm:mb-10 sm:px-8">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold italic tracking-tight text-landing-fg"
        >
          NameGenius
        </Link>
        {tagline ? (
          <p className="hidden font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-landing-muted sm:block sm:text-xs">
            {tagline}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden items-center gap-4 sm:flex sm:gap-6">
          <NavLink href="/shortlist" label="Shortlist" count={count} />
          <NavLink href="/compare" label="Compare" count={compareCount} />

          <div className="relative">
            <button
              type="button"
              aria-label="Recent searches"
              aria-expanded={recentOpen}
              onClick={() => setRecentOpen((open) => !open)}
              className="relative text-landing-fg transition-opacity hover:opacity-80"
            >
              <History className="size-5" strokeWidth={1.5} />
              {recentCount > 0 ? (
                <span
                  aria-hidden
                  className="absolute -right-1.5 -top-1.5 inline-flex size-4 items-center justify-center rounded-full border border-landing-fg bg-landing-bg text-[9px] font-medium tabular-nums"
                >
                  {recentCount}
                </span>
              ) : null}
            </button>

            {recentOpen ? (
              <div className="absolute right-0 top-full z-20 mt-3 w-[360px] rounded-xl border border-landing-fg/25 bg-landing-bg p-5">
                <RecentSearchesList onNavigate={() => setRecentOpen(false)} />
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-landing-fg transition-opacity hover:opacity-80"
        >
          {menuOpen ? (
            <X className="size-6" strokeWidth={1.5} />
          ) : (
            <Menu className="size-6" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-6 top-full z-20 mt-2 flex w-[calc(100%-3rem)] max-w-sm flex-col gap-4 rounded-xl border border-landing-fg/25 bg-landing-bg p-5 sm:hidden">
          <NavLink
            href="/shortlist"
            label="Shortlist"
            count={count}
            onClick={() => setMenuOpen(false)}
          />
          <NavLink
            href="/compare"
            label="Compare"
            count={compareCount}
            onClick={() => setMenuOpen(false)}
          />
          <div className="h-px w-full bg-landing-fg/10" />
          <RecentSearchesList onNavigate={() => setMenuOpen(false)} />
        </div>
      ) : null}
    </header>
  )
}
