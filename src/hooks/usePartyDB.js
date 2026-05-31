import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect } from 'react'
import { db } from '../db/database'

export function usePartyDB() {
  const campaigns = useLiveQuery(() => db.campaigns.toArray(), [], [])
  const characters = useLiveQuery(() => db.characters.toArray(), [], [])

  useEffect(() => {
    const ensureCurrentHp = async () => {
      const all = await db.characters.toArray()
      for (const char of all) {
        // Usa il massimo tra maxHp e hp per recuperare record salvati prima del fix
      const maxHp = Math.max(Number(char.maxHp) || 0, Number(char.hp) || 0) || 1
        const rawCurrent = char.currentHp
        if (rawCurrent == null || Number.isNaN(Number(rawCurrent))) {
          await db.characters.update(char.id, { currentHp: maxHp, maxHp })
          continue
        }
        const clamped = Math.max(0, Math.min(maxHp, Number(rawCurrent)))
        if (clamped !== Number(rawCurrent) || maxHp !== Number(char.maxHp)) {
          await db.characters.update(char.id, { currentHp: clamped, maxHp })
        }
      }
    }

    void ensureCurrentHp()
  }, [])

  // ── Campaigns ─────────────────────────────────────────────────────────────
  const addCampaign = useCallback(async (campaignInput) => {
    const payload =
      typeof campaignInput === 'string'
        ? { name: campaignInput }
        : {
            name: campaignInput?.name || 'Nuova Campagna',
            description: campaignInput?.description || '',
            createdAt: campaignInput?.createdAt || new Date().toISOString(),
          }

    const insertedId = await db.campaigns.add(payload)
    return insertedId
  }, [])

  const updateCampaign = useCallback(async (id, campaignInput) => {
    const payload =
      typeof campaignInput === 'string'
        ? { name: campaignInput }
        : {
            name: campaignInput?.name || 'Campagna',
            description: campaignInput?.description || '',
          }

    await db.campaigns.update(id, payload)
  }, [])

  const deleteCampaign = useCallback(async (id) => {
    await db.campaigns.delete(id)
    await db.characters.where('campaignId').equals(id).delete()
  }, [])

  // ── Characters ────────────────────────────────────────────────────────────
  const addCharacter = useCallback(async (char) => {
    const maxHp = Number(char.maxHp) || 1
    const currentHp = char.currentHp ?? maxHp
    await db.characters.add({
      ...char,
      maxHp,
      currentHp: Math.max(0, Math.min(maxHp, Number(currentHp))),
    })
  }, [])

  const updateCharacter = useCallback(async (id, data) => {
    const existing = await db.characters.get(id)
    if (!existing) return

    const merged = { ...existing, ...data }
    const maxHp = Number(merged.maxHp) || 1
    const currentHp = merged.currentHp ?? maxHp

    await db.characters.update(id, {
      ...data,
      maxHp,
      currentHp: Math.max(0, Math.min(maxHp, Number(currentHp))),
    })
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
