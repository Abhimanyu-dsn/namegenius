import type { ReactNode } from "react"

import {
  ArrowRight,
  Bookmark,
  Ellipsis,
  Info,
  Repeat2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress"
import { getBrandMatchMeta } from "@/lib/brand-match"
import type { DomainStatus, NameSuggestion, TldOption } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function getCardDisplayDomain(suggestion: NameSuggestion): {
  domain: string
  status: DomainStatus
} {
  const slug = suggestion.primaryDomain.replace(/\.com$/, "")
  const preferred =
    suggestion.tldOptions.find((option) => option.tld === ".com") ??
    suggestion.tldOptions[0]

  if (preferred) {
    return { domain: `${slug}${preferred.tld}`, status: preferred.status }
  }

  return {
    domain: suggestion.primaryDomain,
    status: suggestion.domainStatus,
  }
}

function IconActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="outline"
      onClick={onClick}
      aria-label={label}
      className="size-8 rounded-lg border-border bg-background text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
    >
      {children}
    </Button>
  )
}

function AvailabilityBadge({ status }: { status: DomainStatus }) {
  const available = status === "available"
  const label = available ? "Available" : "Unavailable"

  return (
    <span
      role="status"
      aria-label={`Domain ${label.toLowerCase()}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none",
        available
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          available ? "bg-emerald-500" : "bg-red-500"
        )}
        aria-hidden
      />
      {label}
    </span>
  )
}

function TldChip({ option }: { option: TldOption }) {
  const available = option.status === "available"
  const statusLabel = available ? "available" : "taken"

  return (
    <div
      role="img"
      aria-label={`${option.tld} ${statusLabel}`}
      className={cn(
        "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-1.5 py-1.5 text-center",
        available
          ? "border-emerald-200 bg-emerald-50/80"
          : "border-red-200 bg-red-50/80"
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          available ? "bg-emerald-500" : "bg-red-500"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-[11px] font-semibold leading-none",
          available ? "text-emerald-800" : "text-red-700"
        )}
      >
        {option.tld}
      </span>
    </div>
  )
}

export function SuggestionCard({
  suggestion,
  isSaved = false,
  onToggleSave,
  onCheckAvailability,
  onMoreLikeThis,
  onOptions,
}: {
  suggestion: NameSuggestion
  isSaved?: boolean
  onToggleSave?: () => void
  onCheckAvailability?: () => void
  onMoreLikeThis?: () => void
  onOptions?: () => void
}) {
  const matchMeta = getBrandMatchMeta(suggestion.brandMatch)
  const displayDomain = getCardDisplayDomain(suggestion)
  const matchHintId = `brand-match-hint-${suggestion.id}`

  return (
    <Card className="flex flex-col overflow-hidden border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="truncate text-xl font-semibold leading-tight tracking-tight text-foreground">
              {displayDomain.domain}
            </h3>
            <AvailabilityBadge status={displayDomain.status} />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {onToggleSave ? (
              <IconActionButton
                label={
                  isSaved
                    ? `Remove ${displayDomain.domain} from shortlist`
                    : `Save ${displayDomain.domain} to shortlist`
                }
                onClick={onToggleSave}
              >
                <Bookmark
                  className={cn(
                    "size-4",
                    isSaved
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </IconActionButton>
            ) : null}
            <IconActionButton
              label={`More options for ${displayDomain.domain}`}
              onClick={onOptions}
            >
              <Ellipsis className="size-4" />
            </IconActionButton>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Brand match
              </span>
              <button
                type="button"
                className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Why ${suggestion.name} scored ${suggestion.brandMatch}% brand match`}
                aria-describedby={matchHintId}
                title={suggestion.matchContext}
              >
                <Info className="size-3.5" />
              </button>
              <span id={matchHintId} className="sr-only">
                {suggestion.matchContext}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {suggestion.brandMatch}%
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none",
                  matchMeta.badgeClass
                )}
              >
                {matchMeta.label}
              </span>
            </div>
          </div>

          <Progress
            value={suggestion.brandMatch}
            className="gap-0"
            aria-label={`Brand match ${suggestion.brandMatch}%`}
          >
            <ProgressTrack className="h-1.5 bg-muted">
              <ProgressIndicator
                className={cn("rounded-full", matchMeta.barClass)}
              />
            </ProgressTrack>
          </Progress>
        </div>

        <div className="flex gap-1.5">
          {suggestion.tldOptions.map((option) => (
            <TldChip key={option.tld} option={option} />
          ))}
        </div>

        <div className="flex gap-2 border-t border-border pt-4">
          <Button
            type="button"
            onClick={onCheckAvailability}
            className="h-10 min-w-0 flex-1 rounded-lg bg-foreground px-2 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            <span className="flex w-full min-w-0 items-center justify-between gap-1">
              <span className="truncate">Check availability</span>
              <ArrowRight className="size-3.5 shrink-0" />
            </span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onMoreLikeThis}
            className="h-10 min-w-0 flex-1 rounded-lg border-border bg-background px-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            <span className="flex w-full min-w-0 items-center justify-between gap-1">
              <span className="truncate">More like this</span>
              <Repeat2 className="size-3.5 shrink-0 text-muted-foreground" />
            </span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
