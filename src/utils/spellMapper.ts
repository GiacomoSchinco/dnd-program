import type { Spell } from '../types';

// ── Mapping scuole (inglese → italiano) ───────────────────────────────────

const SCHOOL_MAP: Record<string, string> = {
  abjuration:    'Abiurazione',
  conjuration:   'Invocazione',
  divination:    'Divinazione',
  enchantment:   'Ammaestramento',
  evocation:     'Evocazione',
  illusion:      'Illusione',
  necromancy:    'Necromanzia',
  transmutation: 'Trasmutazione',
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

// ── Interfaccia del JSON ───────────────────────────────────────────────────

interface RawSpell {
  slug: string;
  name: string;
  name_it: string;
  level: number;
  school: string;
  classes: string[];
  action_type: string | null;
  concentration: boolean;
  ritual: boolean;
  range: string;
  components: string[] | null;
  material: string | null;
  duration: string;
  description: string | null;
  description_it: string | null;
  cantrip_upgrade: string | null;
  higher_level_slot: string | null;
  saving_throw: string | null;
  attack_roll: boolean;
  damage: string | null;
  area_of_effect: string | null;
}

// ── Helper: estrae il danno base (prima della virgola) ────────────────────

function extractBaseDamage(raw: string | null): string {
  if (!raw) return '';
  // Il formato può essere "1d10 da, 1d10 da" (base, upgraded)
  // Prendiamo solo la parte prima della virgola
  const base = raw.split(',')[0].trim();
  // Rimuovi eventuale testo dopo il dado
  return base;
}

// ── Helper: combina potenziamenti ─────────────────────────────────────────

function buildHigherLevels(
  cantripUpgrade: string | null,
  higherSlot: string | null,
): string {
  const parts: string[] = [];
  if (cantripUpgrade) parts.push(cantripUpgrade);
  if (higherSlot) parts.push(higherSlot);
  return parts.join('\n\n');
}

// ── Mapper principale ─────────────────────────────────────────────────────

/**
 * Converte un array di magie dal formato JSON (pubblico / copyright-free)
 * nel formato `Omit<Spell, 'id'>` usato dall'applicazione.
 */
export function mapSpellsJson(raw: RawSpell[]): Omit<Spell, 'id'>[] {
  return raw.map((s) => ({
    name:          s.name_it || s.name,
    level:         s.level,
    school:        SCHOOL_MAP[s.school] || s.school,
    castingTime:   CASTING_TIME_MAP[s.action_type ?? ''] || s.action_type || '',
    range:         s.range || '',
    components:    s.components?.join(', ') || '',
    material:      s.material || '',
    duration:      s.duration || '',
    concentration: !!s.concentration,
    ritual:        !!s.ritual,
    damage:        extractBaseDamage(s.damage),
    healing:       '',
    saveType:      s.saving_throw || '',
    effect:        s.description_it || s.description || '',
    higherLevels:  buildHigherLevels(s.cantrip_upgrade, s.higher_level_slot),
    description:   s.description_it || s.description || '',
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
