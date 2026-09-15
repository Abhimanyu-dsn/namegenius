"use client"

import { Label } from "@/components/ui/label"
import { SUPPORTED_TLDS } from "@/lib/mock-data"
import type { TldPreference } from "@/lib/search-params"
import { cn } from "@/lib/utils"

function isAnySelected(value: TldPreference) {
  return value === "any"
}

export function TldPreferenceSelector({
  value,
  onChange,
}: {
  value: TldPreference
  onChange: (next: TldPreference) => void
}) {
  const anySelected = isAnySelected(value)
  const selectedTlds = anySelected ? [] : value

  function toggleAny() {
    onChange("any")
  }

  function toggleTld(tld: string) {
    if (anySelected) {
      onChange([tld])
      return
    }

    const isSelected = selectedTlds.includes(tld)
    const next = isSelected
      ? selectedTlds.filter((item) => item !== tld)
      : [...selectedTlds, tld]

    onChange(next.length > 0 ? next : "any")
  }

  const chipClass = (pressed: boolean) =>
    cn(
      "inline-flex min-w-0 flex-1 items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-semibold leading-none transition-colors",
      pressed
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-transparent text-foreground hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
    )

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        TLD preference
      </Label>
      <div
        role="group"
        aria-label="TLD preference"
        className="flex flex-wrap gap-1.5 sm:flex-nowrap"
      >
        <button
          type="button"
          aria-pressed={anySelected}
          onClick={toggleAny}
          className={chipClass(anySelected)}
        >
          Any
        </button>

        {SUPPORTED_TLDS.map((tld) => {
          const pressed = !anySelected && selectedTlds.includes(tld)

          return (
            <button
              key={tld}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggleTld(tld)}
              className={chipClass(pressed)}
            >
              {tld}
            </button>
          )
        })}
      </div>
    </div>
  )
}
