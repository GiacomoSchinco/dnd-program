import type { CombatParticipant, Combat } from '../types';

export function normalizeCombatStatus(status: string): Combat['status'] {
  if (status === 'completed') return 'terminated';
  if (status === 'in_progress' || status === 'terminated' || status === 'prepared') return status as Combat['status'];
  return 'prepared';
}

export function normalizeParticipant(p: Partial<CombatParticipant>): CombatParticipant {
  const maxHp = Number(p.maxHp ?? p.hp ?? 1) || 1;
  const currentHp = Number(p.currentHp ?? p.hp ?? maxHp);
  return {
    ...p,
    id: p.id || crypto.randomUUID(),
    name: p.name || 'Unknown',
    type: (p.type || 'monster') as 'pc' | 'npc' | 'monster',
    hp: maxHp,
    maxHp,
    currentHp: Math.max(0, Math.min(maxHp, currentHp)),
    initiative: Number(p.initiative || 0),
  };
}

export function normalizeCombatRecord(combat?: unknown): Combat | undefined {
  if (!combat) return undefined;
  const c = combat as Partial<Combat>;
  return {
    ...c,
    status: normalizeCombatStatus(c.status || 'prepared'),
    participants: (c.participants || []).map(normalizeParticipant),
    name: c.name || 'Nuovo Combattimento',
    date: c.date || new Date().toISOString(),
    currentTurnIndex: c.currentTurnIndex ?? 0,
    round: c.round ?? 1,
  } as Combat;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getNextMonsterName(baseName: string = 'Mostro', participants: CombatParticipant[] = []): string {
  const normalizedBase = baseName.trim() || 'Mostro';
  const matcher = new RegExp(`^${escapeRegExp(normalizedBase)}(?:\\s+(\\d+))?$`, 'i');

  const usedNumbers = participants
    .filter((p) => p?.type === 'monster' && typeof p?.name === 'string')
    .map((p) => {
      const match = p.name.trim().match(matcher);
      if (!match) return null;
      return Number(match[1] ?? 1);
    })
    .filter((n): n is number => n !== null && Number.isInteger(n) && n > 0);

  const nextNumber = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;
  return `${normalizedBase} ${nextNumber}`;
}

export function sortParticipantsByInitiative(participants: CombatParticipant[] = []): CombatParticipant[] {
  return [...participants].sort((a, b) => {
    const initiativeDiff = (Number(b?.initiative) || 0) - (Number(a?.initiative) || 0);
    if (initiativeDiff !== 0) return initiativeDiff;
    return String(a?.name || '').localeCompare(String(b?.name || ''), 'it', { sensitivity: 'base' });
  });
}
