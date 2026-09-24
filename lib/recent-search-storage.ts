import { serializeTldPreference, type TldPreference } from "./search-params"

export interface RecentSearchItem {
  id: string
  concept: string
  competitors: string
  description: string
  tlds: TldPreference
  searchedAt: string
}

export type RecentSearchInput = Pick<
  RecentSearchItem,
  "concept" | "competitors" | "description" | "tlds"
>

const STORAGE_KEY = "namegenius-recent-searches"
export const RECENT_SEARCHES_CHANGE_EVENT = "namegenius-recent-searches-change"
export const MAX_RECENT_SEARCHES = 10

function notifyRecentSearchesChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(RECENT_SEARCHES_CHANGE_EVENT))
}

function readRecentSearches(): RecentSearchItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentSearchItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRecentSearches(items: RecentSearchItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function dedupeKey(input: RecentSearchInput): string {
  return [
    input.concept.trim().toLowerCase(),
    input.description.trim().toLowerCase(),
    input.competitors.trim().toLowerCase(),
    serializeTldPreference(input.tlds),
  ].join("|")
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getRecentSearches(): RecentSearchItem[] {
  return readRecentSearches()
}

export function addRecentSearch(input: RecentSearchInput): RecentSearchItem[] {
  const current = readRecentSearches()
  const key = dedupeKey(input)
  const existing = current.find((item) => dedupeKey(item) === key)

  const entry: RecentSearchItem = {
    id: existing?.id ?? generateId(),
    concept: input.concept,
    competitors: input.competitors,
    description: input.description,
    tlds: input.tlds,
    searchedAt: new Date().toISOString(),
  }

  const withoutExisting = current.filter((item) => dedupeKey(item) !== key)
  const next = [entry, ...withoutExisting].slice(0, MAX_RECENT_SEARCHES)

  writeRecentSearches(next)
  notifyRecentSearchesChange()
  return next
}

export function removeRecentSearch(id: string): RecentSearchItem[] {
  const next = readRecentSearches().filter((item) => item.id !== id)
  writeRecentSearches(next)
  notifyRecentSearchesChange()
  return next
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  notifyRecentSearchesChange()
}
