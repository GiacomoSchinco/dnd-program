import type { Spell } from '../types';

// ── Mapping scuole (lowercase inglese → capitalized inglese) ─────────────

const SCHOOL_MAP: Record<string, string> = {
  abjuration:    'Abjuration',
  conjuration:   'Conjuration',
  divination:    'Divination',
  enchantment:   'Enchantment',
  evocation:     'Evocation',
  illusion:      'Illusion',
  necromancy:    'Necromancy',
  transmutation: 'Transmutation',
};

// ── Mapping tempi di lancio ───────────────────────────────────────────────

const CASTING_TIME_MAP: Record<string, string> = {
  action:       '1 azione',
  bonusaction:  '1 azione bonus',
  minute:       '1 minuto',
  hour:         '1 ora',
  '10minutes':  '10 minuti',
  '8hours':     '8 ore',
  '12hours':    '12 ore',
  '24hours':    '24 ore',
};

// ── Interfaccia del nuovo JSON ────────────────────────────────────────────

interface RawSpell {
  name: string;
  level: number;
  school: string;
  classes: string[];
  casting: string;
  components: string[];
  material?: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  range: string;
  damage?: string;
  save?: string;
  upgrade?: string;
  description: string;
}

// ── Mapper principale ─────────────────────────────────────────────────────

/**
 * Converte un array di magie dal nuovo formato JSON
 * nel formato `Omit<Spell, 'id'>` usato dall'applicazione.
 */
export function mapSpellsJson(raw: RawSpell[]): Omit<Spell, 'id'>[] {
  return raw.map((s) => ({
    name:          s.name,
    level:         s.level,
    school:        SCHOOL_MAP[s.school] || s.school,
    classes:       s.classes?.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || '',
    casting:       CASTING_TIME_MAP[s.casting] || s.casting || '',
    range:         s.range || '',
    components:    s.components?.join(', ') || '',
    material:      s.material || '',
    duration:      s.duration || '',
    concentration: !!s.concentration,
    ritual:        !!s.ritual,
    damage:        s.damage || '',
    save:          s.save || '',
    upgrade:       s.upgrade || '',
    description:   s.description || '',
  }));
}

/**
 * Carica lo spells.json da `public/` e lo converte nel formato Spell.
 * Usa cache statica per evitare fetch multipli.
 */
let _cachedSpells: Omit<Spell, 'id'>[] | null = null;

export async function loadSeedSpells(): Promise<Omit<Spell, 'id'>[]> {
  if (_cachedSpells) return _cachedSpells;

  const base = import.meta.env.BASE_URL || '/';
  const res = await fetch(`${base}spells.json`);
  if (!res.ok) {
    throw new Error(`Impossibile caricare spells.json (${res.status})`);
  }
  const raw: RawSpell[] = await res.json();
  _cachedSpells = mapSpellsJson(raw);
  return _cachedSpells;
}

/**
 * Resetta la cache (utile per i test o reset forzato).
 */
export function clearSpellsCache(): void {
  _cachedSpells = null;
}
