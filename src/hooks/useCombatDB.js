import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useCallback } from 'react'
import { db } from '../db/database'
import { seedMonsters } from '../db/seedData'
import { toast } from 'sonner'

function normalizeCombatStatus(status) {
  if (status === 'completed') return 'terminated'
  if (status === 'in_progress' || status === 'terminated' || status === 'prepared') {
    return status
  }
  return 'prepared'
}

function normalizeParticipant(p) {
  const maxHp = Number(p.maxHp ?? p.hp ?? 1) || 1
  const currentHp = Number(p.currentHp ?? p.hp ?? maxHp)
  return {
    ...p,
    maxHp,
    currentHp: Math.max(0, Math.min(maxHp, currentHp)),
  }
}

function normalizeCombatRecord(combat) {
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

function getNextMonsterName(baseName, participants = []) {
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

function sortParticipantsByInitiative(participants = []) {
  return [...participants].sort((a, b) => {
    const initiativeDiff = (Number(b?.initiative) || 0) - (Number(a?.initiative) || 0)
    if (initiativeDiff !== 0) return initiativeDiff
    return String(a?.name ?? '').localeCompare(String(b?.name ?? ''), 'it', {
      sensitivity: 'base',
    })
  })
}

async function initializeDB() {
  await db.transaction('rw', db.monsters, async () => {
    const count = await db.monsters.count()
    if (count === 0) {
      await db.monsters.bulkAdd(seedMonsters)
    }
  })
}

export function useCombatDB() {
  // ── Reactive live queries ──────────────────────────────────────────────────
  const activeCombat = useLiveQuery(async () => {
    const current = await db.activeCombat.get('current')
    return normalizeCombatRecord(current)
  })
  const campaigns = useLiveQuery(() => db.campaigns.toArray(), [], [])
  const characters = useLiveQuery(() => db.characters.toArray(), [], [])
  const combats = useLiveQuery(
    async () => {
      const records = await db.combats.orderBy('date').reverse().toArray()
      return records.map(normalizeCombatRecord)
    },
    [],
    [],
  )

  const monsterLibrary = useLiveQuery(
    () => db.monsters.toArray(),
    [],
    [],
  )

  const npcLibrary = useLiveQuery(
    () => db.npcs.toArray(),
    [],
    [],
  )

  // Seed monsters on first load
  useEffect(() => {
    initializeDB()
  }, [])

  // ── Combat actions ─────────────────────────────────────────────────────────
  const saveActiveCombat = useCallback(async (combatData) => {
    await db.activeCombat.put({ ...combatData, id: 'current' })
  }, [])

  const persistLinkedCombat = useCallback(async (combatState) => {
    if (!combatState?.combatId) return
    await db.combats.update(combatState.combatId, {
      name: combatState.name || 'Battaglia',
      date: new Date().toISOString(),
      status: normalizeCombatStatus(combatState.status),
      participants: combatState.participants ?? [],
      currentTurnIndex: combatState.currentTurnIndex ?? 0,
      round: combatState.round ?? 1,
      campaignId: combatState.campaignId ?? null,
    })
  }, [])

  const syncCharacterHpFromParticipant = useCallback(async (participant, newHp) => {
    if (!participant || participant.type !== 'pc') return

    if (participant.characterId != null) {
      await db.characters.update(participant.characterId, { currentHp: newHp })
      return
    }

    if (participant.campaignId != null) {
      const scoped = await db.characters
        .where('campaignId')
        .equals(participant.campaignId)
        .filter((c) => c.name === participant.name)
        .toArray()

      if (scoped.length === 1) {
        await db.characters.update(scoped[0].id, { currentHp: newHp })
        return
      }
    }

    const byName = await db.characters.where('name').equals(participant.name).toArray()
    if (byName.length === 1) {
      await db.characters.update(byName[0].id, { currentHp: newHp })
    }
  }, [])

  const applyDamage = useCallback(async (participantId, amount) => {
    try {
      const current = await db.activeCombat.get('current')
      if (!current) return
      const target = current.participants.find((p) => p.id === participantId)
      if (!target) return
      const currentHp = Number(target.currentHp ?? target.hp ?? 0)
      const newHp = Math.max(0, currentHp - Number(amount))
      await syncCharacterHpFromParticipant(target, newHp)
      const nextState = {
        ...current,
        participants: current.participants.map((p) =>
          p.id === participantId ? { ...p, currentHp: newHp } : p,
        ),
      }
      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    } catch (err) {
      console.error('[useCombatDB] applyDamage', err)
      toast.error('Errore nell\'applicazione del danno')
    }
  }, [persistLinkedCombat, syncCharacterHpFromParticipant])

  const heal = useCallback(async (participantId, amount) => {
    try {
      const current = await db.activeCombat.get('current')
      if (!current) return
      const target = current.participants.find((p) => p.id === participantId)
      if (!target) return
      const currentHp = Number(target.currentHp ?? target.hp ?? 0)
      const maxHp = Number(target.maxHp ?? target.hp ?? currentHp)
      const newHp = Math.min(maxHp, currentHp + Number(amount))
      await syncCharacterHpFromParticipant(target, newHp)
      const nextState = {
        ...current,
        participants: current.participants.map((p) =>
          p.id === participantId ? { ...p, currentHp: newHp } : p,
        ),
      }
      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    } catch (err) {
      console.error('[useCombatDB] heal', err)
      toast.error('Errore nella guarigione')
    }
  }, [persistLinkedCombat, syncCharacterHpFromParticipant])

  const nextTurn = useCallback(async () => {
    try {
      const current = await db.activeCombat.get('current')
      if (!current || !current.participants.length) return
      const nextIndex = (current.currentTurnIndex + 1) % current.participants.length
      const newRound = nextIndex === 0 ? (current.round ?? 1) + 1 : current.round ?? 1
      const nextState = { ...current, currentTurnIndex: nextIndex, round: newRound }
      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    } catch (err) {
      console.error('[useCombatDB] nextTurn', err)
      toast.error('Errore nel passaggio al turno successivo')
    }
  }, [persistLinkedCombat])

  const sortByInitiative = useCallback(async () => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null
    const sorted = sortParticipantsByInitiative(current.participants ?? [])
    const nextTurnIndex = currentParticipantId
      ? Math.max(0, sorted.findIndex((participant) => participant.id === currentParticipantId))
      : 0

    const nextState = {
      ...current,
      participants: sorted,
      currentTurnIndex: nextTurnIndex,
    }

    await db.activeCombat.put(nextState)
    await persistLinkedCombat(nextState)
  }, [persistLinkedCombat])

  const addParticipant = useCallback(async (participant) => {
    try {
      const current = await db.activeCombat.get('current')
      const currentParticipants = current?.participants ?? []

      const participantWithName =
        participant?.type === 'monster'
          ? {
              ...participant,
              name: getNextMonsterName(participant?.name, currentParticipants),
            }
          : participant

      const newParticipant = { id: crypto.randomUUID(), ...participantWithName }

      if (!current) {
        const sortedParticipants = sortParticipantsByInitiative([newParticipant])
        const nextState = {
          id: 'current',
          name: 'Nuovo Combattimento',
          status: 'prepared',
          participants: sortedParticipants,
          currentTurnIndex: 0,
          round: 1,
        }
        await db.activeCombat.put(nextState)
        await persistLinkedCombat(nextState)
      } else {
        const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null
        const sortedParticipants = sortParticipantsByInitiative([
          ...current.participants,
          newParticipant,
        ])
        const nextTurnIndex = currentParticipantId
          ? Math.max(
              0,
              sortedParticipants.findIndex((participant) => participant.id === currentParticipantId),
            )
          : 0

        const nextState = {
          ...current,
          participants: sortedParticipants,
          currentTurnIndex: nextTurnIndex,
        }
        await db.activeCombat.put(nextState)
        await persistLinkedCombat(nextState)
      }
    } catch (err) {
      console.error('[useCombatDB] addParticipant', err)
      toast.error('Errore nell\'aggiunta del partecipante')
    }
  }, [persistLinkedCombat])

  const removeParticipant = useCallback(async (participantId) => {
    try {
      const current = await db.activeCombat.get('current')
      if (!current) return
      const filtered = current.participants.filter((p) => p.id !== participantId)
      const newIndex = Math.min(
        current.currentTurnIndex,
        Math.max(0, filtered.length - 1),
      )
      await db.activeCombat.put({
        ...current,
        participants: filtered,
        currentTurnIndex: newIndex,
      })
      await persistLinkedCombat({
        ...current,
        participants: filtered,
        currentTurnIndex: newIndex,
      })
    } catch (err) {
      console.error('[useCombatDB] removeParticipant', err)
      toast.error('Errore nella rimozione del partecipante')
    }
  }, [persistLinkedCombat])

  const updateParticipantInitiative = useCallback(
    async (participantId, initiative) => {
      const current = await db.activeCombat.get('current')
      if (!current) return
      const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null
      const updatedParticipants = current.participants.map((participant) =>
        participant.id === participantId
          ? { ...participant, initiative: Number(initiative) || 0 }
          : participant,
      )
      const sortedParticipants = sortParticipantsByInitiative(updatedParticipants)
      const nextTurnIndex = currentParticipantId
        ? Math.max(
            0,
            sortedParticipants.findIndex((participant) => participant.id === currentParticipantId),
          )
        : 0

      const nextState = {
        ...current,
        participants: sortedParticipants,
        currentTurnIndex: nextTurnIndex,
      }

      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    },
    [persistLinkedCombat],
  )

  // ── History actions ────────────────────────────────────────────────────────
  const saveToHistory = useCallback(async (name) => {
    try {
      const current = await db.activeCombat.get('current')
      if (!current) return

      if (current.combatId) {
        await db.combats.update(current.combatId, {
          name: name || current.name || 'Combattimento',
          date: new Date().toISOString(),
          status: normalizeCombatStatus(current.status),
          participants: current.participants,
          currentTurnIndex: current.currentTurnIndex,
          round: current.round ?? 1,
          campaignId: current.campaignId ?? null,
        })
        return
      }

      await db.combats.add({
        name: name || current.name || 'Combattimento',
        date: new Date().toISOString(),
        status: normalizeCombatStatus(current.status),
        participants: current.participants,
        currentTurnIndex: current.currentTurnIndex,
        round: current.round ?? 1,
        campaignId: current.campaignId ?? null,
      })
    } catch (err) {
      console.error('[useCombatDB] saveToHistory', err)
      toast.error('Errore nel salvataggio della battaglia')
    }
  }, [])

  const loadFromHistory = useCallback(async (combatId) => {
    try {
      const combat = await db.combats.get(combatId)
      if (!combat) return
      const sortedParticipants = sortParticipantsByInitiative(combat.participants ?? [])
      await db.activeCombat.put({
        id: 'current',
        combatId: combat.id,
        campaignId: combat.campaignId ?? null,
        name: combat.name,
        status: normalizeCombatStatus(combat.status),
        participants: sortedParticipants,
        currentTurnIndex: 0,
        round: combat.round ?? 1,
      })
    } catch (err) {
      console.error('[useCombatDB] loadFromHistory', err)
      toast.error('Errore nel caricamento della battaglia')
    }
  }, [])

  const createCombatForCampaign = useCallback(async (campaignId, name) => {
    try {
      if (campaignId == null) return null

      const combatRecord = {
        name: name?.trim() || 'Nuova Battaglia',
        date: new Date().toISOString(),
        status: 'prepared',
        campaignId,
        participants: [],
        currentTurnIndex: 0,
        round: 1,
      }

      const combatId = await db.combats.add(combatRecord)
      return combatId
    } catch (err) {
      console.error('[useCombatDB] createCombatForCampaign', err)
      toast.error('Errore nella creazione della battaglia')
      return null
    }
  }, [])

  const loadCombat = useCallback(async (combatId) => {
    await loadFromHistory(combatId)
  }, [loadFromHistory])

  const setCombatStatus = useCallback(async (combatId, status) => {
    try {
      if (combatId == null) return
      const normalized = normalizeCombatStatus(status)

      await db.combats.update(combatId, {
        status: normalized,
        date: new Date().toISOString(),
      })

      const current = await db.activeCombat.get('current')
      if (current?.combatId === combatId) {
        await db.activeCombat.put({
          ...current,
          status: normalized,
        })
      }
    } catch (err) {
      console.error('[useCombatDB] setCombatStatus', err)
      toast.error('Errore nel cambiamento di stato')
    }
  }, [])

  const deleteFromHistory = useCallback(async (combatId) => {
    try {
      await db.combats.delete(combatId)
    } catch (err) {
      console.error('[useCombatDB] deleteFromHistory', err)
      toast.error('Errore nell\'eliminazione della battaglia')
    }
  }, [])

  const completeCombat = useCallback(async (combatId) => {
    await setCombatStatus(combatId, 'terminated')
  }, [setCombatStatus])

  const terminateCombat = useCallback(async (combatId) => {
    await setCombatStatus(combatId, 'terminated')
  }, [setCombatStatus])

  const newCombat = useCallback(async () => {
    const current = await db.activeCombat.get('current')
    const nextState = {
      id: 'current',
      combatId: current?.combatId,
      campaignId: current?.campaignId ?? null,
      name: current?.name || 'Nuovo Combattimento',
      status: 'prepared',
      participants: [],
      currentTurnIndex: 0,
      round: 1,
    }
    await db.activeCombat.put(nextState)
    await persistLinkedCombat(nextState)
  }, [persistLinkedCombat])

  // ── Monster library actions ────────────────────────────────────────────────
  const addMonster = useCallback(async (monsterData) => {
    try {
      await db.monsters.add(monsterData)
    } catch (err) {
      console.error('[useCombatDB] addMonster', err)
      toast.error('Errore nell\'aggiunta del mostro')
    }
  }, [])

  const updateMonster = useCallback(async (id, monsterData) => {
    try {
      await db.monsters.update(id, monsterData)
    } catch (err) {
      console.error('[useCombatDB] updateMonster', err)
      toast.error('Errore nella modifica del mostro')
    }
  }, [])

  const deleteMonster = useCallback(async (id) => {
    try {
      await db.monsters.delete(id)
    } catch (err) {
      console.error('[useCombatDB] deleteMonster', err)
      toast.error('Errore nell\'eliminazione del mostro')
    }
  }, [])

  const importMonsters = useCallback(async (monsters) => {
    try {
      await db.monsters.bulkAdd(monsters)
    } catch (err) {
      console.error('[useCombatDB] importMonsters', err)
      toast.error('Errore nell\'importazione dei mostri')
    }
  }, [])

  // ── NPC library actions ────────────────────────────────────────────────────
  const addNpc = useCallback(async (npcData) => {
    try {
      await db.npcs.add(npcData)
    } catch (err) {
      console.error('[useCombatDB] addNpc', err)
      toast.error('Errore nell\'aggiunta dell\'NPC')
    }
  }, [])

  const updateNpc = useCallback(async (id, npcData) => {
    try {
      await db.npcs.update(id, npcData)
    } catch (err) {
      console.error('[useCombatDB] updateNpc', err)
      toast.error('Errore nella modifica dell\'NPC')
    }
  }, [])

  const deleteNpc = useCallback(async (id) => {
    try {
      await db.npcs.delete(id)
    } catch (err) {
      console.error('[useCombatDB] deleteNpc', err)
      toast.error('Errore nell\'eliminazione dell\'NPC')
    }
  }, [])

  const importNpcs = useCallback(async (npcs) => {
    try {
      await db.npcs.bulkAdd(npcs)
    } catch (err) {
      console.error('[useCombatDB] importNpcs', err)
      toast.error('Errore nell\'importazione degli NPC')
    }
  }, [])

  return {
    // Reactive data
    activeCombat,
    campaigns,
    characters,
    combats,
    combatHistory: combats,
    monsterLibrary,
    npcLibrary,
    // Combat actions
    saveActiveCombat,
    applyDamage,
    heal,
    nextTurn,
    sortByInitiative,
    addParticipant,
    removeParticipant,
    updateParticipantInitiative,
    // History actions
    saveToHistory,
    loadFromHistory,
    loadCombat,
    setCombatStatus,
    createCombatForCampaign,
    completeCombat,
    terminateCombat,
    deleteFromHistory,
    newCombat,
    // Monster actions
    addMonster,
    updateMonster,
    deleteMonster,
    importMonsters,
    // NPC actions
    addNpc,
    updateNpc,
    deleteNpc,
    importNpcs,
  }
}
