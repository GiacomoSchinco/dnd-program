import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { MonsterCard } from '../components/custom/MonsterCard';
import { MonsterFormModal } from '../components/custom/MonsterFormModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { exportCSV, rowToMonster, MONSTER_COLUMNS } from '../utils/csvIO';
import { Skull, Plus, Search } from 'lucide-react';
import { getMonsterTypeMeta } from '../components/custom/MonsterCard';

const TYPE_OPTIONS = ['all', 'humanoid', 'beast', 'undead', 'dragon', 'giant', 'goblinoid', 'lycanthrope'];

export function MonstersPage() {
  const { monsterLibrary, addMonster, updateMonster, deleteMonster, importMonsters } = useCombatDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });
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
    setConfirmState({
      isOpen: true,
      title: 'Elimina Mostro',
      message: `Vuoi eliminare ${monster.name} dalla libreria?`,
      icon: '🗑️',
      onConfirm: async () => {
        await deleteMonster(monster.id);
        toast.info(`${monster.name} rimosso`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Skull size={28} /> Libreria Mostri</h1>
          <p className="text-base-content/60">Gestisci i mostri del tuo bestiario</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={openCreate}>
            <Plus size={16} /> Nuovo Mostro
          </button>
        </div>
      </div>

      {/* Filtri */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="form-control">
          <label className="label text-sm">Cerca</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
            <input
              type="text"
              className="input input-bordered input-sm pl-9 w-52"
              placeholder="Nome mostro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label text-sm">Tipo</label>
          <select
            className="select select-bordered select-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'Tutti' : getMonsterTypeMeta(t).label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Mostri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monsterLibrary?.filter(m => {
          if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
          if (filterType !== 'all' && m.type !== filterType) return false;
          return true;
        }).map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            onEdit={() => openEdit(monster)}
            onDelete={() => handleDelete(monster)}
          />
        ))}
        {monsterLibrary?.length === 0 && (
          <div className="col-span-full alert">
            <span>Nessun mostro in libreria. Creane uno!</span>
          </div>
        )}
        {monsterLibrary?.length > 0 && monsterLibrary.filter(m => {
          if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
          if (filterType !== 'all' && m.type !== filterType) return false;
          return true;
        }).length === 0 && (
          <div className="col-span-full alert alert-info">
            <span>Nessun mostro trovato con questi filtri.</span>
          </div>
        )}
      </div>

      <MonsterFormModal
        isOpen={isModalOpen}
        editingMonster={editingMonster}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        icon={confirmState.icon}
        confirmText="Elimina"
        confirmVariant="error"
      />
    </div>
  );
}