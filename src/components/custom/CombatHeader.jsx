import { useNavigate } from 'react-router-dom';

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
}) {
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
        <button className="btn btn-secondary" onClick={onSortInitiative}>
          🔄 Iniziativa
        </button>
        <button className="btn btn-primary" onClick={onNextTurn}>
          ⏩ Turno Successivo
        </button>
        {combatStatus !== 'terminated' && (
          <button className="btn btn-warning" onClick={onTerminate}>
            🏁 Termina
          </button>
        )}
        <button className="btn btn-success" onClick={onSave}>
          💾 Salva
        </button>
      </div>
    </div>
  );
}
