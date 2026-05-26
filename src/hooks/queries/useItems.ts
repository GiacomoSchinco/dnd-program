import { useMemo } from 'react'
import type { Item, ItemType } from '@/types/item'

type UseItemsParams = {
  type?: ItemType
  search?: string
}

type UseItemsResult = {
  data: Item[]
  isLoading: boolean
}

const FALLBACK_ITEMS: Item[] = []

export function useItems(params: UseItemsParams = {}): UseItemsResult {
  const filtered = useMemo(() => {
    const q = (params.search ?? '').trim().toLowerCase()

    return FALLBACK_ITEMS.filter((item) => {
      const matchesType = params.type ? item.type === params.type : true
      const matchesSearch = q ? item.name.toLowerCase().includes(q) : true
      return matchesType && matchesSearch
    })
  }, [params.search, params.type])

  return { data: filtered, isLoading: false }
}

export function useItem(id?: number | null) {
  const item = useMemo(() => {
    if (!id) return null
    return FALLBACK_ITEMS.find((candidate) => candidate.id === id) ?? null
  }, [id])

  return { data: item, isLoading: false }
}
