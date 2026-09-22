import type { NameSuggestion, TldOption } from "./mock-data"

export type Tier = "High" | "Moderate" | "Low"
export type EaseTier = "Easy" | "Moderate" | "Hard"
export type FitTier = "Strong" | "Moderate" | "Weak"

function bareName(name: string): string {
  return name.replace(/[^a-zA-Z]/g, "").toLowerCase()
}

/** Real, direct measurement — character count of the name. */
export function getNameLength(name: string): number {
  return name.length
}

/** Real, direct measurement — "available / total" across the suggestion's TLD options. */
export function getDomainAvailabilityFraction(tldOptions: TldOption[]): {
  available: number
  total: number
  label: string
} {
  const available = tldOptions.filter((option) => option.status === "available").length
  const total = tldOptions.length
  return { available, total, label: `${available}/${total} available` }
}

/**
 * Heuristic, not AI-verified: counts consonant clusters of 3+ letters in a row.
 * 0 clusters -> Easy, 1 -> Moderate, 2+ -> Hard.
 */
export function getPronunciationEase(name: string): EaseTier {
  const letters = bareName(name)
  const clusters = letters.match(/[^aeiou]{3,}/g) ?? []
  if (clusters.length === 0) return "Easy"
  if (clusters.length === 1) return "Moderate"
  return "Hard"
}

/**
 * Heuristic, not AI-verified: shorter names with no repeated 3-letter chunk
 * are easier to remember. Length <=8 and no repeat -> High; <=12 -> Moderate; else Low.
 */
export function getMemorability(name: string): Tier {
  const letters = bareName(name)
  const chunks = new Set<string>()
  let hasRepeat = false
  for (let i = 0; i + 3 <= letters.length; i++) {
    const chunk = letters.slice(i, i + 3)
    if (chunks.has(chunk)) {
      hasRepeat = true
      break
    }
    chunks.add(chunk)
  }

  if (letters.length <= 8 && !hasRepeat) return "High"
  if (letters.length <= 12) return "Moderate"
  return "Low"
}

/**
 * Derived from the existing brandMatch score (not an independent signal) —
 * reuses the same thresholds as buildChecklist in results-display.ts.
 */
export function getIndustryFit(brandMatch: number): FitTier {
  if (brandMatch >= 70) return "Strong"
  if (brandMatch >= 50) return "Moderate"
  return "Weak"
}

/**
 * Heuristic, not AI-verified: ratio of distinct letters to total letters.
 * Higher ratio (less repetition) reads as more unique.
 */
export function getUniqueness(name: string): Tier {
  const letters = bareName(name)
  if (letters.length === 0) return "Low"
  const distinct = new Set(letters).size
  const ratio = distinct / letters.length
  if (ratio >= 0.75) return "High"
  if (ratio >= 0.55) return "Moderate"
  return "Low"
}

export interface StrengthsAndWeaknesses {
  strengths: string[]
  weaknesses: string[]
}

/** Combines the heuristics above into short, real-data-backed bullet strings. */
export function getStrengthsAndWeaknesses(
  suggestion: NameSuggestion
): StrengthsAndWeaknesses {
  const strengths: string[] = []
  const weaknesses: string[] = []

  const fit = getIndustryFit(suggestion.brandMatch)
  if (fit === "Strong") strengths.push("Strong brand match score")
  else weaknesses.push("Brand match score could be stronger")

  const domain = getDomainAvailabilityFraction(suggestion.tldOptions)
  if (domain.available === domain.total) strengths.push("All checked domains available")
  else if (domain.available === 0) weaknesses.push("No checked domains currently available")

  const pronunciation = getPronunciationEase(suggestion.name)
  if (pronunciation === "Easy") strengths.push("Easy to pronounce")
  else if (pronunciation === "Hard") weaknesses.push("Harder to pronounce at a glance")

  const memorability = getMemorability(suggestion.name)
  if (memorability === "High") strengths.push("Short and memorable")
  else if (memorability === "Low") weaknesses.push("Longer name, may be harder to recall")

  const uniqueness = getUniqueness(suggestion.name)
  if (uniqueness === "High") strengths.push("Distinctive letter mix")
  else if (uniqueness === "Low") weaknesses.push("Repetitive letter mix")

  return { strengths, weaknesses }
}
