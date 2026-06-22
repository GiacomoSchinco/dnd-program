import type { Monster } from '../types';
import { loadSeedSpells, clearSpellsCache } from '../utils/spellMapper';

// Re-export per comodità
export { loadSeedSpells, clearSpellsCache };

// Mostri iniziali (seed)
export const seedMonsters: Omit<Monster, 'id'>[] = [
  { name: 'Goblin', hp: 7, ac: 15, damage: '1d6+2', cr: '1/4', type: 'goblinoid' },
  { name: 'Orco', hp: 30, ac: 13, damage: '1d12+3', cr: '1/2', type: 'humanoid' },
  { name: 'Scheletro', hp: 13, ac: 13, damage: '1d6+2', cr: '1/4', type: 'undead' },
  { name: 'Mago Oscuro', hp: 40, ac: 12, damage: '2d8+3', cr: '2', type: 'humanoid' },
  { name: 'Troll', hp: 84, ac: 15, damage: '2d6+4', cr: '5', type: 'giant' },
  { name: 'Drago Rosso Giovane', hp: 150, ac: 18, damage: '2d10+6', cr: '10', type: 'dragon' },
  { name: 'Lupo Mannaro', hp: 58, ac: 11, damage: '1d8+4', cr: '3', type: 'lycanthrope' },
  { name: 'Ragno Gigante', hp: 26, ac: 14, damage: '1d8+3', cr: '1', type: 'beast' },
  { name: 'Re Lich', hp: 135, ac: 17, damage: '3d8+5', cr: '15', type: 'undead' },
  { name: "Drago d'Oro Antico", hp: 300, ac: 22, damage: '4d12+10', cr: '24', type: 'dragon' },
];

// Campagne e personaggi NON pre-popolati: il DM parte da un DB pulito.
export const seedCampaigns = [];
export const seedCharactersByCampaign = [];
export const seedCampaign = null;
export const seedCharacters = [];

// Incantesimi seed rimossi: ora vengono caricati da public/spells.json
// tramite la funzione loadSeedSpells() importata sopra.
