import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '../hooks/useDB';
import { useCampaignContext } from '../context/CampaignContext';
import { useConfirm } from '../hooks/useConfirm';
import DataTable from '../components/custom/DataTable';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';
import { Swords, Plus, Trash2 } from 'lucide-react';

export function CampaignSelectPage() {
  const navigate = useNavigate();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { campaigns, addCampaign, combats, createCombatForCampaign, loadCombat, deleteFromHistory } = useDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();

  const activeCampaign = campaigns?.find((campaign) => campaign.id === selectedCampaignId) || null;
  const selectedCampaignCombats = (combats ?? []).filter(
    (combat) => combat.campaignId === selectedCampaignId,
  );

  const handleNewBattle = async () => {
    if (!selectedCampaignId) {
      toast.error('Seleziona prima una campagna dalla topbar');
      return;
    }
    const combatId = await createCombatForCampaign(selectedCampaignId, 'Nuova Battaglia');
    await loadCombat(combatId);
    navigate('/combat');
  };

  const handleLoadBattle = async (combatId) => {
    await loadCombat(combatId);
    navigate('/combat');
  };

  const handleDeleteBattle = (combatId, e) => {
    e.stopPropagation();
    confirm({
      title: 'Elimina Battaglia',
      message: 'Sei sicuro di voler eliminare questa battaglia?',
      onConfirm: async () => {
        await deleteFromHistory(combatId);
        toast.success('Battaglia eliminata');
      },
    });
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Swords size={28} /> Hub Combattimento</h1>
          <p className="text-base-content/60">La campagna attiva si seleziona dalla topbar globale</p>
        </div>
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

                <button className="btn btn-primary gap-1" onClick={handleNewBattle} disabled={!activeCampaign}>
                  <Plus size={16} /> Nuova Battaglia
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
                      className="btn btn-xs btn-primary gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadBattle(row.id);
                      }}
                    >
                      <Swords size={12} /> Riprendi
                    </button>
                    <button
                      className="btn btn-xs btn-error gap-1"
                      onClick={(e) => handleDeleteBattle(row.id, e)}
                    >
                      <Trash2 size={12} /> Elimina
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