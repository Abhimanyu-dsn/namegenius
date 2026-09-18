import type { DomainStatus, NameSuggestion, TldOption } from "./mock-data"

export function getCardDisplayDomain(suggestion: NameSuggestion): {
  slug: string
  tld: string
  domain: string
  status: DomainStatus
} {
  const slug = suggestion.primaryDomain.replace(/\.com$/, "")
  const preferred =
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
