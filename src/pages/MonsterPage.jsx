import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { MonsterCard } from '../components/custom/MonsterCard';
import { MonsterFormModal } from '../components/custom/MonsterFormModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { exportCSV, rowToMonster, MONSTER_COLUMNS } from '../utils/csvIO';

export function MonstersPage() {
  const { monsterLibrary, addMonster, updateMonster, deleteMonster, importMonsters } = useCombatDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });

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
          <h1 className="text-3xl font-bold">🐉 Libreria Mostri</h1>
          <p className="text-base-content/60">Gestisci i mostri del tuo bestiario</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary" onClick={openCreate}>
            ➕ Nuovo Mostro
          </button>
        </div>
      </div>

      {/* Grid Mostri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monsterLibrary?.map((monster) => (
          <MonsterCard
            key={monster.id}
            monster={monster}
            onEdit={() => openEdit(monster)}
            onDelete={() => handleDelete(monster)}
          />
        ))}
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