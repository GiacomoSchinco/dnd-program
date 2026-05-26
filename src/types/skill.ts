export type Skill = {
  id?: string | number
  name: string
  ability?: string
  proficient?: boolean
  expertise?: boolean
  value?: number
  [key: string]: unknown
}
