import Dexie from 'dexie';

export const db = new Dexie('DnDCombatDB');

// Versione 1: Struttura base
db.version(1).stores({
  activeCombat: 'id',
  combats: '++id, date, name',
  monsters: '++id, name',
});

// Versione 2: Aggiunta campagne, personaggi e incantesimi
db.version(2).stores({
  activeCombat: 'id',
  combats: '++id, date, name, campaignId',     // aggiunto campaignId
  monsters: '++id, name, cr',
  campaigns: '++id, name, description',         // NUOVA: campagne
  characters: '++id, campaignId, name, class',  // NUOVA: personaggi
  spells: '++id, name, level, school',          // NUOVA: incantesimi
}).upgrade(async (trans) => {
  // Migrazione: aggiungi campaignId ai combats esistenti
  const combats = await trans.table('combats').toArray();
  for (const combat of combats) {
    if (!combat.campaignId) {
      await trans.table('combats').update(combat.id, { campaignId: null });
    }
  }
});

export const CombatStatus = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ENDED: 'ended'
};

// Esporta tipi (utile per React)
export const CharacterClasses = {
  BARBARO: 'Barbaro',
  BARDO: 'Bardo',
  CHIERICO: 'Chierico',
  DRUIDO: 'Druido',
  GUERRIERO: 'Guerriero',
  LADRO: 'Ladro',
  MAGO: 'Mago',
  PALADINO: 'Paladino',
  RANGER: 'Ranger',
  STREGONE: 'Stregone',
  WARLOCK: 'Warlock'
};

export const SpellSchools = {
  ABITURAZIONE: 'Abiurazione',
  AMMALIAMENTO: 'Ammaestramento',
  DIVINAZIONE: 'Divinazione',
  EVOCAZIONE: 'Evocazione',
  ILLUSIONE: 'Illusione',
  INVOCAZIONE: 'Invocazione',
  NECROMANZIA: 'Necromanzia',
  TRASMUTAZIONE: 'Trasmutazione'
};