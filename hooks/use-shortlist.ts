import type { NameSuggestion } from "@/lib/mock-data"
import {
  clearShortlist,
  getShortlist,
  removeFromShortlist,
  SHORTLIST_CHANGE_EVENT,
  toggleShortlist,
  type ShortlistItem,
} from "@/lib/shortlist-storage"
import { useCallback, useEffect, useState } from "react"

export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>([])

  const refresh = useCallback(() => {
    setItems(getShortlist())
  }, [])

  useEffect(() => {
    refresh()

    function handleStorage(event: StorageEvent) {
      if (event.key === "namegenius-shortlist") {
        refresh()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener(SHORTLIST_CHANGE_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, refresh)
    }
  }, [refresh])

  const toggle = useCallback(
    (suggestion: NameSuggestion) => {
      const next = toggleShortlist(suggestion)
      setItems(next)
      return next
    },
    []
  )

  const remove = useCallback((id: string) => {
    const next = removeFromShortlist(id)
    setItems(next)
    return next
  }, [])

  const clear = useCallback(() => {
    clearShortlist()
    setItems([])
  }, [])

  const isSaved = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  )

  return {
    items,
    count: items.length,
    toggle,
    remove,
    clear,
    isSaved,
    refresh,
  }
}
