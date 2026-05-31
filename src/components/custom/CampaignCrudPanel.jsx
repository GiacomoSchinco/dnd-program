import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { usePartyDB } from '../../hooks/usePartyDB';
import { useCampaignContext } from '../../context/CampaignContext';
import DataTable from './DataTable';
import { ConfirmModal } from './ConfirmModal';

export function CampaignCrudPanel({ title = 'Campagne', compact = false }) {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = usePartyDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const sortedCampaigns = useMemo(() => {
    return [...(campaigns ?? [])].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [campaigns]);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error('Inserisci il nome della campagna');
      return;
    }

    const createdId = await addCampaign({
      name: createForm.name.trim(),
      description: createForm.description.trim(),
      createdAt: new Date().toISOString(),
    });

    setSelectedCampaignId(createdId);
    setCreateForm({ name: '', description: '' });
    setIsCreateOpen(false);
    toast.success('Campagna creata');
  };

  const openEdit = (campaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      name: campaign.name || '',
      description: campaign.description || '',
    });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingCampaign) return;
    if (!editForm.name.trim()) {
      toast.error('Inserisci il nome della campagna');
      return;
    }

    await updateCampaign(editingCampaign.id, {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    });

    setIsEditOpen(false);
    setEditingCampaign(null);
    toast.success('Campagna aggiornata');
  };

  const handleDelete = (campaign) => {
    setConfirmState({
      isOpen: true,
      title: 'Elimina Campagna',
      message: `Sei sicuro di voler eliminare la campagna "${campaign.name}"? Verranno eliminati anche tutti i personaggi associati.`,
      icon: '🗑️',
      onConfirm: async () => {
        await deleteCampaign(campaign.id);
        if (selectedCampaignId === campaign.id) {
          const next = sortedCampaigns.find((c) => c.id !== campaign.id);
          setSelectedCampaignId(next ? next.id : null);
        }
        toast.success('Campagna eliminata');
      },
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="card-title">{title}</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setIsCreateOpen(true)}>
            ➕ Nuova Campagna
          </button>
        </div>

        <div className="mt-2">
          <DataTable
            initialData={sortedCampaigns}
            visibleColumns={['name', 'description', 'createdAt', 'active', 'actions']}
            labels={{
              name: 'Nome',
              description: 'Descrizione',
              createdAt: 'Creata il',
              active: 'Stato',
              actions: 'Azioni',
            }}
            customRenderers={{
              createdAt: (value) => (
                <span className="text-sm">{value ? new Date(value).toLocaleDateString('it-IT') : '-'}</span>
              ),
              description: (value) => (
                <span className="text-sm text-base-content/80">{value || '-'}</span>
              ),
              active: (_, row) => (
                row?.id === selectedCampaignId
                  ? <span className="badge badge-primary badge-sm">Attiva</span>
                  : <span className="badge badge-ghost badge-sm">Inattiva</span>
              ),
              actions: (_, row) => (
                <div className="flex gap-1 justify-end">
                  <button
                    className="btn btn-xs btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCampaignId(row.id);
                    }}
                  >
                    Usa
                  </button>
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(row);
                    }}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(row);
                    }}
                  >
                    Elimina
                  </button>
                </div>
              ),
            }}
            onRowClick={(id) => setSelectedCampaignId(id)}
            emptyMessage="Nessuna campagna disponibile."
            pagination
            itemsPerPage={compact ? 5 : 10}
          />
        </div>

        {!compact && sortedCampaigns.length > 0 && (
          <p className="text-xs text-base-content/60 mt-2">
            Suggerimento: imposta la campagna attiva da qui o dalla topbar per aggiornare tutto il contesto.
          </p>
        )}
      </div>

      {isCreateOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Nuova Campagna</h3>
            <div className="space-y-3 mt-4">
              <input
                className="input input-bordered w-full"
                placeholder="Nome campagna"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Descrizione"
                rows="3"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsCreateOpen(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={handleCreate}>Crea</button>
            </div>
          </div>
        </dialog>
      )}

      {isEditOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Modifica Campagna</h3>
            <div className="space-y-3 mt-4">
              <input
                className="input input-bordered w-full"
                placeholder="Nome campagna"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Descrizione"
                rows="3"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsEditOpen(false)}>Annulla</button>
              <button className="btn btn-primary" onClick={handleEdit}>Salva</button>
            </div>
          </div>
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
