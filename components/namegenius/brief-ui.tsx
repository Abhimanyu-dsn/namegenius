"use client"

import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function BriefHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-sans text-[clamp(2rem,6vw,3.75rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
      {children}
    </h1>
  )
}

export function BriefSubtext({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-lg font-mono text-xs uppercase leading-relaxed tracking-[0.1em] text-landing-fg sm:text-sm">
      {children}
    </p>
  )
}

export function BriefInputField({
  id,
  value,
  onChange,
  placeholder,
  onSubmit,
  multiline = false,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  onSubmit?: () => void
  multiline?: boolean
}) {
  const sharedClass =
    "w-full min-w-0 flex-1 resize-none bg-transparent font-mono text-sm text-landing-fg placeholder:text-landing-muted outline-none sm:text-base"

  return (
    <div className="mt-8 flex items-stretch rounded-xl border border-landing-fg/80 bg-transparent">
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(sharedClass, "min-h-[120px] px-5 py-4")}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onSubmit) {
              event.preventDefault()
              onSubmit()
            }
          }}
          className={cn(sharedClass, "h-14 px-5")}
        />
      )}

      <div className="flex w-14 shrink-0 items-center justify-center border-l border-landing-fg/30">
        <button
          type="button"
          onClick={onSubmit}
          aria-label="Continue"
          className="text-landing-fg transition-opacity hover:opacity-70"
        >
          <ArrowRight className="size-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

export function BriefChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border border-landing-fg px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors sm:text-sm",
        selected
          ? "bg-landing-cta-bg text-landing-cta-fg"
          : "bg-transparent text-landing-fg hover:bg-landing-fg/10"
      )}
    >
      {label}
    </button>
  )
}

export function BriefContinueButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-landing-cta-bg px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.15em] text-landing-cta-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
    >
      {label}
      <ArrowRight className="size-4" strokeWidth={2} />
    </button>
  )
}

export function BriefSkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-landing-fg underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
    >
      Skip
    </button>
  )
}
