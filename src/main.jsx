import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { db } from './db/database'
import { seedCampaign, seedCharacters } from './db/seedData'

// Seeding iniziale del database
const initializeDatabase = async () => {
  try {
    // Crea campagna iniziale se non esiste
    const campaigns = await db.campaigns.toArray();
    if (campaigns.length === 0) {
      const campaignId = await db.campaigns.add(seedCampaign);
      
      // Aggiungi personaggi alla campagna
      for (const character of seedCharacters) {
        await db.characters.add({
          ...character,
          campaignId: campaignId
        });
      }
      console.log('Database inizializzato con campagna e personaggi');
    }
  } catch (error) {
    console.error('Errore inizializzazione database:', error);
  }
};

// Esegui seeding all'avvio
initializeDatabase();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)