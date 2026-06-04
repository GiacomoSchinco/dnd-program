import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal, EmptyState, FilterSelect, CsvToolbar, PageHeader, SearchInput } from '../components/ui';
import { MonsterCard, MonsterFormModal } from '../components/library';
import { exportCSV, rowToMonster, MONSTER_COLUMNS } from '../utils/csvIO';
import { Skull, Plus } from 'lucide-react';
import { getMonsterTypeMeta } from '../components/library/MonsterCard';
import type { Monster } from '../types';

const TYPE_OPTIONS = ['all', 'humanoid', 'beast', 'undead', 'dragon', 'giant', 'goblinoid', 'lycanthrope'] as const;
type FilterType = typeof TYPE_OPTIONS[number];

export function MonstersPage() {
  const { monsterLibrary, addMonster, updateMonster, deleteMonster, importMonsters } = useDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Monster | null>(null);
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const openCreate = () => { setEditingMonster(null); setIsModalOpen(true); };
  const openEdit = (monster: Monster) => { setEditingMonster(monster); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (formData: Omit<Monster, 'id'>) => {
    if (editingMonster) {
      await updateMonster(editingMonster.id!, formData);
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

  const handleImport = async (rows: Record<string, string>[]) => {
    const valid = rows.map(rowToMonster).filter((m) => m.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importMonsters(valid);
    toast.success(`${valid.length} mostri importati!`);
  };

  const handleDelete = (monster: Monster) => {
    confirm({
      title: 'Elimina Mostro',
      message: `Vuoi eliminare ${monster.name} dalla libreria?`,
      onConfirm: async () => {
        await deleteMonster(monster.id!);
        toast.info(`${monster.name} rimosso`);
      },
    });
  };

  const filteredMonsters = (monsterLibrary ?? []).filter((m: Monster) => {
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
        <FilterSelect label="Tipo" value={filterType} onChange={(e) => setFilterType(e.target.value as FilterType)}>
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