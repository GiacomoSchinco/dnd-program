import { useState } from 'react';
import { ParticipantActions } from './ParticipantActions';
import { Target, Pencil, Heart } from 'lucide-react';

export function ParticipantList({
  participants,
  currentTurnIndex,
  currentParticipantId,
  applyDamage,
  heal,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
  isTerminated = false,
}) {
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [initiativeValue, setInitiativeValue] = useState('');

  const handleInitiativeSubmit = async (participantId) => {
    const value = parseInt(initiativeValue);
    if (isNaN(value)) {
      showToast('Inserisci un numero valido');
      return;
    }
    await updateParticipantInitiative(participantId, value);
    setEditingInitiative(null);
    setInitiativeValue('');
    showToast('Iniziativa aggiornata');
  };

  if (participants.length === 0) {
    return (
      <div className="alert alert-info">
        <span>Nessun partecipante. Aggiungi PG o Mostri!</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participants.map((participant, idx) => {
        const isCurrentTurn = currentParticipantId
        ? participant.id === currentParticipantId
        : idx === currentTurnIndex;
        const currentHp = participant.currentHp ?? participant.hp ?? 0;
        const maxHp = participant.maxHp ?? participant.hp ?? 1;
        const hpPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
        
        let hpColor = 'progress-primary';
        if (hpPercent < 25) hpColor = 'progress-error';
        else if (hpPercent < 50) hpColor = 'progress-warning';
        
        const isPC = participant.type === 'pc';
        const isNPC = participant.type === 'npc';
        const isMonster = participant.type === 'monster';

        return (
          <div
            key={participant.id}
            className={`card bg-base-200 shadow-md transition-all ${
              isCurrentTurn ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''
            }`}
          >
            <div className="card-body p-3">
              {/* Header: Nome e Badge */}
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-lg">{participant.name}</h3>
                  {isPC && <span className="badge badge-success">PG</span>}
                  {isNPC && <span className="badge badge-info">NPC</span>}
                  {isMonster && <span className="badge badge-error">Mostro</span>}
                  {isCurrentTurn && (
                    <span className="badge badge-primary">Turno Corrente</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Iniziativa */}
                  {editingInitiative === participant.id ? (
                    <div className="join">
                      <input
                        type="number"
                        className="input input-bordered input-xs w-20 join-item"
                        value={initiativeValue}
                        onChange={(e) => setInitiativeValue(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="btn btn-primary btn-xs join-item"
                        onClick={() => handleInitiativeSubmit(participant.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="btn btn-ghost btn-xs join-item"
                        onClick={() => setEditingInitiative(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => {
                        setEditingInitiative(participant.id);
                        setInitiativeValue(String(participant.initiative || 0));
                      }}
                      disabled={isTerminated}
                      title="Modifica iniziativa"
                    >
                      <span className="flex items-center gap-1"><Target size={12} /> Init {participant.initiative || 0}</span>
                      {!isTerminated && <Pencil size={10} />}
                    </button>
                  )}
                  
                  {/* CA */}
                  <span className="text-sm text-base-content/60">
                    CA {participant.ac || 10}
                  </span>
                </div>
              </div>

              {/* HP e Barra */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1"><Heart size={12} /> HP</span>
                  <span className="font-bold">
                    {currentHp} / {maxHp}
                  </span>
                </div>
                <progress
                  className={`progress ${hpColor} w-full h-3`}
                  value={currentHp}
                  max={maxHp}
                />
              </div>

              {/* Bottoni Azioni */}
              {!isTerminated && (
                <ParticipantActions
                  participant={participant}
                  applyDamage={applyDamage}
                  heal={heal}
                  removeParticipant={removeParticipant}
                  showToast={showToast}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}