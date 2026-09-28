import { applyBrandMatch, type BrandInputs } from "./brand-match"
import { buildDomainFieldsFromRdap } from "./domain-rdap"
import {
  generateNamesFromGemini,
  GeminiGenerationError,
  GeminiQuotaError,
} from "./gemini-names"
import { sortByTldPreference, type NameSuggestion } from "./mock-data"
import type { TldPreference } from "./search-params"

export type SuggestionsErrorCode = "QUOTA_EXHAUSTED" | "GENERATION_FAILED"

export interface SuggestionsResult {
  suggestions?: NameSuggestion[]
  error?: string
  code?: SuggestionsErrorCode
}

export async function generateLiveSuggestions(
  inputs: BrandInputs,
  tlds: TldPreference,
  seed: number
): Promise<SuggestionsResult> {
  try {
    const candidates = await generateNamesFromGemini(inputs, tlds, seed)

    const suggestions: NameSuggestion[] = await Promise.all(
      candidates.map(async (candidate, index) => {
        const domainFields = await buildDomainFieldsFromRdap(candidate.name, tlds)

        return {
          id: `${seed}-${domainFields.primaryDomain.replace(/\.[a-z]+$/, "")}-${index}`,
          name: candidate.name,
          matchContext: candidate.matchContext,
          ...domainFields,
          brandMatch: 0,
        }
      })
    )

    const withScores = applyBrandMatch(suggestions, inputs, seed)

    return {
      suggestions: tlds === "any" ? withScores : sortByTldPreference(withScores),
    }
  } catch (error) {
    if (error instanceof GeminiQuotaError) {
      return {
        error:
          "You've reached today's Gemini limit on this key. Try again tomorrow or use a different key.",
        code: "QUOTA_EXHAUSTED",
      }
    }

    if (error instanceof GeminiGenerationError) {
      return {
        error: error.message,
        code: "GENERATION_FAILED",
      }
    }

    return {
      error: "Something went wrong generating names. Try again.",
      code: "GENERATION_FAILED",
    }
  }
}
