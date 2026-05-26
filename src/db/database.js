import Dexie from 'dexie'

export const db = new Dexie('DnDCombatDB')

db.version(1).stores({
  activeCombat: 'id',
  combats: '++id, date, name',
  monsters: '++id, name',
})

db.version(2).stores({
  activeCombat: 'id',
  combats: '++id, date, name',
  monsters: '++id, name',
  campaigns: '++id, name',
  characters: '++id, campaignId, name',
  spells: '++id, name, level, school',
})
