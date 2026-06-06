import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { SpellSchools } from '../db/database';
import { toast } from 'sonner';
import { DeleteConfirmModal, CsvToolbar, PageHeader, EmptyState, FilterBar, FilterSelect, PageWrapper, ContentSection } from '../components/ui';
import { SpellFormModal, SpellCard } from '../components/library';
import { exportCSV, rowToSpell, SPELL_COLUMNS } from '../utils/csvIO';
import { Sparkles, Plus } from 'lucide-react';
import type { Spell } from '../types';

const LEVEL_OPTIONS = ['all', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type FilterLevel = typeof LEVEL_OPTIONS[number];
type FilterSchool = 'all' | (typeof SpellSchools)[keyof typeof SpellSchools];

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell, importSpells } = useDB();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<Spell | null>(null);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');
  const [filterSchool, setFilterSchool] = useState<FilterSchool>('all');
  const [search, setSearch] = useState('');

  const filteredSpells = spells?.filter((spell: Spell) => {
    if (filterLevel !== 'all' && spell.level !== filterLevel) return false;
    if (filterSchool !== 'all' && spell.school !== filterSchool) return false;
    if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    if (!spells?.length) { toast.info('Nessun incantesimo da esportare'); return; }
    exportCSV(spells, SPELL_COLUMNS, 'incantesimi.csv');
    toast.success(`${spells.length} incantesimi esportati`);
  };

  const handleImport = async (rows: Record<string, string>[]) => {
    const valid = rows.map(rowToSpell).filter((s): s is Omit<Spell, "id"> => s !== null && !!s.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importSpells(valid.filter((s): s is Omit<Spell, "id"> => s !== null));
    toast.success(`${valid.length} incantesimi importati!`);
  };

  const handleSubmit = async (formData: Omit<Spell, 'id'>, editingItem?: Spell | null) => {
    if (editingItem) {
      await updateSpell(editingItem.id!, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addSpell(formData);
      toast.success(`${formData.name} aggiunto al grimorio!`);
    }
    setIsModalOpen(false);
    setEditingSpell(null);
  };

  const handleEdit = (spell: Spell) => {
    setEditingSpell(spell);
    setIsModalOpen(true);
  };

  const handleDelete = (spell: Spell) => {
    confirm({
      title: 'Elimina Incantesimo',
      message: `Vuoi eliminare ${spell.name} dal grimorio?`,
      onConfirm: async () => {
        await deleteSpell(spell.id!);
        toast.info(`${spell.name} rimosso`);
      },
    });
  };

  return (
    <PageWrapper>
      <PageHeader
        icon={<Sparkles size={28} />}
        title="Grimorio degli Incantesimi"
        subtitle="Consulta e gestisci gli incantesimi"
        actions={<>
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={() => { setEditingSpell(null); setIsModalOpen(true); }}>
            <Plus size={16} /> Nuovo Incantesimo
          </button>
        </>}
      />

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Nome incantesimo...">
        <FilterSelect label="Livello" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value) as FilterLevel)}>
          {LEVEL_OPTIONS.map((level) => (
            <option key={level} value={level}>{level === 'all' ? 'Tutti' : `Livello ${level}`}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Scuola" value={filterSchool} onChange={(e) => setFilterSchool(e.target.value as FilterSchool)}>
          <option value="all">Tutte</option>
          {Object.values(SpellSchools).map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </FilterSelect>
      </FilterBar>

      {/* Grid Incantesimi */}
      <ContentSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpells?.map((spell) => (
            <SpellCard key={spell.id} spell={spell} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
          {filteredSpells?.length === 0 && (
            <EmptyState colSpan message={spells?.length === 0 ? 'Nessun incantesimo in libreria. Creane uno!' : 'Nessun incantesimo trovato con questi filtri.'} />
          )}
        </div>
      </ContentSection>

      <SpellFormModal
        isOpen={isModalOpen}
        editingSpell={editingSpell}
        onClose={() => { setIsModalOpen(false); setEditingSpell(null); }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </PageWrapper>
  );
}
