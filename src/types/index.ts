export interface Character {
  id?: number;
  campaignId?: number | null;
  name: string;
  class?: string;
  race?: string;
  level?: number;
  hp: number;
  maxHp: number;
  currentHp?: number;
  ac?: number;
  initiative?: number;
  notes?: string;
}

export interface Monster {
  id?: number;
  name: string;
  cr?: string | number;
  hp?: number;
  maxHp?: number;
  ac?: number;
  initiative?: number;
  type?: string;
  size?: string;
  alignment?: string;
  armorClass?: string;
  hitPoints?: string;
  speed?: string;
  abilities?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  savingThrows?: string;
  skills?: string;
  damageVulnerabilities?: string;
  damageResistances?: string;
  damageImmunities?: string;
  conditionImmunities?: string;
  senses?: string;
  languages?: string;
  challenge?: string;
  specialAbilities?: string;
  actions?: string;
  legendaryActions?: string;
  reactions?: string;
  damage?: string;
  description?: string;
}

export interface Npc {
  id?: number;
  name: string;
  race?: string;
  class?: string;
  level?: number;
  hp?: number;
  maxHp?: number;
  ac?: number;
  initiative?: number;
  notes?: string;
  description?: string;
}

export interface Spell {
  id?: number;
  name: string;
  level: number;
  school: string;
  classes?: string;
  casting?: string;
  range?: string;
  components?: string;
  duration?: string;
  description?: string;
  upgrade?: string;
  material?: string;
  concentration?: boolean;
  ritual?: boolean;
  damage?: string;
  save?: string;
}

export interface CombatParticipant {
  id: string;
  name: string;
  type: 'pc' | 'npc' | 'monster';
  characterId?: number;
  campaignId?: number | null;
  hp: number;
  maxHp: number;
  currentHp: number;
  ac?: number;
  initiative: number;
  notes?: string;
  damage?: string;
}

export interface Combat {
  id?: number;
  name: string;
  date: string;
  status: 'prepared' | 'in_progress' | 'terminated';
  participants: CombatParticipant[];
  currentTurnIndex: number;
  round: number;
  campaignId?: number | null;
}

export interface ActiveCombat {
  id: 'current';
  combatId?: number;
  campaignId?: number | null;
  name: string;
  status: 'prepared' | 'in_progress' | 'terminated';
  participants: CombatParticipant[];
  currentTurnIndex: number;
  round: number;
}

export interface Campaign {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export const CombatStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ENDED: 'ended'
} as const;

export const CharacterRaces = [
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
  'Personalizzata',
] as const;

export const CharacterClasses = {
  ARTIFICIERE: 'Artificiere',
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
} as const;

export const SpellSchools = {
  ABJURATION: 'Abjuration',
  CONJURATION: 'Conjuration',
  DIVINATION: 'Divination',
  ENCHANTMENT: 'Enchantment',
  EVOCATION: 'Evocation',
  ILLUSION: 'Illusion',
  NECROMANCY: 'Necromancy',
  TRANSMUTATION: 'Transmutation'
} as const;
