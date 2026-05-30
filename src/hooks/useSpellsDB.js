import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { db } from '../db/database'
import { seedSpells } from '../db/seedData'

async function initializeSpells() {
  const count = await db.spells.count()
  if (count === 0) {
    await db.spells.bulkAdd(seedSpells)
  }
}

export function useSpellsDB() {
  const spells = useLiveQuery(
    () => db.spells.orderBy('level').toArray(),
    [],
    [],
  )

  useEffect(() => {
    initializeSpells()
  }, [])

  const addSpell = useCallback(async (spell) => {
    await db.spells.add(spell)
  }, [])

  const updateSpell = useCallback(async (id, data) => {
    await db.spells.update(id, data)
  }, [])

  const deleteSpell = useCallback(async (id) => {
    await db.spells.delete(id)
  }, [])

  return { spells, addSpell, updateSpell, deleteSpell }
}
