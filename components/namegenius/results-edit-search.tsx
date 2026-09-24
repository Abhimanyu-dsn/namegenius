"use client"

import { useState } from "react"

import type { TldPreference } from "@/lib/search-params"
import { cn } from "@/lib/utils"

const PRIMARY_TLDS = [".com", ".ai", ".io", ".co", ".app"] as const

export interface EditableSearch {
  concept: string
  description: string
  competitors: string
  tlds: TldPreference
}

const fieldClass =
  "mt-1.5 w-full resize-none rounded-lg border border-landing-fg/40 bg-transparent px-3 py-2 font-mono text-xs text-landing-fg outline-none placeholder:text-landing-muted focus:border-landing-fg"

const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.15em] text-landing-muted"

export function ResultsEditSearch({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: EditableSearch
  onSubmit: (next: EditableSearch) => void
  onCancel: () => void
}) {
  const [concept, setConcept] = useState(initial.concept)
  const [description, setDescription] = useState(initial.description)
  const [competitors, setCompetitors] = useState(initial.competitors)
  const [tlds, setTlds] = useState<TldPreference>(initial.tlds)

  function toggleTld(tld: string) {
    if (tlds === "any") {
      setTlds([tld])
      return
    }
    const next = tlds.includes(tld)
      ? tlds.filter((item) => item !== tld)
      : [...tlds, tld]
    setTlds(next.length > 0 ? next : [".com"])
  }

  const canSubmit = concept.trim().length > 0

  return (
    <form
      className="mt-6 flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!canSubmit) return
        onSubmit({ concept, description, competitors, tlds })
      }}
    >
      <label className={labelClass}>
        Your idea
        <input
          type="text"
          value={concept}
          onChange={(event) => setConcept(event.target.value)}
          placeholder="an AI tool for designers"
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        What you&apos;re building
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="Helps designers generate UI ideas using AI"
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Competitors &amp; keywords
        <input
          type="text"
          value={competitors}
          onChange={(event) => setCompetitors(event.target.value)}
          placeholder="Figma, Framer, design, AI"
          className={fieldClass}
        />
      </label>

      <div>
        <span className={labelClass}>Preferred domains</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRIMARY_TLDS.map((tld) => {
            const selected = tlds !== "any" && tlds.includes(tld)
            return (
              <button
                key={tld}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleTld(tld)}
                className={cn(
                  "rounded-full border border-landing-fg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                  selected
                    ? "bg-landing-cta-bg text-landing-cta-fg"
                    : "bg-transparent text-landing-fg hover:bg-landing-fg/10"
                )}
              >
                {tld}
              </button>
            )
          })}
          <button
            type="button"
            aria-pressed={tlds === "any"}
            onClick={() => setTlds(tlds === "any" ? [".com"] : "any")}
            className={cn(
              "rounded-full border border-landing-fg px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
              tlds === "any"
                ? "bg-landing-cta-bg text-landing-cta-fg"
                : "bg-transparent text-landing-fg hover:bg-landing-fg/10"
            )}
          >
            Any
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-landing-cta-bg px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Update names
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-landing-muted underline-offset-4 transition-colors hover:text-landing-fg hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
