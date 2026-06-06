import { MouseEvent, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDB } from '../hooks/useDB';
import { useCampaignContext } from '../context/CampaignContext';
import { useConfirm } from '../hooks/useConfirm';
import { DataTable, ConfirmModal, FormModal, Field } from '../components/ui';
import { toast } from 'sonner';
import { Swords, Plus, Trash2, BookOpen } from 'lucide-react';
import { Campaign, Combat } from '../types';
import { PageWrapper, PageHeader, ContentSection, EmptyState } from '../components/ui';

export function CombatHubPage() {
  const navigate = useNavigate();
  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { campaigns, combats, createCombatForCampaign, loadCombat, deleteFromHistory } = useDB();
  const { selectedCampaignId } = useCampaignContext();
  const [newBattleModal, setNewBattleModal] = useState(false);
  const [newBattleName, setNewBattleName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const activeCampaign = campaigns?.find((campaign: Campaign) => campaign.id === selectedCampaignId) || null;
  const selectedCampaignCombats = (combats ?? []).filter(
    (combat: Combat) => combat.campaignId === selectedCampaignId,
  );

  const handleNewBattle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId || isCreating) return;
    setIsCreating(true);
    try {
      const name = newBattleName.trim() || 'Nuova Battaglia';
      const combatId = await createCombatForCampaign(selectedCampaignId, name);
      setNewBattleModal(false);
      setNewBattleName('');
      if (combatId !== null) {
        await loadCombat(combatId);
      }
      navigate('/combat');
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
      <PageHeader
        icon={<Swords size={28} />}
        title="Hub Combattimento"
        subtitle="La campagna attiva si seleziona dalla topbar globale"
      />
      {campaigns?.length === 0 ? (
        <ContentSection>
          <EmptyState
            message="Non hai ancora creato una campagna. Vai alla gestione campagne per iniziare!"
          >
            <button
              className="btn btn-primary btn-sm gap-2 mt-2"
              onClick={() => navigate('/campaigns')}
            >
              <BookOpen size={16} /> Gestisci Campagne
            </button>
          </EmptyState>
        </ContentSection>
      ) : (
        <>
        <ContentSection>
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

            <button className="btn btn-primary gap-1" onClick={() => { setNewBattleName(''); setNewBattleModal(true); }} disabled={!activeCampaign}>
              <Plus size={16} /> Nuova Battaglia
            </button>
          </div>
        </ContentSection>

          {activeCampaign && (
            <ContentSection>
              <DataTable<Combat>
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
                        handleLoadBattle(row.id!);
                      }}
                    >
                      <Swords size={12} /> Riprendi
                    </button>
                    <button
                      className="btn btn-xs btn-error gap-1"
                      onClick={(e) => handleDeleteBattle(row.id!, e)}
                    >
                      <Trash2 size={12} /> Elimina
                    </button>
                  </div>
                ),
              }}
              onRowClick={(id) => handleLoadBattle(id as number)}
              emptyMessage="Nessuna battaglia per la campagna attiva. Creane una nuova."
              pagination
              itemsPerPage={10}
            />
            </ContentSection>
        )}
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
