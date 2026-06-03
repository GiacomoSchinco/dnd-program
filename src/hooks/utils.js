export function normalizeCombatStatus(status) {
  if (status === 'completed') return 'terminated'
  if (status === 'in_progress' || status === 'terminated' || status === 'prepared') return status
  return 'prepared'
}

export function normalizeParticipant(p) {
  const maxHp = Number(p.maxHp ?? p.hp ?? 1) || 1
  const currentHp = Number(p.currentHp ?? p.hp ?? maxHp)
  return { ...p, maxHp, currentHp: Math.max(0, Math.min(maxHp, currentHp)) }
}

export function normalizeCombatRecord(combat) {
  if (!combat) return combat
  return {
    ...combat,
    status: normalizeCombatStatus(combat.status),
    participants: (combat.participants ?? []).map(normalizeParticipant),
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getNextMonsterName(baseName, participants = []) {
  const normalizedBase = (baseName || 'Mostro').trim() || 'Mostro'
  const matcher = new RegExp(`^${escapeRegExp(normalizedBase)}(?:\\s+(\\d+))?$`, 'i')

  const usedNumbers = participants
    .filter((p) => p?.type === 'monster' && typeof p?.name === 'string')
    .map((p) => {
      const match = p.name.trim().match(matcher)
      if (!match) return null
      return Number(match[1] ?? 1)
    })
    .filter((n) => Number.isInteger(n) && n > 0)

  const nextNumber = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1
  return `${normalizedBase} ${nextNumber}`
}

export function sortParticipantsByInitiative(participants = []) {
  return [...participants].sort((a, b) => {
    const initiativeDiff = (Number(b?.initiative) || 0) - (Number(a?.initiative) || 0)
    if (initiativeDiff !== 0) return initiativeDiff
    return String(a?.name ?? '').localeCompare(String(b?.name ?? ''), 'it', { sensitivity: 'base' })
  })
}
