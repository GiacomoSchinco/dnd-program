import Dexie from 'dexie';
import { seedMonsters, seedSpells } from './seedData';

export { seedMonsters, seedSpells };
export const db = new Dexie('DnDCombatDB');

// Versione 1: Struttura base
db.version(1).stores({
  activeCombat: 'id',
  combats: '++id, date, name',
  monsters: '++id, name',
});

// Versione 2: Aggiunta campagne, personaggi e incantesimi
db.version(2).stores({
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

// Versione 3: Aggiunta libreria NPC
db.version(3).stores({
  activeCombat: 'id',
  combats: '++id, date, name, campaignId',
  monsters: '++id, name, cr',
  campaigns: '++id, name, description',
  characters: '++id, campaignId, name, class',
  spells: '++id, name, level, school',
  npcs: '++id, name',
});

export const CombatStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ENDED: 'ended'
};

// Esporta tipi (utile per React)
export const CharacterRaces = [
  // Razze Base (Player's Handbook)
  'Umano',
  'Elfo del Bosco',
  'Alto Elfo',
  'Elfo Oscuro (Drow)',
  'Nano delle Colline',
  'Nano delle Montagne',
  'Halfling Piediveloci',
  'Halfling Stout',
  'Gnomo delle Rocce',
  'Gnomo delle Foreste',
  'Mezzelfo',
  'Mezzorco',
  'Tiefling',
  'Draconico',
  // Razze Esotiche
  'Aarakocra',
  'Aasimar',
  'Bugbear',
  'Cambion',
  'Centauro',
  'Changeling',
  'Firbolg',
  'Genasi del Fuoco',
  'Genasi dell\'Acqua',
  'Genasi della Terra',
  'Genasi dell\'Aria',
  'Githyanki',
  'Githzerai',
  'Goblin',
  'Goliath',
  'Hobgoblin',
  'Kalashtar',
  'Kenku',
  'Kobold',
  'Leonin',
  'Lizardfolk',
  'Loxodon',
  'Minotauro',
  'Orc',
  'Satiro',
  'Shifter',
  'Simic Hybrid',
  'Tabaxi',
  'Tortle',
  'Triton',
  'Vampiro (Dhampir)',
  'Vedalken',
  'Verdan',
  'Warforged',
  'Yuan-ti Pureblood',
  // Personalizzata
  'Personalizzata',
];

export const CharacterClasses = {
  BARBARO: 'Barbaro',
  BARDO: 'Bardo',
  CHIERICO: 'Chierico',
  DRUIDO: 'Druido',
  GUERRIERO: 'Guerriero',
  LADRO: 'Ladro',
  MAGO: 'Mago',
  PALADINO: 'Paladino',
  RANGER: 'Ranger',
  STREGONE: 'Stregone',
  WARLOCK: 'Warlock'
};

export const SpellSchools = {
  ABITURAZIONE: 'Abiurazione',
  AMMALIAMENTO: 'Ammaestramento',
  DIVINAZIONE: 'Divinazione',
  EVOCAZIONE: 'Evocazione',
  ILLUSIONE: 'Illusione',
  INVOCAZIONE: 'Invocazione',
  NECROMANZIA: 'Necromanzia',
  TRASMUTAZIONE: 'Trasmutazione'
};