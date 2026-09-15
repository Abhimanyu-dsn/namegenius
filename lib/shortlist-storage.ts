import type { NameSuggestion } from "./mock-data"

export interface ShortlistItem extends NameSuggestion {
  savedAt: string
}

const STORAGE_KEY = "namegenius-shortlist"
export const SHORTLIST_CHANGE_EVENT = "namegenius-shortlist-change"

function notifyShortlistChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(SHORTLIST_CHANGE_EVENT))
}

function readShortlist(): ShortlistItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ShortlistItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeShortlist(items: ShortlistItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getShortlist(): ShortlistItem[] {
  return readShortlist()
}

export function isShortlisted(id: string): boolean {
  return readShortlist().some((item) => item.id === id)
}

export function toggleShortlist(suggestion: NameSuggestion): ShortlistItem[] {
  const current = readShortlist()
  const exists = current.some((item) => item.id === suggestion.id)

  const next = exists
    ? current.filter((item) => item.id !== suggestion.id)
    : [
        {
          ...suggestion,
          savedAt: new Date().toISOString(),
        },
        ...current,
      ]

  writeShortlist(next)
  notifyShortlistChange()
  return next
}

export function removeFromShortlist(id: string): ShortlistItem[] {
  const next = readShortlist().filter((item) => item.id !== id)
  writeShortlist(next)
  notifyShortlistChange()
  return next
}

export function clearShortlist(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  notifyShortlistChange()
}
