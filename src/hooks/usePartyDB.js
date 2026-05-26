import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback } from 'react'
import { db } from '../db/database'

export function usePartyDB() {
  const campaigns = useLiveQuery(() => db.campaigns.toArray(), [], [])
  const characters = useLiveQuery(() => db.characters.toArray(), [], [])

  // ── Campaigns ─────────────────────────────────────────────────────────────
  const addCampaign = useCallback(async (name) => {
    await db.campaigns.add({ name })
  }, [])

  const updateCampaign = useCallback(async (id, name) => {
    await db.campaigns.update(id, { name })
  }, [])

  const deleteCampaign = useCallback(async (id) => {
    await db.campaigns.delete(id)
    await db.characters.where('campaignId').equals(id).delete()
  }, [])

  // ── Characters ────────────────────────────────────────────────────────────
  const addCharacter = useCallback(async (char) => {
    await db.characters.add(char)
  }, [])

  const updateCharacter = useCallback(async (id, data) => {
    await db.characters.update(id, data)
  }, [])

  const deleteCharacter = useCallback(async (id) => {
    await db.characters.delete(id)
  }, [])

  return {
    campaigns,
    characters,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  }
}
