import type { ItemType } from './item'

export type InventoryItem = {
  id: string | number
  item_id?: number
  character_id?: string | number
  name: string
  type?: ItemType | string
  quantity?: number
  equipped?: boolean
  description?: string | null
  weight?: number
  properties?: Record<string, unknown> | null
  [key: string]: unknown
}
