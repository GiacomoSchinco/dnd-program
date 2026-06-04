import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../db/database';
import type { Campaign, Character } from '../types';

export function useCampaigns() {
  const campaigns = useLiveQuery(() => db.campaigns.toArray(), [], [] as Campaign[]);
  const characters = useLiveQuery(() => db.characters.toArray(), [], [] as Character[]);

  const addCampaign = useCallback(async (campaignInput: string | Partial<Campaign>) => {
    const payload: Omit<Campaign, 'id'> = typeof campaignInput === 'string'
      ? { name: campaignInput }
      : { name: campaignInput?.name || 'Nuova Campagna', description: campaignInput?.description || '', createdAt: new Date().toISOString() };
    return await db.campaigns.add(payload);
  }, []);

  const updateCampaign = useCallback(async (id: number, campaignInput: string | Partial<Campaign>) => {
    const payload: Partial<Campaign> = typeof campaignInput === 'string'
      ? { name: campaignInput }
      : { name: campaignInput?.name || 'Campagna', description: campaignInput?.description || '' };
    await db.campaigns.update(id, payload);
  }, []);

  const deleteCampaign = useCallback(async (id: number) => {
    await db.campaigns.delete(id);
    await db.characters.where('campaignId').equals(id).delete();
  }, []);

  const addCharacter = useCallback(async (char: Omit<Character, 'id'>) => {
    const maxHp = Number(char.maxHp) || 1;
    const currentHp = char.currentHp ?? maxHp;
    await db.characters.add({ ...char, maxHp, currentHp: Math.max(0, Math.min(maxHp, Number(currentHp))) });
  }, []);

  const updateCharacter = useCallback(async (id: number, data: Partial<Character>) => {
    const existing = await db.characters.get(id);
    if (!existing) return;
    const merged = { ...existing, ...data };
    const maxHp = Number(merged.maxHp) || 1;
    const currentHp = merged.currentHp ?? maxHp;
    await db.characters.update(id, { ...data, maxHp, currentHp: Math.max(0, Math.min(maxHp, Number(currentHp))) });
  }, []);

  const deleteCharacter = useCallback(async (id: number) => { await db.characters.delete(id); }, []);

  return {
    campaigns,
    characters,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
