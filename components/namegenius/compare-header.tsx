"use client"

import Link from "next/link"
import { useState } from "react"
import { Share2 } from "lucide-react"

import { useShortlist } from "@/hooks/use-shortlist"
import { cn } from "@/lib/utils"

export function CompareHeader() {
  const { count } = useShortlist()
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — no-op, button still visually acknowledges nothing happened
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-8 sm:px-8">
      <Link
        href="/"
        className="shrink-0 text-2xl font-bold italic tracking-tight text-landing-fg"
      >
        NameGenius
      </Link>

      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] sm:gap-3">
        <Link
          href="/brief"
          className="rounded-full px-4 py-2 text-landing-muted transition-colors hover:text-landing-fg"
        >
          Find Names
        </Link>
        <Link
          href="/shortlist"
          className="rounded-full px-4 py-2 text-landing-muted transition-colors hover:text-landing-fg"
        >
          Shortlist
          <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full border border-landing-fg/40 text-[10px] tabular-nums">
            {count}
          </span>
        </Link>
        <span
          aria-current="page"
          className="rounded-full bg-landing-accent px-4 py-2 text-landing-accent-fg"
        >
          Compare
        </span>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-landing-fg/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-landing-fg transition-colors hover:border-landing-fg hover:bg-landing-fg/10 sm:text-xs"
        >
          <Share2 className={cn("size-3.5", copied && "text-results-accent")} strokeWidth={1.5} />
          {copied ? "Copied" : "Share"}
        </button>
        <Link
          href="/brief"
          className="rounded-full bg-landing-cta-bg px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 sm:text-xs"
        >
          New Search
        </Link>
      </div>
    </header>
  )
}
