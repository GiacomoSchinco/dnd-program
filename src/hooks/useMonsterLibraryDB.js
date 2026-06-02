import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '../db/database'
import { toast } from 'sonner'

export function useMonsterLibraryDB() {
  const monsterLibrary = useLiveQuery(() => db.monsters.toArray(), [], [])

  const addMonster = useCallback(async (monsterData) => {
    try {
      await db.monsters.add(monsterData)
    } catch (err) {
      console.error('[useMonsterLibraryDB] addMonster', err)
      toast.error("Errore nell'aggiunta del mostro")
    }
  }, [])

  const updateMonster = useCallback(async (id, monsterData) => {
    try {
      await db.monsters.update(id, monsterData)
    } catch (err) {
      console.error('[useMonsterLibraryDB] updateMonster', err)
      toast.error('Errore nella modifica del mostro')
    }
  }, [])

  const deleteMonster = useCallback(async (id) => {
    try {
      await db.monsters.delete(id)
    } catch (err) {
      console.error('[useMonsterLibraryDB] deleteMonster', err)
      toast.error("Errore nell'eliminazione del mostro")
    }
  }, [])

  const importMonsters = useCallback(async (monsters) => {
    try {
      await db.monsters.bulkAdd(monsters)
    } catch (err) {
      console.error('[useMonsterLibraryDB] importMonsters', err)
      toast.error("Errore nell'importazione dei mostri")
    }
  }, [])

  return { monsterLibrary, addMonster, updateMonster, deleteMonster, importMonsters }
}
