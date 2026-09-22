import type { NameSuggestion } from "./mock-data"

export interface CompareItem extends NameSuggestion {
  addedAt: string
}

export const COMPARE_MAX_ITEMS = 4

const STORAGE_KEY = "namegenius-compare"
export const COMPARE_CHANGE_EVENT = "namegenius-compare-change"

function notifyCompareChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(COMPARE_CHANGE_EVENT))
}

function readCompare(): CompareItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CompareItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCompare(items: CompareItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getCompare(): CompareItem[] {
  return readCompare()
}

export function isComparing(id: string): boolean {
  return readCompare().some((item) => item.id === id)
}

export function toggleCompare(suggestion: NameSuggestion): CompareItem[] {
  const current = readCompare()
  const exists = current.some((item) => item.id === suggestion.id)

  if (!exists && current.length >= COMPARE_MAX_ITEMS) {
    return current
  }

  const next = exists
    ? current.filter((item) => item.id !== suggestion.id)
    : [
        {
          ...suggestion,
          addedAt: new Date().toISOString(),
        },
        ...current,
      ]

  writeCompare(next)
  notifyCompareChange()
  return next
}

export function removeFromCompare(id: string): CompareItem[] {
  const next = readCompare().filter((item) => item.id !== id)
  writeCompare(next)
  notifyCompareChange()
  return next
}

export function clearCompare(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  notifyCompareChange()
}
