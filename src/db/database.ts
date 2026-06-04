import Dexie, { Table } from 'dexie';
import { seedMonsters, seedSpells } from './seedData';
import type {
  Campaign,
  Character,
  Combat,
  ActiveCombat,
  Monster,
  Npc,
  Spell
} from '../types';
import {
  CombatStatus,
  CharacterRaces,
  CharacterClasses,
  SpellSchools
} from '../types';

export { seedMonsters, seedSpells, CombatStatus, CharacterRaces, CharacterClasses, SpellSchools };

export class DnDCombatDB extends Dexie {
  activeCombat!: Table<ActiveCombat, string>;
  combats!: Table<Combat, number>;
  campaigns!: Table<Campaign, number>;
  characters!: Table<Character, number>;
  monsters!: Table<Monster, number>;
  npcs!: Table<Npc, number>;
  spells!: Table<Spell, number>;

  constructor() {
    super('DnDCombatDB');
    
    this.version(1).stores({
      activeCombat: 'id',
      combats: '++id, date, name',
      monsters: '++id, name',
    });

    this.version(2).stores({
      activeCombat: 'id',
      combats: '++id, date, name, campaignId',
      monsters: '++id, name, cr',
      campaigns: '++id, name, description',
      characters: '++id, campaignId, name, class',
      spells: '++id, name, level, school',
    }).upgrade(async (trans) => {
      const combats = await trans.table('combats').toArray();
      for (const combat of combats) {
        if (!combat.campaignId) {
          await trans.table('combats').update(combat.id, { campaignId: null });
        }
      }
    });

    this.version(3).stores({
      activeCombat: 'id',
      combats: '++id, date, name, campaignId',
      monsters: '++id, name, cr',
      campaigns: '++id, name, description',
      characters: '++id, campaignId, name, class',
      spells: '++id, name, level, school',
      npcs: '++id, name',
    });
  }
}

export const db = new DnDCombatDB();
