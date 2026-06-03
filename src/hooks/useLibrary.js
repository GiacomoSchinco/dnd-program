import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { db, seedMonsters, seedSpells } from '../db/database'
import { toast } from 'sonner'

export function useLibrary() {
  const monsterLibrary = useLiveQuery(() => db.monsters.toArray(), [], [])
  const npcLibrary = useLiveQuery(() => db.npcs.toArray(), [], [])
  const spells = useLiveQuery(() => db.spells.orderBy('level').toArray(), [], [])

  useEffect(() => {
    const initializeDB = async () => {
      await db.transaction('rw', [db.monsters, db.spells], async () => {
        if (await db.monsters.count() === 0) await db.monsters.bulkAdd(seedMonsters)
        if (await db.spells.count() === 0) await db.spells.bulkAdd(seedSpells)
      })
    }
    initializeDB()
  }, [])

  const addMonster = useCallback(async (data) => {
    try { await db.monsters.add(data) } catch { toast.error(`Errore nell'aggiunta del mostro`) }
  }, [])

  const updateMonster = useCallback(async (id, data) => {
    try { await db.monsters.update(id, data) } catch { toast.error(`Errore nella modifica del mostro`) }
  }, [])

  const deleteMonster = useCallback(async (id) => {
    try { await db.monsters.delete(id) } catch { toast.error(`Errore nell'eliminazione del mostro`) }
  }, [])

  const importMonsters = useCallback(async (items) => {
    try { await db.monsters.bulkAdd(items) } catch { toast.error(`Errore nell'importazione dei mostri`) }
  }, [])

  const addNpc = useCallback(async (data) => {
    try { await db.npcs.add(data) } catch { toast.error(`Errore nell'aggiunta dell'NPC`) }
  }, [])

  const updateNpc = useCallback(async (id, data) => {
    try { await db.npcs.update(id, data) } catch { toast.error(`Errore nella modifica dell'NPC`) }
  }, [])

  const deleteNpc = useCallback(async (id) => {
    try { await db.npcs.delete(id) } catch { toast.error(`Errore nell'eliminazione dell'NPC`) }
  }, [])

  const importNpcs = useCallback(async (items) => {
    try { await db.npcs.bulkAdd(items) } catch { toast.error(`Errore nell'importazione degli NPCs`) }
  }, [])

  const addSpell = useCallback(async (data) => {
    try { await db.spells.add(data) } catch { toast.error(`Errore nell'aggiunta della magia`) }
  }, [])

  const updateSpell = useCallback(async (id, data) => {
    try { await db.spells.update(id, data) } catch { toast.error(`Errore nella modifica della magia`) }
  }, [])

  const deleteSpell = useCallback(async (id) => {
    try { await db.spells.delete(id) } catch { toast.error(`Errore nell'eliminazione della magia`) }
  }, [])

  const importSpells = useCallback(async (items) => {
    try { await db.spells.bulkAdd(items) } catch { toast.error(`Errore nell'importazione delle magie`) }
  }, [])

  return {
    monsterLibrary,
    npcLibrary,
    spells,
    addMonster,
    updateMonster,
    deleteMonster,
    importMonsters,
    addNpc,
    updateNpc,
    deleteNpc,
    importNpcs,
    addSpell,
    updateSpell,
    deleteSpell,
    importSpells,
  }
}
