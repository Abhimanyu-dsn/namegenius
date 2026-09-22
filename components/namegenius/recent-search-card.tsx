"use client"

import { ArrowRight, X } from "lucide-react"

import type { RecentSearchItem } from "@/lib/recent-search-storage"
import { buildResultsUrl, formatTldPreferenceLabel } from "@/lib/search-params"
import { cn } from "@/lib/utils"

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function RecentSearchCard({
  item,
  onRemove,
  onRun,
  className,
}: {
  item: RecentSearchItem
  onRemove: () => void
  onRun: () => void
  className?: string
}) {
  const href = buildResultsUrl({
    concept: item.concept,
    competitors: item.competitors,
    description: item.description,
    tlds: item.tlds,
  })

  return (
    <a
      href={href}
      onClick={onRun}
      className={cn(
        "group flex w-full shrink-0 items-center gap-4 rounded-xl border border-landing-fg/25 p-4 text-left transition-colors hover:border-landing-fg sm:p-5",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-sans text-sm font-black uppercase tracking-tight sm:text-base">
          {item.concept || "Untitled search"}
        </h3>
        {item.description ? (
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-landing-muted sm:text-xs">
            {item.description}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-landing-muted sm:text-[10px]">
          <span className="rounded-full border border-landing-fg/25 px-2 py-0.5">
            {formatTldPreferenceLabel(item.tlds)}
          </span>
          {item.competitors ? (
            <span className="truncate rounded-full border border-landing-fg/25 px-2 py-0.5">
              {item.competitors}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-landing-muted sm:text-[10px]">
          {formatRelativeTime(item.searchedAt)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onRemove()
            }}
            aria-label={`Remove "${item.concept || "search"}" from recent searches`}
            className="text-landing-muted transition-colors hover:text-landing-fg"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
          <span
            aria-hidden
            className="inline-flex size-7 items-center justify-center rounded-full border border-landing-fg/40 text-landing-fg transition-colors group-hover:border-landing-fg group-hover:bg-landing-fg/10"
          >
            <ArrowRight className="size-3.5" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </a>
  )
}
