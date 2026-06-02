import { useNavigate } from 'react-router-dom';
import { Swords, Trophy } from 'lucide-react';
import { useCombatDB } from '../hooks/useCombatDB';
import { useCampaignContext } from '../context/CampaignContext';
import { CombatTracker } from '../components/custom/CombatTracker';
import { InitiativePanel } from '../components/custom/InitiativePanel';
import { CombatHeader } from '../components/custom/CombatHeader';
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
  } = useCombatDB();
  const { selectedCampaignId } = useCampaignContext();
  const navigate = useNavigate();


  const currentCampaign = campaigns?.find((c) => c.id === activeCombat?.campaignId);
  const campaignCharacters = (characters ?? []).filter(
    (c) => c.campaignId === activeCombat?.campaignId,
  );
  const combatStatus = activeCombat?.status ?? 'prepared';

  if (!activeCombat) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold flex items-center gap-3"><Swords size={40} /> Nessun Combattimento</h1>
            <p className="py-6">Seleziona una campagna e una battaglia per iniziare</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/campaigns')}>
              Scegli Campagna
            </button>
          </div>
        </div>
      </div>
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
                : navigate('/campaigns')
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