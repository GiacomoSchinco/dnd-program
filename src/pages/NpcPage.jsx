import { useState } from 'react';
import { useCombatDB } from '../hooks/useCombatDB';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';

const emptyForm = { name: '', hp: 10, ac: 10, description: '' };

export function NpcPage() {
  const { npcLibrary, addNpc, updateNpc, deleteNpc } = useCombatDB();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNpc, setEditingNpc] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });
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

  const handleDelete = (npc) => {
    setConfirmState({
      isOpen: true,
      title: 'Elimina NPC',
      message: `Vuoi eliminare ${npc.name} dalla libreria?`,
      icon: '🗑️',
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">👤 Libreria NPC</h1>
          <p className="text-base-content/60">
            Gestisci i personaggi non giocanti da aggiungere ai combattimenti
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingNpc(null); setFormData(emptyForm); setIsModalOpen(true); }}>
          ➕ Nuovo NPC
        </button>
      </div>

      {/* Cerca */}
      <input
        type="text"
        className="input input-bordered w-full max-w-sm"
        placeholder="🔍 Cerca NPC..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((npc) => (
          <div key={npc.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-4 gap-2">
              <div className="flex justify-between items-start">
                <h2 className="card-title text-base">{npc.name}</h2>
                <span className="text-2xl">👤</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span>❤️ <strong>{npc.hp}</strong> HP</span>
                <span>🛡️ CA <strong>{npc.ac}</strong></span>
              </div>
              {npc.description && (
                <p className="text-xs text-base-content/60 line-clamp-2">{npc.description}</p>
              )}
              <div className="card-actions justify-end pt-2 border-t border-base-200">
                <button className="btn btn-xs btn-ghost" onClick={() => handleEdit(npc)}>✏️ Modifica</button>
                <button className="btn btn-xs btn-ghost btn-error" onClick={() => handleDelete(npc)}>🗑️ Elimina</button>
              </div>
            </div>
          </div>
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
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">{editingNpc ? 'Modifica NPC' : 'Nuovo NPC'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">Nome</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">HP</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>
                <div className="form-control">
                  <label className="label">CA</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={formData.ac}
                    onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) || 1 })}
                    min="1"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">Descrizione (opzionale)</label>
                <textarea
                  className="textarea textarea-bordered"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ruolo, note, background..."
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNpc ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </dialog>
      )}

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
