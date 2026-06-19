import Dexie, { Table } from 'dexie';
import { seedMonsters, loadSeedSpells } from './seedData';
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

export { seedMonsters, loadSeedSpells, CombatStatus, CharacterRaces, CharacterClasses, SpellSchools };

export class CastleKeeperDB extends Dexie {
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

    this.version(4).stores({
      activeCombat: 'id',
      combats: '++id, date, name, campaignId',
      monsters: '++id, name, cr',
      campaigns: '++id, name, description',
      characters: '++id, campaignId, name, class',
      spells: '++id, name, level, school',
      npcs: '++id, name',
    }).upgrade(async (trans) => {
      const chars: Character[] = await trans.table('characters').toArray();
      for (const char of chars) {
        const maxHp = Math.max(Number(char.maxHp) || 0, Number(char.hp) || 0) || 1;
        const rawCurrent = char.currentHp;
        const currentHp = rawCurrent == null || Number.isNaN(Number(rawCurrent))
          ? maxHp
          : Math.max(0, Math.min(maxHp, Number(rawCurrent)));
        await trans.table('characters').update(char.id, { currentHp, maxHp });
      }
    });
  }
}

export const db = new CastleKeeperDB();
