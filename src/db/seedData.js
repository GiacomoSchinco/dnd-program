// Mostri iniziali
export const seedMonsters = [
  { name: '🧌 Goblin', hp: 7, ac: 15, damage: '1d6+2', cr: '1/4', type: 'goblinoid', xp: 50 },
  { name: '👹 Orco', hp: 30, ac: 13, damage: '1d12+3', cr: '1/2', type: 'humanoid', xp: 100 },
  { name: '💀 Scheletro', hp: 13, ac: 13, damage: '1d6+2', cr: '1/4', type: 'undead', xp: 50 },
  { name: '🧙 Mago Oscuro', hp: 40, ac: 12, damage: '2d8+3', cr: '2', type: 'humanoid', xp: 450 },
  { name: '🗿 Troll', hp: 84, ac: 15, damage: '2d6+4', cr: '5', type: 'giant', xp: 1800 },
  { name: '🐉 Drago Rosso Giovane', hp: 150, ac: 18, damage: '2d10+6', cr: '10', type: 'dragon', xp: 5900 },
  { name: '🐺 Lupo Mannaro', hp: 58, ac: 11, damage: '1d8+4', cr: '3', type: 'lycanthrope', xp: 700 },
  { name: '🕷️ Ragno Gigante', hp: 26, ac: 14, damage: '1d8+3', cr: '1', type: 'beast', xp: 200 },
  { name: '👑 Re Lich', hp: 135, ac: 17, damage: '3d8+5', cr: '15', type: 'undead', xp: 13000 },
  { name: '🐉 Drago d\'Oro Antico', hp: 300, ac: 22, damage: '4d12+10', cr: '24', type: 'dragon', xp: 62000 }
];

// Campagna iniziale di esempio
export const seedCampaign = {
  name: 'La Miniera Perduta di Phandelver',
  description: 'Una campagna epica per livelli 1-5'
};

// Personaggi giocanti di esempio
export const seedCharacters = [
  { name: 'Thorin Scudodimora', class: 'Guerriero', level: 3, race: 'Nano', hp: 45, ac: 18 },
  { name: 'Lyra Sottobosco', class: 'Ladro', level: 3, race: 'Halfling', hp: 32, ac: 15 },
  { name: 'Merlin Ambrosius', class: 'Mago', level: 3, race: 'Umano', hp: 28, ac: 12 },
  { name: 'Aria Cuor di Vento', class: 'Chierico', level: 3, race: 'Elfo', hp: 38, ac: 16 }
];

// Incantesimi di esempio
export const seedSpells = [
  { name: 'Palla di Fuoco', level: 3, school: 'Evocazione', damage: '8d6', range: '150 ft', duration: 'Istantaneo' },
  { name: 'Benedizione', level: 1, school: 'Ammaestramento', effect: '+1d4 ai tiri', duration: 'Concentrazione' },
  { name: 'Lancia Infuocata', level: 2, school: 'Evocazione', damage: '3d6', range: '120 ft' },
  { name: 'Guarire Ferite', level: 1, school: 'Invocazione', healing: '1d8+mod', range: 'Contatto' },
  { name: 'Invisibilità', level: 2, school: 'Illusione', duration: '1 ora', range: 'Contatto' }
];