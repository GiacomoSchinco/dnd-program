import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '../components/custom/DeleteConfirmModal';
import { EmptyState } from '../components/custom/EmptyState';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { exportCSV, rowToNpc, NPC_COLUMNS } from '../utils/csvIO';
import { NpcFormModal } from '../components/custom/NpcFormModal';
import { NpcCard } from '../components/custom/NpcCard';
import { PageHeader } from '../components/custom/PageHeader';
import { SearchInput } from '../components/custom/SearchInput';
import { User, Plus } from 'lucide-react';

export function NpcPage() {
  const { npcLibrary, addNpc, updateNpc, deleteNpc, importNpcs } = useDB();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNpc, setEditingNpc] = useState(null);
  const [search, setSearch] = useState('');

  const handleSubmit = async (formData, editingItem) => {
    if (editingItem) {
      await updateNpc(editingItem.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addNpc(formData);
      toast.success(`${formData.name} aggiunto alla libreria!`);
    }
    setIsModalOpen(false);
    setEditingNpc(null);
  };

  const handleEdit = (npc) => { setEditingNpc(npc); setIsModalOpen(true); };

  const handleExport = () => {
    if (!npcLibrary?.length) { toast.info('Nessun NPC da esportare'); return; }
    exportCSV(npcLibrary, NPC_COLUMNS, 'npc.csv');
    toast.success(`${npcLibrary.length} NPC esportati`);
  };

  const handleImport = async (rows) => {
    const valid = rows.map(rowToNpc).filter((n) => n.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importNpcs(valid);
    toast.success(`${valid.length} NPC importati!`);
  };

  const handleDelete = (npc) => {
    confirm({
      title: 'Elimina NPC',
      message: `Vuoi eliminare ${npc.name} dalla libreria?`,
      onConfirm: async () => {
        await deleteNpc(npc.id);
        toast.info(`${npc.name} rimosso`);
      },
    });
  };

  const filtered = (npcLibrary ?? []).filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<User size={28} />}
        title="Libreria NPC"
        subtitle="Gestisci i personaggi non giocanti da aggiungere ai combattimenti"
        actions={<>
          <CsvToolbar onExport={handleExport} onImport={handleImport} />
          <button className="btn btn-primary gap-1" onClick={() => { setEditingNpc(null); setIsModalOpen(true); }}>
            <Plus size={16} /> Nuovo NPC
          </button>
        </>}
      />

      {/* Cerca */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Cerca NPC..."
      />

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((npc) => (
          <NpcCard
            key={npc.id}
            npc={npc}
            onEdit={() => handleEdit(npc)}
            onDelete={() => handleDelete(npc)}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            colSpan
            message={search ? 'Nessun NPC trovato.' : 'Nessun NPC in libreria. Creane uno!'}
          />
        )}
      </div>

      <NpcFormModal
        isOpen={isModalOpen}
        editingNpc={editingNpc}
        onClose={() => { setIsModalOpen(false); setEditingNpc(null); }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
    </div>
  );
}
