export type AbilityScores = {
  strength?: number
  dexterity?: number
  constitution?: number
  intelligence?: number
  wisdom?: number
  charisma?: number
  [key: string]: number | undefined
}

export type ProficiencyType = 'none' | 'proficient' | 'expertise' | string
