"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ShortlistFooter() {
  return (
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
  )
}
