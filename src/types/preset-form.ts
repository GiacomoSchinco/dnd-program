export type EquipmentItemForm = {
  itemId?: number
  quantity?: number
  [key: string]: unknown
}

export type EquipmentChoiceForm = {
  id?: string | number
  label?: string
  options?: EquipmentItemForm[]
  [key: string]: unknown
}
