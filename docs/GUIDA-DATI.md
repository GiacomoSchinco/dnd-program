# 🗂️ Guida alle Strutture Dati e Come Inserirle

Questo progetto usa **IndexedDB** tramite [Dexie.js](https://dexie.org/) come database locale (lato browser). I dati vengono salvati automaticamente nel tuo browser e **non** richiedono server o backend.

---

## 📦 Panoramica delle Entità

| Entità | Descrizione | Tabella DB | Hook di accesso |
|--------|-------------|-----------|----------------|
| **Campaign** | Campagna di gioco | `db.campaigns` | `useCampaigns()` |
| **Character** | Personaggio giocante (PG) | `db.characters` | `useCampaigns()` |
| **Monster** | Mostro nella libreria | `db.monsters` | `useLibrary()` |
| **Npc** | PNG nella libreria | `db.npcs` | `useLibrary()` |
| **Spell** | Incantesimo nella libreria | `db.spells` | `useLibrary()` |
| **Combat** | Battaglia salvata in storico | `db.combats` | `useCombat()` |
| **ActiveCombat** | Battaglia in corso (solo 1) | `db.activeCombat` | `useCombat()` |

---

## 1️⃣ Campaign (Campagna)

```typescript
interface Campaign {
  id?: number;          // Auto-generato dal DB
  name: string;         // Nome della campagna (obbligatorio)
  description?: string; // Descrizione (opzionale)
  createdAt?: string;   // Data ISO (es. "2024-03-15T10:30:00.000Z")
}
```

### Come crearla (dal codice)

```typescript
import { useDB } from '../hooks/useDB';

const { addCampaign } = useDB();

// Metodo 1: solo nome
const id = await addCampaign('La Mia Campagna');

// Metodo 2: oggetto completo
const id = await addCampaign({
  name: 'La Mia Campagna',
  description: 'Un\'avventura epica nel continente di...',
  createdAt: new Date().toISOString(), // se omesso, lo aggiunge l'hook
});

console.log(`Creata campagna con ID: ${id}`);
```

### Come modificarla

```typescript
const { updateCampaign } = useDB();

// Modifica nome
await updateCampaign(1, 'Nuovo Nome');

// Modifica nome e descrizione
await updateCampaign(1, {
  name: 'Nuovo Nome',
  description: 'Nuova descrizione',
});
```

### Come eliminarla

```typescript
const { deleteCampaign } = useDB();

// Elimina la campagna (e TUTTI i personaggi associati)
await deleteCampaign(1);
```

### Dalla UI

1. Vai nella pagina **Campagne** (dalla topbar)
2. Clicca **"Nuova Campagna"**
3. Compila il modulo e salva

---

## 2️⃣ Character (Personaggio)

```typescript
interface Character {
  id?: number;               // Auto-generato
  campaignId?: number | null; // ID della campagna associata (null = senza campagna)
  name: string;              // Nome (obbligatorio)
  class?: string;            // Classe (es. "Guerriero", "Mago")
  race?: string;             // Razza (es. "Umano", "Elfo")
  level?: number;            // Livello
  hp: number;                // Punti ferita (usato come maxHp se maxHp non specificato)
  maxHp: number;             // Punti ferita massimi
  currentHp?: number;        // PF correnti (se omesso = maxHp)
  ac?: number;               // Classe armatura
  initiative?: number;       // Valore di iniziativa
  notes?: string;            // Note opzionali
}
```

### Come crearlo

```typescript
const { addCharacter } = useDB();

await addCharacter({
  name: 'Gandalf',
  class: 'Mago',
  race: 'Umano',
  level: 5,
  hp: 40,
  maxHp: 40,
  currentHp: 32,    // se omesso, parte da maxHp
  ac: 15,
  initiative: 3,
  campaignId: 1,     // lo associa alla campagna con ID 1
  notes: 'Porta sempre con sé Glamdring',
});
```

### Come modificarlo

```typescript
const { updateCharacter } = useDB();

// Modifica solo alcuni campi
await updateCharacter(1, {
  level: 6,
  currentHp: 40,
  maxHp: 45,        // è salito di livello!
});

// L'hook aggiorna eventuali PG presenti nel combattimento attivo
```

### Come eliminarlo

```typescript
const { deleteCharacter } = useDB();
await deleteCharacter(1);
```

### Dalla UI

1. Vai su **Personaggi**
2. Clicca **"Nuovo Personaggio"**
3. Scegli/clona dalla libreria o crea uno nuovo

---

## 3️⃣ Monster (Mostro - Libreria)

```typescript
interface Monster {
  id?: number;
  name: string;                // Nome (obbligatorio)
  cr?: string | number;        // Grado di sfida (es. "1/4", "5", "10")
  hp?: number;                 // Punti ferita
  maxHp?: number;              // PF massimi
  ac?: number;                 // Classe armatura
  initiative?: number;         // Bonus iniziativa
  type?: string;               // Tipo (es. "goblinoid", "dragon", "undead")
  size?: string;               // Taglia (es. "Piccola", "Grande")
  alignment?: string;          // Allineamento
  damage?: string;             // Danno (es. "1d6+2")
  description?: string;        // Descrizione
  // ... altri campi avanzati (abilities, savingThrows, skills, resistances, etc.)
}
```

### Come crearlo

```typescript
const { addMonster } = useDB();

await addMonster({
  name: 'Drago Rosso Antico',
  hp: 300,
  ac: 22,
  damage: '4d12+10',
  cr: '24',
  type: 'dragon',
});
```

### Importazione CSV

```typescript
import { importMonsters } from '../hooks/useDB'; // tramite useDB()
// oppure usa la toolbar CSV nella pagina Mostri

// Il CSV deve avere le colonne: name, hp, ac, damage, cr, type
const csvData = [
  { name: 'Goblin', hp: '7', ac: '15', damage: '1d6+2', cr: '1/4', type: 'goblinoid' },
  { name: 'Orco', hp: '30', ac: '13', damage: '1d12+3', cr: '1/2', type: 'humanoid' },
];

// Ogni riga viene mappata con rowToMonster() in utils/csvIO.ts
await importMonsters(csvData);
```

### Dalla UI

1. Vai su **Mostri**
2. Clicca **"Nuovo Mostro"** per crearne uno manualmente
3. Usa il pulsante **CSV** per importare da file
4. Usa **"Clone"** su un mostro esistente per duplicarlo

---

## 4️⃣ Npc (PNG - Libreria)

```typescript
interface Npc {
  id?: number;
  name: string;           // Nome (obbligatorio)
  race?: string;          // Razza
  class?: string;         // Classe
  level?: number;         // Livello
  hp?: number;            // PF
  maxHp?: number;
  ac?: number;            // CA
  initiative?: number;    // Bonus iniziativa
  notes?: string;         // Note
  description?: string;   // Descrizione
}
```

### Come crearlo

```typescript
const { addNpc } = useDB();

await addNpc({
  name: 'Elrond',
  race: 'Mezzelfo',
  class: 'Mago',
  level: 15,
  hp: 90,
  ac: 16,
  description: 'Signore di Gran Burrone',
});
```

### Dalla UI

1. Vai su **PNG**
2. Crea o importa come per i mostri

---

## 5️⃣ Spell (Incantesimo - Libreria)

```typescript
interface Spell {
  id?: number;
  name: string;               // Nome (obbligatorio)
  level: number;              // Livello (0=trucchetto, 1..9)
  school: string;             // Scuola di magia
  castingTime?: string;       // Tempo di lancio
  range?: string;             // Gittata
  components?: string;        // Componenti (V, S, M)
  duration?: string;          // Durata
  description?: string;       // Descrizione
  higherLevels?: string;      // Effetto a livelli superiori
  material?: string;          // Materiale (se componente M)
  concentration?: boolean;    // Richiede concentrazione?
  ritual?: boolean;           // Può essere lanciato come rituale?
  damage?: string;            // Danno (es. "8d6")
  healing?: string;           // Cura (es. "1d8+mod")
  saveType?: string;          // Tiro salvezza (es. "Destrezza")
  effect?: string;            // Effetto completo
}
```

### Come crearlo

```typescript
const { addSpell } = useDB();

await addSpell({
  name: 'Palla di Fuoco',
  level: 3,
  school: 'Evocazione',
  castingTime: '1 azione',
  range: '150 ft',
  components: 'V, S, M',
  material: 'una pallina di guano di pipistrello e zolfo',
  duration: 'Istantaneo',
  damage: '8d6',
  saveType: 'Destrezza',
  effect: 'Un punto luminoso schizza dalla tua dita...',
});
```

### Scuole di magia disponibili

```typescript
const SpellSchools = {
  ABITURAZIONE: 'Abiurazione',
  AMMALIAMENTO: 'Ammaestramento',    // notare: è "Ammaestramento" non "Ammaliamento"
  DIVINAZIONE: 'Divinazione',
  EVOCAZIONE: 'Evocazione',
  ILLUSIONE: 'Illusione',
  INVOCAZIONE: 'Invocazione',
  NECROMANZIA: 'Necromanzia',
  TRASMUTAZIONE: 'Trasmutazione',
};
```

### Dalla UI

1. Vai su **Incantesimi**
2. Usa il form o importa CSV (colonne: name, level, school, damage, healing, range, duration, effect)

---

## 6️⃣ Combat (Battaglia)

### Combat (storico)

```typescript
interface Combat {
  id?: number;                      // Auto-generato
  name: string;                     // Nome battaglia
  date: string;                     // Data ISO
  status: 'prepared' | 'in_progress' | 'terminated';
  participants: CombatParticipant[]; // Lista partecipanti
  currentTurnIndex: number;         // Indice del turno corrente
  round: number;                    // Round corrente
  campaignId?: number | null;       // Campagna associata
}
```

### ActiveCombat (battaglia in corso)

```typescript
interface ActiveCombat {
  id: 'current';                    // Fisso: esiste sempre un solo combattimento attivo
  combatId?: number;                // Riferimento allo storico (se salvato)
  campaignId?: number | null;
  name: string;
  status: 'prepared' | 'in_progress' | 'terminated';
  participants: CombatParticipant[];
  currentTurnIndex: number;
  round: number;
}
```

### CombatParticipant

```typescript
interface CombatParticipant {
  id: string;                        // UUID auto-generato
  name: string;                      // Nome
  type: 'pc' | 'npc' | 'monster';   // Tipo partecipante
  characterId?: number;              // Riferimento al PG (se type='pc')
  campaignId?: number | null;
  hp: number;
  maxHp: number;
  currentHp: number;
  ac?: number;
  initiative: number;
  notes?: string;
  damage?: string;                   // Danno in dado (es. "1d6+2")
}
```

### Aggiungere un partecipante al combattimento

```typescript
const { addParticipant } = useCombat();

// Aggiungi un mostro
await addParticipant({
  name: 'Goblin',
  type: 'monster',
  hp: 7,
  maxHp: 7,
  ac: 15,
  initiative: 10,
  damage: '1d6+2',
});

// Aggiungi un PG
await addParticipant({
  name: 'Gandalf',
  type: 'pc',
  characterId: 1,
  hp: 40,
  maxHp: 40,
  currentHp: 32,
  ac: 15,
  initiative: 18,
});

// Aggiungi un PNG
await addParticipant({
  name: 'Elrond',
  type: 'npc',
  hp: 90,
  maxHp: 90,
  ac: 16,
  initiative: 14,
});
```

### Gestire danni e cure

```typescript
const { applyDamage, heal } = useCombat();

// Infligge danno (non può andare sotto 0)
await applyDamage('uuid-del-partecipante', 12);

// Cura (non può superare i maxHp)
await heal('uuid-del-partecipante', 8);

// I PF correnti vengono automaticamente sincronizzati
// con il Personaggio (se type='pc' e characterId presente)
```

### Ciclo di combattimento

```typescript
const { nextTurn, sortByInitiative, saveToHistory, loadCombat } = useCombat();

// Ordina per iniziativa (decrescente)
await sortByInitiative();

// Passa al turno successivo (quando torna a 0 incrementa il round)
await nextTurn();

// Salva in storico
await saveToHistory('Battaglia del Fosso di Helm');

// Carica da storico (ripristina il combattimento attivo)
await loadCombat(combatId);
```

---

## 🔧 Glossario Hook e Funzioni

### `useDB()` - Hook principale
Unisce tutti i sotto-hook:

| Funzione | Entità | Operazione |
|----------|--------|-----------|
| `campaigns` | Campaign | Lettura (live, si aggiorna automaticamente) |
| `addCampaign(input)` | Campaign | Crea |
| `updateCampaign(id, input)` | Campaign | Modifica |
| `deleteCampaign(id)` | Campaign | Elimina (+ personaggi associati) |
| `characters` | Character | Lettura |
| `addCharacter(data)` | Character | Crea |
| `updateCharacter(id, data)` | Character | Modifica |
| `deleteCharacter(id)` | Character | Elimina |
| `monsterLibrary` | Monster | Lettura |
| `addMonster(data)` | Monster | Crea |
| `updateMonster(id, data)` | Monster | Modifica |
| `deleteMonster(id)` | Monster | Elimina |
| `importMonsters(items[])` | Monster | Importa CSV |
| `npcLibrary` | Npc | Lettura |
| `addNpc(data)` | Npc | Crea |
| `updateNpc(id, data)` | Npc | Modifica |
| `deleteNpc(id)` | Npc | Elimina |
| `importNpcs(items[])` | Npc | Importa CSV |
| `spells` | Spell | Lettura |
| `addSpell(data)` | Spell | Crea |
| `updateSpell(id, data)` | Spell | Modifica |
| `deleteSpell(id)` | Spell | Elimina |
| `importSpells(items[])` | Spell | Importa CSV |
| `activeCombat` | ActiveCombat | Lettura battaglia in corso |
| `combats` / `combatHistory` | Combat | Storico battaglie |
| `applyDamage(id, amount)` | CombatParticipant | Infligge danno |
| `heal(id, amount)` | CombatParticipant | Cura |
| `nextTurn()` | Combat | Turno successivo |
| `sortByInitiative()` | Combat | Ordina per iniziativa |
| `addParticipant(part)` | CombatParticipant | Aggiunge partecipante |
| `removeParticipant(id)` | CombatParticipant | Rimuove partecipante |
| `saveToHistory(name?)` | Combat | Salva in storico |
| `loadCombat(combatId)` | Combat | Carica da storico |
| `newCombat()` | Combat | Nuovo combattimento vuoto |

### `useTheme()` - Tema

```typescript
const { theme, setTheme, themes } = useTheme();
// themes = ['light', 'dark', 'fantasy', 'dracula', ...] (temi DaisyUI)
setTheme('dark');
```

### `useConfirm()` - Finestra di conferma

```typescript
const { confirmState, confirm, closeConfirm } = useConfirm();

confirm({
  title: 'Elimina',
  message: 'Sei sicuro?',
  confirmText: 'Sì',        // opzionale
  cancelText: 'Annulla',    // opzionale
  onConfirm: async () => {
    // azione da eseguire
  },
});
```

---

## 📁 Struttura cartelle del progetto

```
src/
├── components/
│   ├── campaign/     # Componenti per la gestione campagne
│   ├── combat/       # Componenti per il tracker di combattimento
│   ├── library/      # Componenti per libreria mostri/PNG/incantesimi
│   └── ui/           # Componenti UI riutilizzabili (DataTable, modali, etc.)
├── context/          # React Context (CampaignContext: campagna selezionata)
├── db/               # Database (Dexie), schema e dati seed
├── hooks/            # Custom hook per DB, tema, conferme
├── pages/            # Pagine dell'app (Campagne, Mostri, Combattimento, etc.)
├── types/            # Definizioni TypeScript (interfacce)
└── utils/            # Utility (es. CSV import/export)
```

---

## 💡 Consigli e Best Practice

1. **Il DB è locale**: funziona solo sul browser in cui lo usi. Non c'è sincronizzazione cloud.
2. **I dati sono live**: grazie a Dexie + React, se modifichi un dato, l'UI si aggiorna automaticamente.
3. **ID auto-generati**: quando crei un'entità, l'`id` viene restituito dopo la creazione (`const id = await addCampaign(...)`)
4. **CSV template**: usa il pulsante "Scarica CSV di esempio" nella pagina relativa per vedere il formato esatto.
5. **Prima di importare CSV**: assicurati che la prima riga contenga le intestazioni (es. `name,hp,ac,damage,cr,type`).
6. **I PG e la campagna**: un personaggio può esistere fuori da una campagna (`campaignId = null`), ma la UI li filtra per campagna attiva.
7. **Sincronizzazione PF**: quando un PG subisce danni/cure in combattimento, i PF vengono aggiornati anche nella scheda personaggio.
