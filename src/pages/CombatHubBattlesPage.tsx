import { useEffect, useState, FormEvent, MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDB } from '../hooks/useDB';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmModal, FormModal, Field, PageWrapper, ContentSection, EmptyState } from '../components/ui';
import { useCampaignContext } from '../context/CampaignContext';
import { toast } from 'sonner';
import { Swords, Plus, Trash2, BookOpen } from 'lucide-react';
import { BattleTable } from '../components/combat';
import { Campaign, Combat } from '../types';

export function CombatHubBattlesPage() {
  const { campaignId } = useParams();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const [newBattleModal, setNewBattleModal] = useState(false);
  const [newBattleName, setNewBattleName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { campaigns, combats, createCombatForCampaign, loadCombat, deleteFromHistory } = useDB();
  const { setSelectedCampaignId } = useCampaignContext();

  const parsedCampaignId = Number.parseInt(campaignId ?? '', 10);
  const campaign = campaigns?.find((c: Campaign) => c.id === parsedCampaignId);
  const campaignCombats = (combats ?? []).filter((c): c is Combat => !!c && c.campaignId === parsedCampaignId);

  useEffect(() => {
    if (Number.isNaN(parsedCampaignId)) return;
    setSelectedCampaignId(parsedCampaignId);
  }, [parsedCampaignId, setSelectedCampaignId]);

  const handleNewBattle = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreating) return;
    setIsCreating(true);
    try {
      const name = newBattleName.trim() || 'Nuova Battaglia';
      await createCombatForCampaign(parsedCampaignId, name);
      setNewBattleModal(false);
      setNewBattleName('');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadBattle = async (combatId: number) => {
    await loadCombat(combatId);
    navigate('/combat');
  };

  const handleDeleteBattle = (combatId: number, e: MouseEvent<HTMLButtonElement>) => {
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
    <PageWrapper>
      {!campaign ? (
        <EmptyState
          message="Nessuna campagna trovata. Creane una per iniziare!"
        >
          <button
            className="btn btn-primary gap-2 mt-2"
            onClick={() => navigate('/combat-hub')}
          >
            <BookOpen size={18} /> Vai alla gestione campagne
          </button>
        </EmptyState>
      ) : (
        <>
          {/* Header con breadcrumb */}
          <div className="flex justify-between items-center">
            <div>
              <div className="breadcrumbs text-sm">
                <ul>
                  <li><a onClick={() => navigate('/combat-hub')}>Hub Combattimento</a></li>
                  <li className="font-bold">{campaign?.name || 'Campagna'}</li>
                  <li>Battaglie</li>
                </ul>
              </div>
              <h1 className="text-3xl font-bold mt-2 flex items-center gap-2"><Swords size={28} /> Battaglie</h1>
              <p className="text-base-content/60">Seleziona una battaglia o creane una nuova</p>
            </div>
            <button className="btn btn-primary gap-1" onClick={() => { setNewBattleName(''); setNewBattleModal(true); }}>
              <Plus size={16} /> Nuova Battaglia
            </button>
          </div>

          {/* Tabella Battaglie */}
          <ContentSection>
            <BattleTable
              combats={campaignCombats}
              onLoad={handleLoadBattle}
              onDelete={handleDeleteBattle}
              emptyMessage="Nessuna battaglia in questa campagna. Creane una nuova."
            />
        </ContentSection>
        </>
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
      <FormModal
        isOpen={newBattleModal}
        title="Nuova Battaglia"
        confirmText="Crea"
        loading={isCreating}
        onClose={() => setNewBattleModal(false)}
        onSubmit={handleNewBattle}
      >
        <Field label="Nome battaglia">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="es. Assalto alla fortezza"
            value={newBattleName}
            onChange={(e) => setNewBattleName(e.target.value)}
            autoFocus
          />
        </Field>
      </FormModal>
    </PageWrapper>
  );
}
