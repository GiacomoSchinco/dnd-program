/**
 * Dizionario centralizzato delle icone D&D.
 *
 * Ogni funzione mappa un concetto (scuola di magia, classe, ecc.)
 * al nome del file SVG corrispondente in `/public/icon/`.
 *
 * I colori usano classi DaisyUI semantiche per adattarsi al tema.
 */

// ─── Scuole di magia ────────────────────────────────────────────────────────

const SCHOOL_MAP: Record<string, { icon: string; color: string }> = {
  'Abiurazione':     { icon: 'abjuration',    color: 'text-info' },
  'Ammaestramento':  { icon: 'enchantment',   color: 'text-secondary' },
  'Divinazione':     { icon: 'divination',    color: 'text-warning' },
  'Evocazione':      { icon: 'evocation',     color: 'text-error' },
  'Illusione':       { icon: 'illusion',      color: 'text-accent' },
  'Invocazione':     { icon: 'conjuration',   color: 'text-success' },
  'Necromanzia':     { icon: 'necromancy',    color: 'text-base-content' },
  'Trasmutazione':   { icon: 'transmutation', color: 'text-primary' },
} as const;

/** Nome file SVG per la scuola di magia */
export function getSchoolIcon(school: string): string {
  return SCHOOL_MAP[school]?.icon ?? 'universal';
}

/** Classe Tailwind per il colore della scuola di magia */
export function getSchoolColor(school: string): string {
  return SCHOOL_MAP[school]?.color ?? 'text-base-content/60';
}

// ─── Classi dei personaggi ───────────────────────────────────────────────────

interface ClassInfo {
  icon: string;
  color: string;
  label: string;
}

const CLASS_MAP: Record<string, ClassInfo> = {
  // Nomi italiani (prioritari)
  'Guerriero':  { icon: 'fighter',   color: 'text-error',           label: 'Guerriero' },
  'Mago':       { icon: 'wizard',    color: 'text-info',            label: 'Mago' },
  'Ladro':      { icon: 'rogue',     color: 'text-neutral-content', label: 'Ladro' },
  'Chierico':   { icon: 'cleric',    color: 'text-warning',         label: 'Chierico' },
  'Barbaro':    { icon: 'barbarian', color: 'text-error',           label: 'Barbaro' },
  'Paladino':   { icon: 'paladin',   color: 'text-warning',         label: 'Paladino' },
  'Ranger':     { icon: 'ranger',    color: 'text-success',         label: 'Ranger' },
  'Stregone':   { icon: 'sorcerer',  color: 'text-accent',          label: 'Stregone' },
  'Bardo':      { icon: 'bard',      color: 'text-secondary',       label: 'Bardo' },
  'Druido':     { icon: 'druid',     color: 'text-success',         label: 'Druido' },
  'Monaco':     { icon: 'monk',      color: 'text-primary',         label: 'Monaco' },
  'Warlock':    { icon: 'warlock',   color: 'text-secondary',       label: 'Warlock' },
  'Artificiere':{ icon: 'artificer', color: 'text-info',            label: 'Artificiere' },

  // Nomi inglesi (fallback)
  'Fighter':    { icon: 'fighter',   color: 'text-error',           label: 'Guerriero' },
  'Wizard':     { icon: 'wizard',    color: 'text-info',            label: 'Mago' },
  'Rogue':      { icon: 'rogue',     color: 'text-neutral-content', label: 'Ladro' },
  'Cleric':     { icon: 'cleric',    color: 'text-warning',         label: 'Chierico' },
  'Barbarian':  { icon: 'barbarian', color: 'text-error',           label: 'Barbaro' },
  'Paladin':    { icon: 'paladin',   color: 'text-warning',         label: 'Paladino' },
  'Sorcerer':   { icon: 'sorcerer',  color: 'text-accent',          label: 'Stregone' },
  'Bard':       { icon: 'bard',      color: 'text-secondary',       label: 'Bardo' },
  'Druid':      { icon: 'druid',     color: 'text-success',         label: 'Druido' },
  'Monk':       { icon: 'monk',      color: 'text-primary',         label: 'Monaco' },
  'Artificer':  { icon: 'artificer', color: 'text-info',            label: 'Artificiere' },
} as const;

/** Nome file SVG per la classe del personaggio (o null se non trovata) */
export function getClassIcon(className?: string): string | null {
  if (!className) return null;
  return CLASS_MAP[className]?.icon ?? null;
}

/** Classe Tailwind per il colore della classe del personaggio */
export function getClassColor(className?: string): string {
  if (!className) return 'text-base-content/60';
  return CLASS_MAP[className]?.color ?? 'text-base-content/60';
}

/** Nome italiano della classe del personaggio */
export function getClassName(className?: string): string {
  if (!className) return '—';
  return CLASS_MAP[className]?.label ?? className;
}
