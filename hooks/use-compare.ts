import type { NameSuggestion } from "@/lib/mock-data"
import {
  clearCompare,
  COMPARE_CHANGE_EVENT,
  COMPARE_MAX_ITEMS,
  getCompare,
  removeFromCompare,
  toggleCompare,
  type CompareItem,
} from "@/lib/compare-storage"
import { useCallback, useEffect, useState } from "react"

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>([])

  const refresh = useCallback(() => {
    setItems(getCompare())
  }, [])

  useEffect(() => {
    refresh()

    function handleStorage(event: StorageEvent) {
      if (event.key === "namegenius-compare") {
        refresh()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener(COMPARE_CHANGE_EVENT, refresh)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(COMPARE_CHANGE_EVENT, refresh)
    }
  }, [refresh])

  const toggle = useCallback((suggestion: NameSuggestion) => {
    const next = toggleCompare(suggestion)
    setItems(next)
    return next
  }, [])

  const remove = useCallback((id: string) => {
    const next = removeFromCompare(id)
    setItems(next)
    return next
  }, [])

  const clear = useCallback(() => {
    clearCompare()
    setItems([])
  }, [])

  const isComparing = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  )

  return {
    items,
    count: items.length,
    toggle,
    remove,
    clear,
    isComparing,
    canAddMore: items.length < COMPARE_MAX_ITEMS,
    refresh,
  }
}
