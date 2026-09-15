import type { BrandInputs } from "./brand-match"
import { SUPPORTED_TLDS } from "./mock-data"

/**
 * Brief fields encoded in the URL between S1 (BriefPage) and S2 (ResultsPage).
 * BriefPage form state, buildResultsUrl, buildHomeUrl, and parseResultsSearchParams
 * must all read/write these keys together.
 */
export const BRIEF_PARAM_KEYS = [
  "concept",
  "competitors",
  "description",
  "tlds",
] as const

export type TldPreference = "any" | string[]

export interface SearchParams {
  concept: string
  competitors: string
  description: string
  tlds: TldPreference
  seed: number
}

export function parseTldPreference(value: string | null | undefined): TldPreference {
  if (!value || value === "any") {
    return "any"
  }

  const selected = value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => SUPPORTED_TLDS.includes(part as (typeof SUPPORTED_TLDS)[number]))

  return selected.length > 0 ? selected : "any"
}

export function serializeTldPreference(tlds: TldPreference): string {
  if (tlds === "any") {
    return "any"
  }

  return tlds.join(",")
}

export function formatTldPreferenceLabel(tlds: TldPreference): string {
  if (tlds === "any") {
    return "Any TLD"
  }

  return tlds.join(", ")
}

export function parseResultsSearchParams(
  searchParams: URLSearchParams
): SearchParams | null {
  if (searchParams.toString().length === 0) {
    return null
  }

  const seed = Number(searchParams.get("seed") ?? "0")

  return {
    concept: searchParams.get("concept") ?? "",
    competitors: searchParams.get("competitors") ?? "",
    description: searchParams.get("description") ?? "",
    tlds: parseTldPreference(searchParams.get("tlds")),
    seed: Number.isFinite(seed) && seed >= 0 ? seed : 0,
  }
}

export function toBrandInputs(params: SearchParams): BrandInputs {
  return {
    concept: params.concept,
    competitors: params.competitors,
    description: params.description,
  }
}

export function buildResultsUrl(
  params: Pick<SearchParams, "concept" | "competitors" | "description" | "tlds"> & {
    seed?: number
  }
): string {
  const query = new URLSearchParams()

  if (params.concept) {
    query.set("concept", params.concept)
  }
  if (params.competitors) {
    query.set("competitors", params.competitors)
  }
  if (params.description) {
    query.set("description", params.description)
  }

  query.set("tlds", serializeTldPreference(params.tlds))

  if (params.seed && params.seed > 0) {
    query.set("seed", String(params.seed))
  }

  return `/results?${query.toString()}`
}

export function buildHomeUrl(
  params: Pick<SearchParams, "concept" | "competitors" | "description" | "tlds">
): string {
  const query = new URLSearchParams()
  query.set("step", "1")

  if (params.concept) {
    query.set("concept", params.concept)
  }
  if (params.competitors) {
    query.set("competitors", params.competitors)
  }
  if (params.description) {
    query.set("description", params.description)
  }

  query.set("tlds", serializeTldPreference(params.tlds))

  const queryString = query.toString()
  return `/brief?${queryString}`
}
