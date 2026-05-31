import { useRef } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../hooks/useTheme';
import { useCombatDB } from '../hooks/useCombatDB';
import { useSpellsDB } from '../hooks/useSpellsDB';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { useState } from 'react';
import { db } from '../db/database';
import { seedMonsters, seedSpells } from '../db/seedData';
import {
  exportCSV, parseCSV,
  rowToMonster, rowToSpell, rowToNpc,
  MONSTER_COLUMNS, SPELL_COLUMNS, NPC_COLUMNS,
} from '../utils/csvIO';
import { Settings2, Palette, FolderOpen, Database, Check, Skull, Sparkles, User, Download, Upload, Trash2 } from 'lucide-react';

// ── CSV helpers ────────────────────────────────────────────────────────────

function useFileInput(onLoad) {
  const ref = useRef(null);
  const open = () => ref.current.click();
  const onChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onLoad(parseCSV(ev.target.result));
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };
  return { ref, open, onChange };
}

// ── Section card ──────────────────────────────────────────────────────────

function Section({ icon, title, children }) {
  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body gap-4">
        <h2 className="card-title text-lg">
          <span className="flex items-center">{icon}</span> {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// ── CSV row ────────────────────────────────────────────────────────────────

function CsvRow({ label, count, filename, onExport, onImport }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImport(parseCSV(ev.target.result));
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-base-300 last:border-0">
      <div>
        <span className="font-medium">{label}</span>
        <span className="ml-2 badge badge-ghost badge-sm">{count ?? 0} voci</span>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm gap-1" onClick={onExport}>
          <Download size={14} /> Esporta
        </button>
        <button className="btn btn-outline btn-sm gap-1" onClick={() => fileRef.current.click()}>
          <Upload size={14} /> Importa
        </button>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { theme, setTheme, themes } = useTheme();
  const { monsterLibrary, npcLibrary, importMonsters, importNpcs } = useCombatDB();
  const { spells, importSpells } = useSpellsDB();
  const [resetOpen, setResetOpen] = useState(false);

  // ── Reset ──────────────────────────────────────────────────────────────
  const handleReset = async () => {
    try {
      await db.transaction('rw', [
        db.activeCombat, db.combats, db.campaigns,
        db.characters, db.monsters, db.spells, db.npcs,
      ], async () => {
        await db.activeCombat.clear();
        await db.combats.clear();
        await db.campaigns.clear();
        await db.characters.clear();
        await db.monsters.clear();
        await db.spells.clear();
        await db.npcs.clear();
        await db.monsters.bulkAdd(seedMonsters);
        await db.spells.bulkAdd(seedSpells);
      });
      toast.success('Database resettato!');
      window.location.reload();
    } catch (err) {
      toast.error('Errore durante il reset');
      console.error(err);
    }
  };

  // ── Monster CSV ────────────────────────────────────────────────────────
  const handleMonsterExport = () => {
    if (!monsterLibrary?.length) { toast.info('Nessun mostro da esportare'); return; }
    exportCSV(monsterLibrary, MONSTER_COLUMNS, 'mostri.csv');
    toast.success(`${monsterLibrary.length} mostri esportati`);
  };
  const handleMonsterImport = async (rows) => {
    const valid = rows.map(rowToMonster).filter((m) => m.name);
    if (!valid.length) { toast.error('Nessuna riga valida nel CSV'); return; }
    await importMonsters(valid);
    toast.success(`${valid.length} mostri importati!`);
  };

  // ── Spell CSV ──────────────────────────────────────────────────────────
  const handleSpellExport = () => {
    if (!spells?.length) { toast.info('Nessun incantesimo da esportare'); return; }
    exportCSV(spells, SPELL_COLUMNS, 'incantesimi.csv');
    toast.success(`${spells.length} incantesimi esportati`);
  };
  const handleSpellImport = async (rows) => {
    const valid = rows.map(rowToSpell).filter((s) => s.name);
    if (!valid.length) { toast.error('Nessuna riga valida nel CSV'); return; }
    await importSpells(valid);
    toast.success(`${valid.length} incantesimi importati!`);
  };

  // ── NPC CSV ────────────────────────────────────────────────────────────
  const handleNpcExport = () => {
    if (!npcLibrary?.length) { toast.info('Nessun NPC da esportare'); return; }
    exportCSV(npcLibrary, NPC_COLUMNS, 'npc.csv');
    toast.success(`${npcLibrary.length} NPC esportati`);
  };
  const handleNpcImport = async (rows) => {
    const valid = rows.map(rowToNpc).filter((n) => n.name);
    if (!valid.length) { toast.error('Nessuna riga valida nel CSV'); return; }
    await importNpcs(valid);
    toast.success(`${valid.length} NPC importati!`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Settings2 size={28} /> Impostazioni</h1>
        <p className="text-base-content/60">Gestisci tema, dati e backup</p>
      </div>

      {/* ── Tema ── */}
      <Section icon={<Palette size={18} />} title="Aspetto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`btn btn-sm justify-start gap-2 ${
                theme === t.value ? 'btn-primary' : 'btn-ghost border border-base-300'
              }`}
            >
              <span>{t.name}</span>
              {theme === t.value && <Check size={14} className="ml-auto" />}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Import / Export CSV ── */}
      <Section icon={<FolderOpen size={18} />} title="Import / Export CSV">
        <p className="text-sm text-base-content/60">
          Esporta i tuoi dati per modificarli in Excel o LibreOffice, poi reimportali.
          L&apos;importazione <strong>aggiunge</strong> le righe senza cancellare quelle esistenti.
        </p>
        <CsvRow
          label={<span className="flex items-center gap-1"><Skull size={14} /> Mostri</span>}
          count={monsterLibrary?.length}
          filename="mostri.csv"
          onExport={handleMonsterExport}
          onImport={handleMonsterImport}
        />
        <CsvRow
          label={<span className="flex items-center gap-1"><Sparkles size={14} /> Incantesimi</span>}
          count={spells?.length}
          filename="incantesimi.csv"
          onExport={handleSpellExport}
          onImport={handleSpellImport}
        />
        <CsvRow
          label={<span className="flex items-center gap-1"><User size={14} /> NPC</span>}
          count={npcLibrary?.length}
          filename="npc.csv"
          onExport={handleNpcExport}
          onImport={handleNpcImport}
        />
      </Section>

      {/* ── Reset DB ── */}
      <Section icon={<Database size={18} />} title="Database">
        <p className="text-sm text-base-content/60">
          Il reset cancella <strong>tutto</strong>: campagne, personaggi, combattimenti, mostri personalizzati e NPC.
          I mostri e gli incantesimi di default vengono ripristinati.
        </p>
        <button className="btn btn-error w-full sm:w-auto gap-1" onClick={() => setResetOpen(true)}>
          <Trash2 size={16} /> Reset completo database
        </button>
      </Section>

      <ConfirmModal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Completo"
        message="Questa azione cancellerà TUTTI i dati (campagne, personaggi, combattimenti, mostri). Non potrai recuperarli!"
        icon="💥"
        confirmText="Reset"
        confirmVariant="error"
      />
    </div>
  );
}
