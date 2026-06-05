import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect } from 'react';
import { db, seedMonsters, seedSpells } from '../db/database';
import { toast } from 'sonner';
import type { Monster, Npc, Spell } from '../types';

// Flag a livello di modulo: il seed viene eseguito una sola volta per sessione
let _seedInitialized = false;

export function useLibrary() {
  const monsterLibrary = useLiveQuery(() => db.monsters.toArray(), [], [] as Monster[]);
  const npcLibrary = useLiveQuery(() => db.npcs.toArray(), [], [] as Npc[]);
  const spells = useLiveQuery(() => db.spells.orderBy('level').toArray(), [], [] as Spell[]);

  useEffect(() => {
    if (_seedInitialized) return;
    _seedInitialized = true;
    const initializeDB = async () => {
      try {
        await db.transaction('rw', [db.monsters, db.spells], async () => {
          if (await db.monsters.count() === 0) await db.monsters.bulkAdd(seedMonsters);
          if (await db.spells.count() === 0) await db.spells.bulkAdd(seedSpells);
        });
      } catch {
        // Reset flag so next mount can retry
        _seedInitialized = false;
        toast.error('Errore nel caricamento dei dati iniziali');
      }
    };
    initializeDB();
  }, []);

  const addMonster = useCallback(async (data: Omit<Monster, 'id'>) => {
    try { await db.monsters.add(data); } catch { toast.error(`Errore nell'aggiunta del mostro`); }
  }, []);

  const updateMonster = useCallback(async (id: number, data: Partial<Monster>) => {
    try { await db.monsters.update(id, data); } catch { toast.error(`Errore nella modifica del mostro`); }
  }, []);

  const deleteMonster = useCallback(async (id: number) => {
    try { await db.monsters.delete(id); } catch { toast.error(`Errore nell'eliminazione del mostro`); }
  }, []);

  const importMonsters = useCallback(async (items: Omit<Monster, 'id'>[]) => {
    try { await db.monsters.bulkAdd(items); } catch { toast.error(`Errore nell'importazione dei mostri`); }
  }, []);

  const addNpc = useCallback(async (data: Omit<Npc, 'id'>) => {
    try { await db.npcs.add(data); } catch { toast.error(`Errore nell'aggiunta dell'NPC`); }
  }, []);

  const updateNpc = useCallback(async (id: number, data: Partial<Npc>) => {
    try { await db.npcs.update(id, data); } catch { toast.error(`Errore nella modifica dell'NPC`); }
  }, []);

  const deleteNpc = useCallback(async (id: number) => {
    try { await db.npcs.delete(id); } catch { toast.error(`Errore nell'eliminazione dell'NPC`); }
  }, []);

  const importNpcs = useCallback(async (items: Omit<Npc, 'id'>[]) => {
    try { await db.npcs.bulkAdd(items); } catch { toast.error(`Errore nell'importazione degli NPCs`); }
  }, []);

  const addSpell = useCallback(async (data: Omit<Spell, 'id'>) => {
    try { await db.spells.add(data); } catch { toast.error(`Errore nell'aggiunta della magia`); }
  }, []);

  const updateSpell = useCallback(async (id: number, data: Partial<Spell>) => {
    try { await db.spells.update(id, data); } catch { toast.error(`Errore nella modifica della magia`); }
  }, []);

  const deleteSpell = useCallback(async (id: number) => {
    try { await db.spells.delete(id); } catch { toast.error(`Errore nell'eliminazione della magia`); }
  }, []);

  const importSpells = useCallback(async (items: Omit<Spell, 'id'>[]) => {
    try { await db.spells.bulkAdd(items); } catch { toast.error(`Errore nell'importazione delle magie`); }
  }, []);

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
  };
}
