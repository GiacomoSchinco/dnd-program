import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '../db/database'
import { toast } from 'sonner'

export function useNpcLibraryDB() {
  const npcLibrary = useLiveQuery(() => db.npcs.toArray(), [], [])

  const addNpc = useCallback(async (npcData) => {
    try {
      await db.npcs.add(npcData)
    } catch (err) {
      console.error('[useNpcLibraryDB] addNpc', err)
      toast.error("Errore nell'aggiunta dell'NPC")
    }
  }, [])

  const updateNpc = useCallback(async (id, npcData) => {
    try {
      await db.npcs.update(id, npcData)
    } catch (err) {
      console.error('[useNpcLibraryDB] updateNpc', err)
      toast.error("Errore nella modifica dell'NPC")
    }
  }, [])

  const deleteNpc = useCallback(async (id) => {
    try {
      await db.npcs.delete(id)
    } catch (err) {
      console.error('[useNpcLibraryDB] deleteNpc', err)
      toast.error("Errore nell'eliminazione dell'NPC")
    }
  }, [])

  const importNpcs = useCallback(async (npcs) => {
    try {
      await db.npcs.bulkAdd(npcs)
    } catch (err) {
      console.error('[useNpcLibraryDB] importNpcs', err)
      toast.error("Errore nell'importazione degli NPC")
    }
  }, [])

  return { npcLibrary, addNpc, updateNpc, deleteNpc, importNpcs }
}
