"use client"

import {
  BarChart3,
  CaseSensitive,
  Globe,
  Lightbulb,
  ListChecks,
  Star,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export const COMPARE_SIDEBAR_TABS = [
  "Overview",
  "Brand Fit",
  "Domain Availability",
  "Naming Analysis",
  "Strengths & Weaknesses",
  "Recommendation",
] as const
export type CompareSidebarTab = (typeof COMPARE_SIDEBAR_TABS)[number]

const TAB_ICONS: Record<CompareSidebarTab, LucideIcon> = {
  Overview: BarChart3,
  "Brand Fit": Star,
  "Domain Availability": Globe,
  "Naming Analysis": CaseSensitive,
  "Strengths & Weaknesses": ListChecks,
  Recommendation: Lightbulb,
}

export function CompareSidebar({
  active,
  onChange,
}: {
  active: CompareSidebarTab
  onChange: (tab: CompareSidebarTab) => void
}) {
  return (
    <nav
      aria-label="Compare view"
      className="flex gap-2 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col lg:gap-2 lg:overflow-visible"
    >
      {COMPARE_SIDEBAR_TABS.map((tab) => {
        const selected = tab === active
        const Icon = TAB_ICONS[tab]
        return (
          <button
            key={tab}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border border-landing-fg px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition-colors sm:text-xs lg:w-full",
              selected
                ? "bg-landing-accent text-landing-accent-fg border-landing-accent"
                : "bg-transparent text-landing-fg hover:bg-landing-fg/10"
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.5} />
            {tab}
          </button>
        )
      })}
    </nav>
  )
}
