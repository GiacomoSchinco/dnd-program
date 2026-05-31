import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { useConfirm } from '../hooks/useConfirm';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { CsvToolbar } from '../components/custom/CsvToolbar';
import { exportCSV, rowToNpc, NPC_COLUMNS } from '../utils/csvIO';
import { FormModal, Field, FieldRow } from '../components/custom/FormModal';
import { NpcCard } from '../components/custom/NpcCard';
import { PageHeader } from '../components/custom/PageHeader';
import { SearchInput } from '../components/custom/SearchInput';
import { User, Plus } from 'lucide-react';

const emptyForm = { name: '', hp: 10, ac: 10, description: '' };

export function NpcPage() {
  const { npcLibrary, addNpc, updateNpc, deleteNpc, importNpcs } = useCombatDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNpc, setEditingNpc] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [search, setSearch] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNpc) {
      await updateNpc(editingNpc.id, formData);
      toast.success(`${formData.name} aggiornato!`);
    } else {
      await addNpc(formData);
      toast.success(`${formData.name} aggiunto alla libreria!`);
    }
    setIsModalOpen(false);
    setEditingNpc(null);
    setFormData(emptyForm);
  };

  const handleEdit = (npc) => {
    setEditingNpc(npc);
    setFormData({ name: npc.name, hp: npc.hp, ac: npc.ac, description: npc.description || '' });
    setIsModalOpen(true);
  };

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
          <button className="btn btn-primary gap-1" onClick={() => { setEditingNpc(null); setFormData(emptyForm); setIsModalOpen(true); }}>
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
          <div className="col-span-full">
            <div className="alert">
              <span>{search ? 'Nessun NPC trovato.' : 'Nessun NPC in libreria. Creane uno!'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crea/Modifica */}
      <FormModal
        isOpen={isModalOpen}
        title={editingNpc ? 'Modifica NPC' : 'Nuovo NPC'}
        confirmText={editingNpc ? 'Aggiorna' : 'Crea'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <Field label="Nome" required>
          <input type="text" className="input input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required autoFocus />
        </Field>
        <FieldRow>
          <Field label="HP">
            <input type="number" min="1" className="input input-bordered w-full"
              value={formData.hp}
              onChange={(e) => setFormData({ ...formData, hp: parseInt(e.target.value) || 1 })} />
          </Field>
          <Field label="CA">
            <input type="number" min="1" className="input input-bordered w-full"
              value={formData.ac}
              onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) || 1 })} />
          </Field>
        </FieldRow>
        <Field label="Descrizione (opzionale)">
          <textarea className="textarea textarea-bordered w-full" rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ruolo, note, background..." />
        </Field>
      </FormModal>

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
