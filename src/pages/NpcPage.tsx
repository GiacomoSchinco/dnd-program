import { useState } from 'react';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { DeleteConfirmModal, EmptyState, CsvToolbar, PageHeader, SearchInput, PageWrapper } from '../components/ui';
import { exportCSV, rowToNpc, NPC_COLUMNS } from '../utils/csvIO';
import { NpcFormModal, NpcCard } from '../components/library';
import { User, Plus } from 'lucide-react';
import type { Npc } from '../types';

export function NpcPage() {
  const { npcLibrary, addNpc, updateNpc, deleteNpc, importNpcs } = useDB();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNpc, setEditingNpc] = useState<Npc | null>(null);
  const [search, setSearch] = useState('');

  const handleSubmit = async (formData: Omit<Npc, 'id'>, editingItem?: Npc | null) => {
    if (editingItem) {
      await updateNpc(editingItem.id!, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addNpc(formData);
      toast.success(`${formData.name} aggiunto alla libreria!`);
    }
    setIsModalOpen(false);
    setEditingNpc(null);
  };

  const handleEdit = (npc: Npc) => { setEditingNpc(npc); setIsModalOpen(true); };

  const handleExport = () => {
    if (!npcLibrary?.length) { toast.info('Nessun NPC da esportare'); return; }
    exportCSV(npcLibrary, NPC_COLUMNS, 'npc.csv');
    toast.success(`${npcLibrary.length} NPC esportati`);
  };

  const handleImport = async (rows: Record<string, string>[]) => {
    const valid = rows.map(rowToNpc).filter((n): n is Npc => n !== null && !!n.name);
    if (!valid.length) { toast.error('Nessuna riga valida trovata nel CSV'); return; }
    await importNpcs(valid as Omit<Npc, "id">[]);
    toast.success(`${valid.length} NPC importati!`);
  };

  const handleDelete = (npc: Npc) => {
    confirm({
      title: 'Elimina NPC',
      message: `Vuoi eliminare ${npc.name} dalla libreria?`,
      onConfirm: async () => {
        await deleteNpc(npc.id!);
        toast.info(`${npc.name} rimosso`);
      },
    });
  };

  const filtered = (npcLibrary ?? []).filter((n: Npc) =>
    n.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageWrapper>
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
    </PageWrapper>
  );
}
