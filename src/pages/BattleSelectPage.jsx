import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCombatDB } from '../hooks/useCombatDB';
import { usePartyDB } from '../hooks/usePartyDB';
import DataTable from '../components/custom/DataTable';
import { useCampaignContext } from '../context/CampaignContext';
import { toast } from 'sonner';
import { ConfirmModal } from '../components/custom/ConfirmModal';

export function BattleSelectPage() {
  const { campaignId } = useParams();
  const [confirmState, setConfirmState] = useState({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });
  const navigate = useNavigate();
  const { campaigns } = usePartyDB();
  const { setSelectedCampaignId } = useCampaignContext();
  const { combats, createCombatForCampaign, loadCombat, deleteFromHistory } = useCombatDB();

  const parsedCampaignId = Number.parseInt(campaignId, 10);
  const campaign = campaigns?.find((c) => c.id === parsedCampaignId);
  const campaignCombats = (combats ?? []).filter((c) => c.campaignId === parsedCampaignId);

  useEffect(() => {
    if (Number.isNaN(parsedCampaignId)) return;
    setSelectedCampaignId(parsedCampaignId);
  }, [parsedCampaignId, setSelectedCampaignId]);

  const handleNewBattle = async () => {
    await createCombatForCampaign(parsedCampaignId, 'Nuova Battaglia');
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

  return (
    <div className="space-y-6">
      {/* Header con breadcrumb */}
      <div className="flex justify-between items-center">
        <div>
          <div className="breadcrumbs text-sm">
            <ul>
              <li><a onClick={() => navigate('/campaigns')}>Campagne</a></li>
              <li className="font-bold">{campaign?.name || 'Campagna'}</li>
              <li>Battaglie</li>
            </ul>
          </div>
          <h1 className="text-3xl font-bold mt-2">⚔️ Battaglie</h1>
          <p className="text-base-content/60">Seleziona una battaglia o creane una nuova</p>
        </div>
        <button className="btn btn-primary" onClick={handleNewBattle}>
          ➕ Nuova Battaglia
        </button>
      </div>

      {/* Tabella Battaglie */}
      <DataTable
        initialData={campaignCombats}
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
          participants: (value) => (
            <span>{Array.isArray(value) ? value.length : 0}</span>
          ),
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
        emptyMessage="Nessuna battaglia in questa campagna. Creane una nuova."
        pagination
        itemsPerPage={10}
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