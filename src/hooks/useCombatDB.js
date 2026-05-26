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

  const applyDamage = useCallback(async (participantId, amount) => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    await db.activeCombat.put({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: Math.max(0, p.currentHp - amount) }
          : p,
      ),
    })
  }, [])

  const heal = useCallback(async (participantId, amount) => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    await db.activeCombat.put({
      ...current,
      participants: current.participants.map((p) =>
        p.id === participantId
          ? { ...p, currentHp: Math.min(p.maxHp, p.currentHp + amount) }
          : p,
      ),
    })
  }, [])

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
  }, [])

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
  }, [])

  const addParticipant = useCallback(async (participant) => {
    const newParticipant = { id: crypto.randomUUID(), ...participant }
    const current = await db.activeCombat.get('current')
    if (!current) {
      await db.activeCombat.put({
        id: 'current',
        name: 'Nuovo Combattimento',
        participants: [newParticipant],
        currentTurnIndex: 0,
        round: 1,
      })
    } else {
      await db.activeCombat.put({
        ...current,
        participants: [...current.participants, newParticipant],
      })
    }
  }, [])

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
  }, [])

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
    },
    [],
  )

  // ── History actions ────────────────────────────────────────────────────────
  const saveToHistory = useCallback(async (name) => {
    const current = await db.activeCombat.get('current')
    if (!current) return
    await db.combats.add({
      name: name || current.name || 'Combattimento',
      date: new Date().toISOString(),
      participants: current.participants,
      currentTurnIndex: current.currentTurnIndex,
      round: current.round ?? 1,
    })
  }, [])

  const loadFromHistory = useCallback(async (combatId) => {
    const combat = await db.combats.get(combatId)
    if (!combat) return
    await db.activeCombat.put({
      id: 'current',
      name: combat.name,
      participants: combat.participants,
      currentTurnIndex: 0,
      round: combat.round ?? 1,
    })
  }, [])

  const deleteFromHistory = useCallback(async (combatId) => {
    await db.combats.delete(combatId)
  }, [])

  const newCombat = useCallback(async () => {
    await db.activeCombat.put({
      id: 'current',
      name: 'Nuovo Combattimento',
      participants: [],
      currentTurnIndex: 0,
      round: 1,
    })
  }, [])

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
    deleteFromHistory,
    newCombat,
    // Monster actions
    addMonster,
    updateMonster,
    deleteMonster,
  }
}
