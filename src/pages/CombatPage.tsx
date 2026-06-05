import { useNavigate } from 'react-router-dom';
import { Swords, Trophy } from 'lucide-react';
import { useDB } from '../hooks/useDB';
import { useCampaignContext } from '../context/CampaignContext';
import { CombatTracker, InitiativePanel, CombatHeader } from '../components/combat';
import { PageWrapper, EmptyState } from '../components/ui';
import { toast } from 'sonner';

export function CombatPage() {
  const {
    activeCombat,
    campaigns,
    monsterLibrary,
    npcLibrary,
    characters,
    applyDamage,
    heal,
    nextTurn,
    sortByInitiative,
    addParticipant,
    removeParticipant,
    updateParticipantInitiative,
    saveToHistory,
    setCombatStatus,
  } = useDB();
  const { selectedCampaignId } = useCampaignContext();
  const navigate = useNavigate();


  const currentCampaign = campaigns?.find((c) => c.id === activeCombat?.campaignId);
  const campaignCharacters = (characters ?? []).filter(
    (c) => c.campaignId === activeCombat?.campaignId,
  );
  const combatStatus = activeCombat?.status ?? 'prepared';

  if (!activeCombat) {
    return (
      <PageWrapper>
        <EmptyState message="Nessun combattimento attivo. Seleziona una campagna per iniziare!" variant="info">
          <button className="btn btn-primary btn-lg gap-2 mt-2" onClick={() => navigate('/combat-hub')}>
            <Swords size={20} /> Scegli Campagna
          </button>
        </EmptyState>
      </PageWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <CombatHeader
        activeCombat={activeCombat}
        currentCampaign={currentCampaign}
        combatStatus={combatStatus}
        onNextTurn={nextTurn}
        onSortInitiative={sortByInitiative}
        onStart={() => setCombatStatus(activeCombat.combatId, 'in_progress')}
        onTerminate={() => setCombatStatus(activeCombat.combatId, 'terminated')}
        onSave={saveToHistory}
      />

      {combatStatus === 'terminated' && (
        <div className="alert alert-success shadow-lg">
          <Trophy size={20} />
          <div>
            <span className="font-bold">Battaglia conclusa!</span>
            <span className="ml-2 text-sm opacity-80">Il combattimento è terminato.</span>
          </div>
          <button
            className="btn btn-sm btn-ghost ml-auto"
            onClick={() =>
              currentCampaign
                ? navigate(`/campaign/${currentCampaign.id}/battles`)
                : navigate('/combat-hub')
            }
          >
            Torna alle battaglie
          </button>
        </div>
      )}

      {/* Pannello iniziativa flottante */}
      <InitiativePanel
        participants={activeCombat.participants}
        currentTurnIndex={activeCombat.currentTurnIndex ?? 0}
        round={activeCombat.round ?? 1}
        onNextTurn={nextTurn}
      />

      {/* Tracker */}
      <div className="flex-1 min-h-0">
        <CombatTracker
          activeCombat={activeCombat}
          campaignCharacters={campaignCharacters}
          monsterLibrary={monsterLibrary ?? []}
          npcLibrary={npcLibrary ?? []}
          selectedCampaignId={selectedCampaignId}
          applyDamage={applyDamage}
          heal={heal}
          addParticipant={addParticipant}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={(msg) => toast.info(msg)}
        />
      </div>
    </div>
  );
}