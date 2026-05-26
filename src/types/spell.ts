export type SpellSchool =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation'
  | string

export type Spell = {
  id?: number | string
  name: string
  level?: number
  school?: SpellSchool
  description?: string
  classes?: string[]
  [key: string]: unknown
}
