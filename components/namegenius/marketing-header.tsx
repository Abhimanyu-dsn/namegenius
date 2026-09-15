"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { useShortlist } from "@/hooks/use-shortlist"

export function MarketingHeader({ tagline }: { tagline?: string }) {
  const { count } = useShortlist()

  return (
    <header className="mb-8 flex items-center justify-between gap-4 px-6 pt-8 sm:mb-10 sm:px-8">
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
        <Link
          href="/shortlist"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-landing-fg transition-opacity hover:opacity-80"
        >
          Shortlist
          <span
            className="inline-flex size-7 items-center justify-center rounded-full border border-landing-fg text-[11px] font-medium tabular-nums"
            aria-label={`${count} saved names`}
          >
            {count}
          </span>
        </Link>

        <button
          type="button"
          aria-label="Menu"
          className="text-landing-fg transition-opacity hover:opacity-80"
        >
          <Menu className="size-6" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
