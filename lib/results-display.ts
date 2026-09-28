import type { TldPreference } from "./search-params"
import type { DomainStatus, NameSuggestion, TldOption } from "./mock-data"

export function isPreferredTld(tld: string, preference: TldPreference): boolean {
  return preference !== "any" && preference.includes(tld)
}

export function getCardDisplayDomain(
  suggestion: NameSuggestion,
  preferredTlds: TldPreference = "any"
): {
  slug: string
  tld: string
  domain: string
  status: DomainStatus
} {
  const slug = suggestion.primaryDomain.replace(/\.[a-z0-9-]+$/i, "")
  let preferred: TldOption | undefined
  if (preferredTlds !== "any") {
    preferred =
      preferredTlds
        .map((tld) => suggestion.tldOptions.find((o) => o.tld === tld))
        .find((o) => o?.status === "available") ??
      preferredTlds
        .map((tld) => suggestion.tldOptions.find((o) => o.tld === tld))
        .find(Boolean)
  }
  preferred ??=
    suggestion.tldOptions.find((option) => option.tld === ".com") ??
    suggestion.tldOptions[0]

  if (preferred) {
    return {
      slug,
      tld: preferred.tld,
      domain: `${slug}${preferred.tld}`,
      status: preferred.status,
    }
  }

  return {
    slug,
    tld: ".com",
    domain: suggestion.primaryDomain,
    status: suggestion.domainStatus,
  }
}

export function formatKeywordLine(matchContext: string): string {
  const words = matchContext
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 3)

  if (words.length === 0) {
    return "Visual • Playful • Memorable"
  }

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" • ")
}

export interface ChecklistItem {
  label: string
  passed: boolean
}

export function buildChecklist(
  suggestion: NameSuggestion,
  preferredTld: string,
  preferredAvailable: boolean
): ChecklistItem[] {
  const score = suggestion.brandMatch

  return [
    { label: "Relevant to your idea", passed: score >= 50 },
    { label: "Memorable and distinctive", passed: score >= 70 },
    { label: "Easy to pronounce", passed: true },
    { label: "Matches your keywords", passed: score >= 60 },
    {
      label: `${preferredTld} available`,
      passed: preferredAvailable,
    },
  ]
}

export function formatTldStatusLabel(option: TldOption): string {
  if (option.status === "available") return "Available"
  if (option.status === "taken") return "Taken"
  return "Unavailable"
}

export function getTldStatusDotClass(status: DomainStatus): string {
  if (status === "available") return "bg-results-accent"
  if (status === "taken") return "bg-results-danger"
  return "bg-landing-muted/50"
}

const COMPARE_AVATAR_CLASSES = [
  "bg-compare-avatar-a/15 border-compare-avatar-a/50 text-compare-avatar-a",
  "bg-compare-avatar-b/15 border-compare-avatar-b/50 text-compare-avatar-b",
  "bg-compare-avatar-c/15 border-compare-avatar-c/50 text-compare-avatar-c",
]

export function getCompareAvatarClass(index: number): string {
  return COMPARE_AVATAR_CLASSES[index % COMPARE_AVATAR_CLASSES.length]
}
