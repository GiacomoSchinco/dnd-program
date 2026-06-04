import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../db/database';
import { toast } from 'sonner';
import {
  normalizeCombatRecord,
  sortParticipantsByInitiative,
  getNextMonsterName,
  normalizeCombatStatus,
  normalizeParticipant,
} from './utils';
import type { ActiveCombat, Combat, CombatParticipant } from '../types';

export function useCombat() {
  const activeCombat = useLiveQuery(async () => normalizeCombatRecord(await db.activeCombat.get('current')) as unknown as ActiveCombat | undefined);
  const combats = useLiveQuery(async () => (await db.combats.orderBy('date').reverse().toArray()).map(normalizeCombatRecord).filter((c): c is Combat => !!c), [], [] as Combat[]);

  const persistLinkedCombat = useCallback(async (combatState: ActiveCombat) => {
    if (!combatState?.combatId) return;
    await db.combats.update(combatState.combatId, {
      name: combatState.name || 'Battaglia',
      date: new Date().toISOString(),
      status: normalizeCombatStatus(combatState.status || 'prepared'),
      participants: combatState.participants || [],
      currentTurnIndex: combatState.currentTurnIndex ?? 0,
      round: combatState.round ?? 1,
      campaignId: combatState.campaignId ?? null,
    });
  }, []);

  const syncCharacterHpFromParticipant = useCallback(async (participant: CombatParticipant, newHp: number) => {
    if (!participant || participant.type !== 'pc') return;
    if (participant.characterId != null) {
      await db.characters.update(participant.characterId, { currentHp: newHp });
      return;
    }
    if (participant.campaignId != null) {
      const scoped = await db.characters.where('campaignId').equals(participant.campaignId).filter((c) => c.name === participant.name).toArray();
      if (scoped.length === 1) { await db.characters.update(scoped[0].id!, { currentHp: newHp }); return; }
    }
    const byName = await db.characters.where('name').equals(participant.name).toArray();
    if (byName.length === 1) await db.characters.update(byName[0].id!, { currentHp: newHp });
  }, []);

  const saveActiveCombat = useCallback(async (combatData: Partial<ActiveCombat>) => {
    await db.activeCombat.put({ ...combatData, id: 'current' } as ActiveCombat);
  }, []);

  const applyDamage = useCallback(async (participantId: string, amount: number) => {
    try {
      const current = await db.activeCombat.get('current');
      if (!current) return;
      const target = current.participants.find((p) => p.id === participantId);
      if (!target) return;
      const currentHp = Number(target.currentHp ?? target.hp ?? 0);
      const newHp = Math.max(0, currentHp - Number(amount));
      await syncCharacterHpFromParticipant(target, newHp);
      const nextState: ActiveCombat = {
        ...current,
        participants: current.participants.map((p) => p.id === participantId ? { ...p, currentHp: newHp } : p),
      };
      await db.activeCombat.put(nextState);
      await persistLinkedCombat(nextState);
    } catch { toast.error('Errore nell\'applicazione del danno'); }
  }, [persistLinkedCombat, syncCharacterHpFromParticipant]);

  const heal = useCallback(async (participantId: string, amount: number) => {
    try {
      const current = await db.activeCombat.get('current');
      if (!current) return;
      const target = current.participants.find((p) => p.id === participantId);
      if (!target) return;
      const currentHp = Number(target.currentHp ?? target.hp ?? 0);
      const maxHp = Number(target.maxHp ?? target.hp ?? currentHp);
      const newHp = Math.min(maxHp, currentHp + Number(amount));
      await syncCharacterHpFromParticipant(target, newHp);
      const nextState: ActiveCombat = {
        ...current,
        participants: current.participants.map((p) => p.id === participantId ? { ...p, currentHp: newHp } : p),
      };
      await db.activeCombat.put(nextState);
      await persistLinkedCombat(nextState);
    } catch { toast.error('Errore nella guarigione'); }
  }, [persistLinkedCombat, syncCharacterHpFromParticipant]);

  const nextTurn = useCallback(async () => {
    try {
      const current = await db.activeCombat.get('current');
      if (!current || !current.participants.length) return;
      const nextIndex = (current.currentTurnIndex + 1) % current.participants.length;
      const newRound = nextIndex === 0 ? (current.round ?? 1) + 1 : current.round ?? 1;
      const nextState: ActiveCombat = { ...current, currentTurnIndex: nextIndex, round: newRound };
      await db.activeCombat.put(nextState);
      await persistLinkedCombat(nextState);
    } catch { toast.error('Errore nel passaggio al turno successivo'); }
  }, [persistLinkedCombat]);

  const sortByInitiative = useCallback(async () => {
    const current = await db.activeCombat.get('current');
    if (!current) return;
    const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null;
    const sorted = sortParticipantsByInitiative(current.participants ?? []);
    const nextTurnIndex = currentParticipantId ? Math.max(0, sorted.findIndex((p) => p.id === currentParticipantId)) : 0;
    const nextState: ActiveCombat = { ...current, participants: sorted, currentTurnIndex: nextTurnIndex };
    await db.activeCombat.put(nextState);
    await persistLinkedCombat(nextState);
  }, [persistLinkedCombat]);

  const addParticipant = useCallback(async (participant: Partial<CombatParticipant>) => {
    try {
      const current = await db.activeCombat.get('current');
      const currentParticipants = current?.participants ?? [];
      const participantWithName = participant?.type === 'monster'
        ? { ...participant, name: getNextMonsterName(participant?.name, currentParticipants) }
        : participant;
      const newParticipant = normalizeParticipant(participantWithName);
      if (!current) {
        const sortedParticipants = sortParticipantsByInitiative([newParticipant]);
        const nextState: ActiveCombat = {
          id: 'current',
          name: 'Nuovo Combattimento',
          status: 'prepared',
          participants: sortedParticipants,
          currentTurnIndex: 0,
          round: 1,
        };
        await db.activeCombat.put(nextState);
        await persistLinkedCombat(nextState);
      } else {
        const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null;
        const sortedParticipants = sortParticipantsByInitiative([...current.participants, newParticipant]);
        const nextTurnIndex = currentParticipantId ? Math.max(0, sortedParticipants.findIndex((p) => p.id === currentParticipantId)) : 0;
        const nextState: ActiveCombat = { ...current, participants: sortedParticipants, currentTurnIndex: nextTurnIndex };
        await db.activeCombat.put(nextState);
        await persistLinkedCombat(nextState);
      }
    } catch { toast.error('Errore nell\'aggiunta del partecipante'); }
  }, [persistLinkedCombat]);

  const removeParticipant = useCallback(async (participantId: string) => {
    try {
      const current = await db.activeCombat.get('current');
      if (!current) return;
      const filtered = current.participants.filter((p) => p.id !== participantId);
      const newIndex = Math.min(current.currentTurnIndex, Math.max(0, filtered.length - 1));
      const nextState: ActiveCombat = { ...current, participants: filtered, currentTurnIndex: newIndex };
      await db.activeCombat.put(nextState);
      await persistLinkedCombat(nextState);
    } catch { toast.error('Errore nella rimozione del partecipante'); }
  }, [persistLinkedCombat]);

  const updateParticipantInitiative = useCallback(async (participantId: string, initiative: number) => {
    const current = await db.activeCombat.get('current');
    if (!current) return;
    const currentParticipantId = current.participants?.[current.currentTurnIndex]?.id ?? null;
    const updatedParticipants = current.participants.map((p) => p.id === participantId ? { ...p, initiative: Number(initiative) || 0 } : p);
    const sortedParticipants = sortParticipantsByInitiative(updatedParticipants);
    const nextTurnIndex = currentParticipantId ? Math.max(0, sortedParticipants.findIndex((p) => p.id === currentParticipantId)) : 0;
    const nextState: ActiveCombat = { ...current, participants: sortedParticipants, currentTurnIndex: nextTurnIndex };
    await db.activeCombat.put(nextState);
    await persistLinkedCombat(nextState);
  }, [persistLinkedCombat]);

  const saveToHistory = useCallback(async (name?: string) => {
    try {
      const current = await db.activeCombat.get('current');
      if (!current) return;
      if (current.combatId) {
        await db.combats.update(current.combatId, {
          name: name || current.name || 'Combattimento',
          date: new Date().toISOString(),
          status: normalizeCombatStatus(current.status),
          participants: current.participants,
          currentTurnIndex: current.currentTurnIndex,
          round: current.round ?? 1,
          campaignId: current.campaignId ?? null,
        });
        return;
      }
      await db.combats.add({
        name: name || current.name || 'Combattimento',
        date: new Date().toISOString(),
        status: normalizeCombatStatus(current.status),
        participants: current.participants,
        currentTurnIndex: current.currentTurnIndex,
        round: current.round ?? 1,
        campaignId: current.campaignId ?? null,
      });
    } catch { toast.error('Errore nel salvataggio della battaglia'); }
  }, []);

  const loadFromHistory = useCallback(async (combatId: number) => {
    try {
      const combat = await db.combats.get(combatId);
      if (!combat) return;
      const sortedParticipants = sortParticipantsByInitiative(combat.participants ?? []);
      await db.activeCombat.put({
        id: 'current',
        combatId: combat.id,
        campaignId: combat.campaignId ?? null,
        name: combat.name,
        status: normalizeCombatStatus(combat.status),
        participants: sortedParticipants,
        currentTurnIndex: 0,
        round: combat.round ?? 1,
      });
    } catch { toast.error('Errore nel caricamento della battaglia'); }
  }, []);

  const createCombatForCampaign = useCallback(async (campaignId: number | null, name?: string) => {
    try {
      if (campaignId == null) return null;
      const combatRecord: Omit<Combat, 'id'> = {
        name: name?.trim() || 'Nuova Battaglia',
        date: new Date().toISOString(),
        status: 'prepared',
        campaignId,
        participants: [],
        currentTurnIndex: 0,
        round: 1,
      };
      return await db.combats.add(combatRecord);
    } catch { toast.error('Errore nella creazione della battaglia'); return null; }
  }, []);

  const setCombatStatus = useCallback(async (combatId: number | null | undefined, status: Combat['status']) => {
    try {
      const normalized = normalizeCombatStatus(status);
      if (combatId != null) {
        await db.combats.update(combatId, { status: normalized, date: new Date().toISOString() });
      }
      const current = await db.activeCombat.get('current');
      if (current && (combatId == null || current.combatId === combatId)) {
        await db.activeCombat.put({ ...current, status: normalized });
      }
    } catch { toast.error('Errore nel cambiamento di stato'); }
  }, []);

  const deleteFromHistory = useCallback(async (combatId: number) => {
    try { await db.combats.delete(combatId); } catch { toast.error('Errore nell\'eliminazione della battaglia'); }
  }, []);

  const newCombat = useCallback(async () => {
    const current = await db.activeCombat.get('current');
    const nextState: ActiveCombat = {
      id: 'current',
      combatId: current?.combatId,
      campaignId: current?.campaignId ?? null,
      name: current?.name || 'Nuovo Combattimento',
      status: 'prepared',
      participants: [],
      currentTurnIndex: 0,
      round: 1,
    };
    await db.activeCombat.put(nextState);
    await persistLinkedCombat(nextState);
  }, [persistLinkedCombat]);

  return {
    activeCombat,
    combats,
    combatHistory: combats,
    saveActiveCombat,
    applyDamage,
    heal,
    nextTurn,
    sortByInitiative,
    addParticipant,
    removeParticipant,
    updateParticipantInitiative,
    saveToHistory,
    loadFromHistory,
    loadCombat: loadFromHistory,
    setCombatStatus,
    createCombatForCampaign,
    completeCombat: (id: number) => setCombatStatus(id, 'terminated'),
    terminateCombat: (id: number) => setCombatStatus(id, 'terminated'),
    deleteFromHistory,
    newCombat,
  };
}
