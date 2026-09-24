import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  RECENT_SEARCHES_CHANGE_EVENT,
  removeRecentSearch,
  type RecentSearchInput,
  type RecentSearchItem,
} from "@/lib/recent-search-storage"
import { useCallback, useEffect, useState } from "react"

export function useRecentSearches() {
  const [items, setItems] = useState<RecentSearchItem[]>([])

  const refresh = useCallback(() => {
    setItems(getRecentSearches())
  }, [])

  useEffect(() => {
    refresh()

    function handleStorage(event: StorageEvent) {
      if (event.key === "namegenius-recent-searches") {
        refresh()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener(RECENT_SEARCHES_CHANGE_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(RECENT_SEARCHES_CHANGE_EVENT, refresh)
    }
  }, [refresh])

  const add = useCallback((input: RecentSearchInput) => {
    const next = addRecentSearch(input)
    setItems(next)
    return next
  }, [])

  const remove = useCallback((id: string) => {
    const next = removeRecentSearch(id)
    setItems(next)
    return next
  }, [])

  const clear = useCallback(() => {
    clearRecentSearches()
    setItems([])
  }, [])

  return {
    items,
    count: items.length,
    add,
    remove,
    clear,
    refresh,
  }
}
