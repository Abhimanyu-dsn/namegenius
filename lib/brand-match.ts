import type { NameSuggestion } from "./mock-data"

export interface BrandInputs {
  concept: string
  competitors: string
  description: string
}

export interface BrandMatchMeta {
  label: string
  barClass: string
  badgeClass: string
}

export function getBrandMatchMeta(score: number): BrandMatchMeta {
  if (score >= 80) {
    return {
      label: "Strong match",
      barClass: "bg-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700",
    }
  }

  if (score >= 50) {
    return {
      label: "Moderate match",
      barClass: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-700",
    }
  }

  return {
    label: "Weak match",
    barClass: "bg-red-500",
    badgeClass: "bg-red-50 text-red-600",
  }
}

function extractKeywords(competitors: string): string[] {
  return competitors
    .split(/[,;\n]+/)
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean)
}

function seededJitter(seed: number, index: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453
  return (value - Math.floor(value)) * 12 - 6
}

export function computeBrandMatch(
  suggestion: Pick<NameSuggestion, "name" | "matchContext">,
  inputs: BrandInputs,
  seed = 0,
  index = 0
): number {
  const haystack = `${suggestion.name} ${suggestion.matchContext}`.toLowerCase()
  const keywords = [
    ...extractKeywords(inputs.competitors),
    ...inputs.concept
      .split(/\s+/)
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 2),
    ...inputs.description
      .split(/\s+/)
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 4)
      .slice(0, 12),
  ]

  const uniqueKeywords = [...new Set(keywords)]
  const hits = uniqueKeywords.filter((keyword) => haystack.includes(keyword)).length
  const base = 58 + hits * 7 + seededJitter(seed, index)

  return Math.min(98, Math.max(42, Math.round(base)))
}

export function applyBrandMatch(
  suggestions: Array<Omit<NameSuggestion, "brandMatch">>,
  inputs: BrandInputs,
  seed = 0
): NameSuggestion[] {
  return suggestions.map((suggestion, index) => ({
    ...suggestion,
    brandMatch: computeBrandMatch(suggestion, inputs, seed, index),
  }))
}
