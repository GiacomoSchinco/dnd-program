import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '../components/custom/DeleteConfirmModal';
import { EmptyState } from '../components/custom/EmptyState';
import { FilterSelect } from '../components/custom/FilterSelect';
import { MonsterCard } from '../components/custom/MonsterCard';
import { MonsterFormModal } from '../components/custom/MonsterFormModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { PageHeader } from '../components/custom/PageHeader';
import { SearchInput } from '../components/custom/SearchInput';
import { exportCSV, rowToMonster, MONSTER_COLUMNS } from '../utils/csvIO';
import { Skull, Plus } from 'lucide-react';
import { getMonsterTypeMeta } from '../components/custom/MonsterCard';

const TYPE_OPTIONS = ['all', 'humanoid', 'beast', 'undead', 'dragon', 'giant', 'goblinoid', 'lycanthrope'];

export function MonstersPage() {
  const { monsterLibrary, addMonster, updateMonster, deleteMonster, importMonsters } = useDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const openCreate = () => { setEditingMonster(null); setIsModalOpen(true); };
  const openEdit = (monster) => { setEditingMonster(monster); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData) => {
    if (editingMonster) {
      await updateMonster(editingMonster.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addMonster(formData);
      toast.success(`${formData.name} aggiunto alla libreria!`);
    }
    closeModal();
    setEditingMonster(null);
  };

  const handleExport = () => {
    if (!monsterLibrary?.length) { toast.info('Nessun mostro da esportare'); return; }
    exportCSV(monsterLibrary, MONSTER_COLUMNS, 'mostri.csv');
    toast.success(`${monsterLibrary.length} mostri esportati`);
  };

  const handleImport = async (rows) => {
    const valid = rows.map(rowToMonster).filter((m) => m.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importMonsters(valid);
    toast.success(`${valid.length} mostri importati!`);
  };

  const handleDelete = (monster) => {
    confirm({
      title: 'Elimina Mostro',
      message: `Vuoi eliminare ${monster.name} dalla libreria?`,
      onConfirm: async () => {
        await deleteMonster(monster.id);
        toast.info(`${monster.name} rimosso`);
      },
    });
  };

  const filteredMonsters = (monsterLibrary ?? []).filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== 'all' && m.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Skull size={28} />}
        title="Libreria Mostri"
        subtitle="Gestisci i mostri del tuo bestiario"
        actions={<>
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={openCreate}>
            <Plus size={16} /> Nuovo Mostro
          </button>
        </>}
      />

      {/* Filtri */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="form-control">
          <label className="label text-sm">Cerca</label>
          <SearchInput value={search} onChange={setSearch} placeholder="Nome mostro..." />
        </div>
        <FilterSelect label="Tipo" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === 'all' ? 'Tutti' : getMonsterTypeMeta(t).label}</option>
          ))}
        </FilterSelect>
      </div>

      {/* Grid Mostri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMonsters.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            onEdit={() => openEdit(monster)}
            onDelete={() => handleDelete(monster)}
          />
        ))}
        {monsterLibrary?.length === 0 && (
          <EmptyState colSpan message="Nessun mostro in libreria. Creane uno!" />
        )}
        {monsterLibrary?.length > 0 && filteredMonsters.length === 0 && (
          <EmptyState colSpan message="Nessun mostro trovato con questi filtri." variant="info" />
        )}
      </div>

      <MonsterFormModal
        isOpen={isModalOpen}
        editingMonster={editingMonster}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </div>
  );
}