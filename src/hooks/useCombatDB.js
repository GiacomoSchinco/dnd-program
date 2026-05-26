import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useCallback } from 'react'
import { db } from '../db/database'
import { seedMonsters } from '../db/seedData'

async function initializeDB() {
  const count = await db.monsters.count()
  if (count === 0) {
    await db.monsters.bulkAdd(seedMonsters)
  }
}

export function useCombatDB() {
  // ── Reactive live queries ──────────────────────────────────────────────────
  const activeCombat = useLiveQuery(() => db.activeCombat.get('current'))
  const campaigns = useLiveQuery(() => db.campaigns.toArray(), [], [])
  const characters = useLiveQuery(() => db.characters.toArray(), [], [])
  const combats = useLiveQuery(
    () => db.combats.orderBy('date').reverse().toArray(),
    [],
    [],
  )

  const combatHistory = useLiveQuery(
    () => db.combats.orderBy('date').reverse().toArray(),
    [],
    [],
  )

  const monsterLibrary = useLiveQuery(
    () => db.monsters.toArray(),
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
      status: combatState.status ?? 'prepared',
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
    const current = await db.activeCombat.get('current')
    if (!current) return
    const target = current.participants.find((p) => p.id === participantId)
    if (!target) return
    const newHp = Math.max(0, target.currentHp - amount)

    await syncCharacterHpFromParticipant(target, newHp)

    await db.activeCombat.put({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: newHp }
          : p,
      ),
    })
    await persistLinkedCombat({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: newHp }
          : p,
      ),
    })
  }, [persistLinkedCombat, syncCharacterHpFromParticipant])

  const heal = useCallback(async (participantId, amount) => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    const target = current.participants.find((p) => p.id === participantId)
    if (!target) return
    const newHp = Math.min(target.maxHp, target.currentHp + amount)

    await syncCharacterHpFromParticipant(target, newHp)

    await db.activeCombat.put({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: newHp }
          : p,
      ),
    })
    await persistLinkedCombat({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: newHp }
          : p,
      ),
    })
  }, [persistLinkedCombat, syncCharacterHpFromParticipant])

  const nextTurn = useCallback(async () => {
    const current = await db.activeCombat.get('current')
    if (!current || !current.participants.length) return
    const nextIndex = (current.currentTurnIndex + 1) % current.participants.length
    const newRound =
      nextIndex === 0 ? (current.round ?? 1) + 1 : current.round ?? 1
    await db.activeCombat.put({
      ...current,
      currentTurnIndex: nextIndex,
      round: newRound,
    })
    await persistLinkedCombat({
      ...current,
      currentTurnIndex: nextIndex,
      round: newRound,
    })
  }, [persistLinkedCombat])

  const sortByInitiative = useCallback(async () => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    const sorted = [...current.participants].sort(
      (a, b) => b.initiative - a.initiative,
    )
    await db.activeCombat.put({
      ...current,
      participants: sorted,
      currentTurnIndex: 0,
    })
    await persistLinkedCombat({
      ...current,
      participants: sorted,
      currentTurnIndex: 0,
    })
  }, [persistLinkedCombat])

  const addParticipant = useCallback(async (participant) => {
    const newParticipant = { id: crypto.randomUUID(), ...participant }
    const current = await db.activeCombat.get('current')
    if (!current) {
      const nextState = {
        id: 'current',
        name: 'Nuovo Combattimento',
        status: 'prepared',
        participants: [newParticipant],
        currentTurnIndex: 0,
        round: 1,
      }
      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    } else {
      const nextState = {
        ...current,
        participants: [...current.participants, newParticipant],
      }
      await db.activeCombat.put(nextState)
      await persistLinkedCombat(nextState)
    }
  }, [persistLinkedCombat])

  const removeParticipant = useCallback(async (participantId) => {
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
  }, [persistLinkedCombat])

  const updateParticipantInitiative = useCallback(
    async (participantId, initiative) => {
      const current = await db.activeCombat.get('current')
      if (!current) return
      await db.activeCombat.put({
        ...current,
        participants: current.participants.map((p) =>
          p.id === participantId
            ? { ...p, initiative: Number(initiative) || 0 }
            : p,
        ),
      })
      await persistLinkedCombat({
        ...current,
        participants: current.participants.map((p) =>
          p.id === participantId
            ? { ...p, initiative: Number(initiative) || 0 }
            : p,
        ),
      })
    },
    [persistLinkedCombat],
  )

  // ── History actions ────────────────────────────────────────────────────────
  const saveToHistory = useCallback(async (name) => {
    const current = await db.activeCombat.get('current')
    if (!current) return

    if (current.combatId) {
      await db.combats.update(current.combatId, {
        name: name || current.name || 'Combattimento',
        date: new Date().toISOString(),
        status: current.status ?? 'prepared',
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
      status: current.status ?? 'prepared',
      participants: current.participants,
      currentTurnIndex: current.currentTurnIndex,
      round: current.round ?? 1,
      campaignId: current.campaignId ?? null,
    })
  }, [])

  const loadFromHistory = useCallback(async (combatId) => {
    const combat = await db.combats.get(combatId)
    if (!combat) return
    await db.activeCombat.put({
      id: 'current',
      combatId: combat.id,
      campaignId: combat.campaignId ?? null,
      name: combat.name,
      status: combat.status ?? 'prepared',
      participants: combat.participants,
      currentTurnIndex: 0,
      round: combat.round ?? 1,
    })
  }, [])

  const createCombatForCampaign = useCallback(async (campaignId, name) => {
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
    await db.activeCombat.put({
      id: 'current',
      combatId,
      campaignId,
      ...combatRecord,
    })
    return combatId
  }, [])

  const loadCombat = useCallback(async (combatId) => {
    await loadFromHistory(combatId)
  }, [loadFromHistory])

  const deleteFromHistory = useCallback(async (combatId) => {
    await db.combats.delete(combatId)
  }, [])

  const completeCombat = useCallback(async (combatId) => {
    if (combatId == null) return

    await db.combats.update(combatId, {
      status: 'completed',
      date: new Date().toISOString(),
    })

    const current = await db.activeCombat.get('current')
    if (current?.combatId === combatId) {
      await db.activeCombat.put({
        ...current,
        status: 'completed',
      })
    }
  }, [])

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
    await db.monsters.add(monsterData)
  }, [])

  const updateMonster = useCallback(async (id, monsterData) => {
    await db.monsters.update(id, monsterData)
  }, [])

  const deleteMonster = useCallback(async (id) => {
    await db.monsters.delete(id)
  }, [])

  return {
    // Reactive data
    activeCombat,
    campaigns,
    characters,
    combats,
    combatHistory,
    monsterLibrary,
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
    createCombatForCampaign,
    completeCombat,
    deleteFromHistory,
    newCombat,
    // Monster actions
    addMonster,
    updateMonster,
    deleteMonster,
  }
}
