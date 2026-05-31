import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { db } from './db/database'
import { seedCampaigns, seedCharactersByCampaign } from './db/seedData'
import { CampaignProvider } from './context/CampaignContext'

// Seeding iniziale del database
const initializeDatabase = async () => {
  try {
    const existingCampaigns = await db.campaigns.toArray()
    const campaignIdByName = new Map(existingCampaigns.map((campaign) => [campaign.name, campaign.id]))

    for (const campaign of seedCampaigns) {
      if (campaignIdByName.has(campaign.name)) continue
      const insertedId = await db.campaigns.add(campaign)
      campaignIdByName.set(campaign.name, insertedId)
    }

    for (const group of seedCharactersByCampaign) {
      const campaignId = campaignIdByName.get(group.campaignName)
      if (!campaignId) continue

      const existingCharacters = await db.characters.where('campaignId').equals(campaignId).toArray()
      const existingCharacterNames = new Set(existingCharacters.map((character) => character.name))

      for (const character of group.characters) {
        if (existingCharacterNames.has(character.name)) continue

        await db.characters.add({
          ...character,
          campaignId,
          currentHp: character.hp,
          maxHp: character.hp,
        })
      }
    }

    console.log('Seed campagne/personaggi completato')
  } catch (error) {
    console.error('Errore inizializzazione database:', error)
  }
}

// Esegui seeding all'avvio
initializeDatabase()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CampaignProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CampaignProvider>
  </React.StrictMode>,
)