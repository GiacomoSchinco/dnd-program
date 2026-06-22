import { Monster, Npc, Spell } from '../types';

/**
 * Escapes a single CSV field value (RFC 4180).
 */
function escapeField(value: unknown): string {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Parses a single CSV row, handling quoted fields.
 */
function parseRow(row: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (inQuotes) {
      if (ch === '"' && row[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Exports an array of objects to a CSV file download.
 * @param rows
 * @param columns - ordered list of property keys (also used as CSV header)
 * @param filename
 */
export function exportCSV<T extends object>(rows: T[], columns: string[], filename: string): void {
  const lines = [
    columns.join(','),
    ...rows.map((row) => columns.map((col) => escapeField((row as Record<string, unknown>)[col])).join(',')),
  ];
  // Prepend UTF-8 BOM so Excel opens it correctly
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parses CSV text (with header row) into an array of objects.
 * Keys are taken from the header row (lowercased and trimmed).
 * @param text - raw file content
 * @returns
 */
export function parseCSV(text: string): Record<string, string>[] {
  const clean = text.replace(/^\uFEFF/, '').trim();
  const lines = clean.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]).map((h) => h.trim().toLowerCase());
  const result: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? '';
    });
    result.push(obj);
  }
  return result;
}

// ── Per-entity column definitions ──────────────────────────────────────────

export const MONSTER_COLUMNS = ['name', 'hp', 'ac', 'damage', 'cr', 'type'];
export const SPELL_COLUMNS   = ['name', 'level', 'school', 'classes', 'casting', 'damage', 'save', 'range', 'duration', 'components', 'material', 'concentration', 'ritual', 'upgrade', 'description'];
export const NPC_COLUMNS     = ['name', 'hp', 'ac', 'description'];

// ── Per-entity row mappers (CSV row → DB object) ───────────────────────────

export function rowToMonster(row: Record<string, string>): Omit<Monster, 'id'> | null {
  const name = (row.name || '').trim();
  if (!name) return null;
  const hp = Math.max(1, Math.min(9999, parseInt(row.hp, 10) || 10));
  const ac = Math.max(1, Math.min(30, parseInt(row.ac, 10) || 10));
  return {
    name,
    hp,
    ac,
    damage: (row.damage || '1d6').trim(),
    cr:     (row.cr     || '1').trim(),
    type:   (row.type   || 'humanoid').trim(),
  };
}

export function rowToSpell(row: Record<string, string>): Omit<Spell, 'id'> | null {
  const name = (row.name || '').trim();
  if (!name) return null;
  const level = Math.max(0, Math.min(9, parseInt(row.level, 10) || 0));
  const toBool = (v: string) => v.trim().toLowerCase() === 'true' || v.trim() === '1';
  return {
    name,
    level,
    school:        (row.school       || 'Evocation').trim(),
    classes:       (row.classes      || '').trim(),
    casting:       (row.casting      || '').trim(),
    damage:        (row.damage       || '').trim(),
    save:          (row.save         || '').trim(),
    range:         (row.range        || '').trim(),
    duration:      (row.duration     || '').trim(),
    components:    (row.components   || '').trim(),
    material:      (row.material     || '').trim(),
    concentration: toBool(row.concentration || ''),
    ritual:        toBool(row.ritual || ''),
    upgrade:       (row.upgrade      || '').trim(),
    description:   (row.description  || '').trim(),
  };
}

export function rowToNpc(row: Record<string, string>): Omit<Npc, 'id'> | null {
  const name = (row.name || '').trim();
  if (!name) return null;
  return {
    name,
    hp:          Math.max(1, Math.min(9999, parseInt(row.hp, 10) || 10)),
    ac:          Math.max(1, Math.min(30, parseInt(row.ac, 10) || 10)),
    description: (row.description || '').trim(),
  };
}
