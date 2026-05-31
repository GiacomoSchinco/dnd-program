import { useNavigate } from 'react-router-dom';
import { useCombatDB } from '../hooks/useCombatDB';
import { useCampaignContext } from '../context/CampaignContext';
import { CombatTracker } from '../components/custom/CombatTracker';
import { InitiativePanel } from '../components/custom/InitiativePanel';
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
            <h1 className="text-5xl font-bold">⚔️ Nessun Combattimento</h1>
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
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          {currentCampaign && (
            <div className="breadcrumbs text-sm mb-1">
              <ul>
                <li><a onClick={() => navigate('/campaigns')}>Campagne</a></li>
                <li><a onClick={() => navigate(`/campaign/${currentCampaign.id}/battles`)}>{currentCampaign.name}</a></li>
                <li className="font-bold">{activeCombat.name}</li>
              </ul>
            </div>
          )}
          <h1 className="text-3xl font-bold">{activeCombat.name}</h1>
          <p className="text-base-content/60">
            Round {activeCombat.round ?? 1} · Turno {(activeCombat.currentTurnIndex ?? 0) + 1} di {activeCombat.participants.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentCampaign && (
            <button
              className="btn btn-ghost"
              onClick={() => navigate(`/campaign/${currentCampaign.id}/battles`)}
            >
              ← Indietro
            </button>
          )}
          <button className="btn btn-secondary" onClick={sortByInitiative}>
            🔄 Iniziativa
          </button>
          <button className="btn btn-primary" onClick={nextTurn}>
            ⏩ Turno Successivo
          </button>
          {combatStatus !== 'terminated' && (
            <button
              className="btn btn-warning"
              onClick={() => setCombatStatus(activeCombat.combatId, 'terminated')}
            >
              🏁 Termina
            </button>
          )}
          <button className="btn btn-success" onClick={() => saveToHistory()}>
            💾 Salva
          </button>
        </div>
      </div>

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