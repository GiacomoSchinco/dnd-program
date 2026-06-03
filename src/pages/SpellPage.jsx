import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { SpellSchools } from '../db/database';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '../components/custom/DeleteConfirmModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { PageHeader } from '../components/custom/PageHeader';
import { SearchInput } from '../components/custom/SearchInput';
import { EmptyState } from '../components/custom/EmptyState';
import { FilterSelect } from '../components/custom/FilterSelect';
import { SpellFormModal } from '../components/custom/SpellFormModal';
import { exportCSV, rowToSpell, SPELL_COLUMNS } from '../utils/csvIO';
import { Sparkles, Plus } from 'lucide-react';
import { SpellCard } from '../components/custom/SpellCard';

const LEVEL_OPTIONS = ['all', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell, importSpells } = useDB();
  const { confirmState, confirm, closeConfirm } = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSchool, setFilterSchool] = useState('all');
  const [search, setSearch] = useState('');

  const filteredSpells = spells?.filter((spell) => {
    if (filterLevel !== 'all' && spell.level !== parseInt(filterLevel)) return false;
    if (filterSchool !== 'all' && spell.school !== filterSchool) return false;
    if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    if (!spells?.length) { toast.info('Nessun incantesimo da esportare'); return; }
    exportCSV(spells, SPELL_COLUMNS, 'incantesimi.csv');
    toast.success(`${spells.length} incantesimi esportati`);
  };

  const handleImport = async (rows) => {
    const valid = rows.map(rowToSpell).filter((s) => s.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importSpells(valid);
    toast.success(`${valid.length} incantesimi importati!`);
  };

  const handleSubmit = async (formData, editingItem) => {
    if (editingItem) {
      await updateSpell(editingItem.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addSpell(formData);
      toast.success(`${formData.name} aggiunto al grimorio!`);
    }
    setIsModalOpen(false);
    setEditingSpell(null);
  };

  const handleEdit = (spell) => {
    setEditingSpell(spell);
    setIsModalOpen(true);
  };

  const handleDelete = (spell) => {
    confirm({
      title: 'Elimina Incantesimo',
      message: `Vuoi eliminare ${spell.name} dal grimorio?`,
      onConfirm: async () => {
        await deleteSpell(spell.id);
        toast.info(`${spell.name} rimosso`);
      },
    });
  };

  return (
    <div className="space-y-6">
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

      {/* Filtri */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="form-control">
          <label className="label text-sm">Cerca</label>
          <SearchInput value={search} onChange={setSearch} placeholder="Nome incantesimo..." />
        </div>
        <FilterSelect label="Livello" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
          {LEVEL_OPTIONS.map((level) => (
            <option key={level} value={level}>{level === 'all' ? 'Tutti' : `Livello ${level}`}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Scuola" value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}>
          <option value="all">Tutte</option>
          {Object.values(SpellSchools).map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </FilterSelect>
      </div>

      {/* Grid Incantesimi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpells?.map((spell) => (
          <SpellCard key={spell.id} spell={spell} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
        {filteredSpells?.length === 0 && (
          <EmptyState colSpan message="Nessun incantesimo trovato con questi filtri" variant="info" />
        )}
      </div>

      <SpellFormModal
        isOpen={isModalOpen}
        editingSpell={editingSpell}
        onClose={() => { setIsModalOpen(false); setEditingSpell(null); }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </div>
  );
}