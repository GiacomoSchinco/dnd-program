/**
 * Escapes a single CSV field value (RFC 4180).
 */
function escapeField(value) {
  const str = value == null ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Parses a single CSV row, handling quoted fields.
 */
function parseRow(row) {
  const fields = [];
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
 * @param {object[]} rows
 * @param {string[]} columns - ordered list of property keys (also used as CSV header)
 * @param {string} filename
 */
export function exportCSV(rows, columns, filename) {
  const lines = [
    columns.join(','),
    ...rows.map((row) => columns.map((col) => escapeField(row[col])).join(',')),
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
 * @param {string} text - raw file content
 * @returns {object[]}
 */
export function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '').trim();
  const lines = clean.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseRow(lines[0]).map((h) => h.trim().toLowerCase());
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseRow(line);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? '';
    });
    result.push(obj);
  }
  return result;
}

// ── Per-entity column definitions ──────────────────────────────────────────

export const MONSTER_COLUMNS = ['name', 'hp', 'ac', 'damage', 'cr', 'type'];
export const SPELL_COLUMNS   = ['name', 'level', 'school', 'damage', 'healing', 'range', 'duration', 'effect'];
export const NPC_COLUMNS     = ['name', 'hp', 'ac', 'description'];

// ── Per-entity row mappers (CSV row → DB object) ───────────────────────────

export function rowToMonster(row) {
  const hp = parseInt(row.hp) || 10;
  const ac = parseInt(row.ac) || 10;
  return {
    name:   (row.name   || '').trim(),
    hp,
    ac,
    damage: (row.damage || '1d6').trim(),
    cr:     (row.cr     || '1').trim(),
    type:   (row.type   || 'humanoid').trim(),
  };
}

export function rowToSpell(row) {
  return {
    name:     (row.name     || '').trim(),
    level:    parseInt(row.level)  || 0,
    school:   (row.school   || 'Evocazione').trim(),
    damage:   (row.damage   || '').trim(),
    healing:  (row.healing  || '').trim(),
    range:    (row.range    || '').trim(),
    duration: (row.duration || '').trim(),
    effect:   (row.effect   || '').trim(),
  };
}

export function rowToNpc(row) {
  return {
    name:        (row.name        || '').trim(),
    hp:          parseInt(row.hp) || 10,
    ac:          parseInt(row.ac) || 10,
    description: (row.description || '').trim(),
  };
}
