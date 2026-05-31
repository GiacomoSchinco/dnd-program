import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartyDB } from '../hooks/usePartyDB';
import { useCombatDB } from '../hooks/useCombatDB';
import { useCampaignContext } from '../context/CampaignContext';
import DataTable from '../components/custom/DataTable';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';

export function CampaignSelectPage() {
  const navigate = useNavigate();
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });
  const { campaigns, addCampaign } = usePartyDB();
  const { combats, createCombatForCampaign, loadCombat, deleteFromHistory } = useCombatDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  const activeCampaign = campaigns?.find((campaign) => campaign.id === selectedCampaignId) || null;
  const selectedCampaignCombats = (combats ?? []).filter(
    (combat) => combat.campaignId === selectedCampaignId,
  );

  const handleNewBattle = async () => {
    if (!selectedCampaignId) {
      toast.error('Seleziona prima una campagna dalla topbar');
      return;
    }
    await createCombatForCampaign(selectedCampaignId, 'Nuova Battaglia');
    navigate('/combat');
  };

  const handleLoadBattle = async (combatId) => {
    await loadCombat(combatId);
    navigate('/combat');
  };

  const handleDeleteBattle = (combatId, e) => {
    e.stopPropagation();
    setConfirmState({
      isOpen: true,
      title: 'Elimina Battaglia',
      message: 'Sei sicuro di voler eliminare questa battaglia?',
      icon: '🗑️',
      onConfirm: async () => {
        await deleteFromHistory(combatId);
        toast.success('Battaglia eliminata');
      },
    });
  };

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast.error('Inserisci un nome');
      return;
    }
    const campaignId = await addCampaign({
      name: newCampaignName,
      description: newCampaignDesc,
      createdAt: new Date().toISOString()
    });
    setSelectedCampaignId(campaignId);
    toast.success(`Campagna "${newCampaignName}" creata!`);
    setIsModalOpen(false);
    setNewCampaignName('');
    setNewCampaignDesc('');
    navigate('/campaigns');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">⚔️ Hub Combattimento</h1>
          <p className="text-base-content/60">La campagna attiva si seleziona dalla topbar globale</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Nuova Campagna
        </button>
      </div>

      {campaigns?.length === 0 ? (
        <div className="hero min-h-[50vh] bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div>
              <h2 className="text-2xl font-bold">Nessuna Campagna</h2>
              <p className="py-4">Crea la tua prima campagna per iniziare</p>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Crea Campagna
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="card-title">Campagna attiva</h2>
                  {activeCampaign ? (
                    <>
                      <p className="text-lg font-semibold">{activeCampaign.name}</p>
                      {activeCampaign.description && (
                        <p className="text-sm text-base-content/70">{activeCampaign.description}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-base-content/70">
                      Seleziona una campagna dalla topbar per visualizzare le battaglie.
                    </p>
                  )}
                </div>

                <button className="btn btn-primary" onClick={handleNewBattle} disabled={!activeCampaign}>
                  ➕ Nuova Battaglia
                </button>
              </div>
            </div>
          </div>

          {activeCampaign && (
            <DataTable
              initialData={selectedCampaignCombats}
              visibleColumns={['name', 'date', 'status', 'participants', 'round', 'actions']}
              labels={{
                name: 'Battaglia',
                date: 'Data',
                status: 'Stato',
                participants: 'Partecipanti',
                round: 'Round',
                actions: 'Azioni',
              }}
              customRenderers={{
                date: (value) => (
                  <span className="text-sm">
                    {value ? new Date(value).toLocaleString('it-IT') : '-'}
                  </span>
                ),
                status: (value) => (
                  <span className={`badge ${value === 'terminated' ? 'badge-error' : 'badge-success'}`}>
                    {value === 'terminated' ? 'Conclusa' : 'In corso'}
                  </span>
                ),
                participants: (value) => <span>{Array.isArray(value) ? value.length : 0}</span>,
                round: (value) => <span>{value ?? 1}</span>,
                actions: (_, row) => (
                  <div className="flex gap-2 justify-end">
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadBattle(row.id);
                      }}
                    >
                      ⚔️ Riprendi
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={(e) => handleDeleteBattle(row.id, e)}
                    >
                      🗑️ Elimina
                    </button>
                  </div>
                ),
              }}
              onRowClick={(id) => handleLoadBattle(id)}
              emptyMessage="Nessuna battaglia per la campagna attiva. Creane una nuova."
              pagination
              itemsPerPage={10}
            />
          )}
        </div>
      )}

      {/* Modal Nuova Campagna */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Nuova Campagna</h3>
            <div className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">Nome Campagna</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="es. La Miniera Perduta"
                />
              </div>
              <div className="form-control">
                <label className="label">Descrizione (opzionale)</label>
                <textarea
                  className="textarea textarea-bordered"
                  rows="3"
                  value={newCampaignDesc}
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  placeholder="Descrivi la tua avventura..."
                />
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setIsModalOpen(false)}>Annulla</button>
                <button className="btn btn-primary" onClick={handleCreateCampaign}>Crea</button>
              </div>
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