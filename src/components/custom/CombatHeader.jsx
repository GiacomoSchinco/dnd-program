import { useNavigate } from 'react-router-dom';
import { RefreshCw, SkipForward, Flag, Save, Swords } from 'lucide-react';

/**
 * Header del combattimento: breadcrumb, titolo, round info, bottoni azioni.
 */
export function CombatHeader({
  activeCombat,
  currentCampaign,
  combatStatus,
  onNextTurn,
  onSortInitiative,
  onTerminate,
  onSave,
  onStart,
}) {
  const isPrepared = combatStatus === 'prepared';
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div>
        {currentCampaign && (
          <div className="breadcrumbs text-sm mb-1">
            <ul>
              <li><a onClick={() => navigate('/campaigns')}>Campagne</a></li>
              <li>
                <a onClick={() => navigate(`/campaign/${currentCampaign.id}/battles`)}>
                  {currentCampaign.name}
                </a>
              </li>
              <li className="font-bold">{activeCombat.name}</li>
            </ul>
          </div>
        )}
        <h1 className="text-3xl font-bold">{activeCombat.name}</h1>
        <p className="text-base-content/60">
          Round {activeCombat.round ?? 1} · Turno {(activeCombat.currentTurnIndex ?? 0) + 1} di{' '}
          {activeCombat.participants.length}
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
        {isPrepared ? (
          <button className="btn btn-success gap-1" onClick={onStart}>
            <Swords size={16} /> Inizia Battaglia
          </button>
        ) : (
          <>
            <button className="btn btn-secondary gap-1" onClick={onSortInitiative}>
              <RefreshCw size={16} /> Iniziativa
            </button>
            <button className="btn btn-primary gap-1" onClick={onNextTurn}>
              <SkipForward size={16} /> Turno Successivo
            </button>
          </>
        )}
        {combatStatus !== 'terminated' && !isPrepared && (
          <button className="btn btn-warning gap-1" onClick={onTerminate}>
            <Flag size={16} /> Termina
          </button>
        )}
        <button className="btn btn-ghost gap-1" onClick={onSave}>
          <Save size={16} /> Salva
        </button>
      </div>
    </div>
  );
}
