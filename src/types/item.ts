export type ItemType =
  | 'weapon'
  | 'armor'
  | 'gear'
  | 'consumable'
  | 'ammunition'
  | 'tool'
  | 'currency'

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very rare'
  | 'legendary'
  | 'artifact'

export type CurrencyType = 'po' | 'pa' | 'pr' | 'pe' | 'mo'

export type DamageType =
  | 'tagliente'
  | 'perforante'
  | 'contundente'
  | 'acido'
  | 'freddo'
  | 'fuoco'
  | 'fulmine'
  | 'necrotico'
  | 'psichico'
  | 'radioso'
  | 'veleno'
  | 'tuono'
  | 'forza'

export type WeaponProperties = {
  itemType?: 'weapon'
  damage?: string
  damageType?: DamageType
  properties?: string[]
  range?: string
  [key: string]: unknown
}

export type ArmorProperties = {
  itemType?: 'armor'
  armorClass?: number
  armorType?: string
  addsDexModifier?: boolean
  strengthRequirement?: number
  properties?: string[]
  [key: string]: unknown
}

export type ConsumableProperties = {
  itemType?: 'consumable'
  properties?: string[]
  [key: string]: unknown
}

export type AmmunitionProperties = {
  itemType?: 'ammunition'
  properties?: string[]
  [key: string]: unknown
}

export type ToolProperties = {
  itemType?: 'tool'
  properties?: string[]
  [key: string]: unknown
}

export type GearProperties = {
  itemType?: 'gear'
  properties?: string[]
  [key: string]: unknown
}

export type ItemProperties =
  | WeaponProperties
  | ArmorProperties
  | ConsumableProperties
  | AmmunitionProperties
  | ToolProperties
  | GearProperties

export type Item = {
  id: number
  name: string
  type: ItemType
  weight?: number
  value?: number
  currency?: CurrencyType
  rarity?: Rarity
  description?: string | null
  properties?: ItemProperties | Record<string, unknown> | null
  quantity?: number
  equipped?: boolean
  [key: string]: unknown
}

export type PickerItemData = {
  id: number
  name: string
  type: ItemType | ''
  weight: number
  value: number
  currency: CurrencyType
  description?: string | null
  properties?: Record<string, unknown> | null
}

export type CreateItemDTO = {
  id?: number
  name: string
  type: ItemType
  weight: number
  value: number
  currency: CurrencyType
  rarity: Rarity
  requires_attunement: boolean
  category: string | null
  description: string | null
  properties: ItemProperties | null
}
