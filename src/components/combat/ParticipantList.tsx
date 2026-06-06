import { useState } from 'react';
import { ParticipantActions } from './ParticipantActions';
import { HPBar } from '../ui/HPBar';
import { Target, Pencil } from 'lucide-react';
import type { CombatParticipant } from '../../types';

interface ParticipantListProps {
  participants: CombatParticipant[];
  currentTurnIndex: number;
  currentParticipantId?: string | null;
  applyDamage: (id: string, damage: number) => void;
  heal: (id: string, heal: number) => void;
  removeParticipant: (id: string) => void;
  updateParticipantInitiative: (id: string, initiative: number) => Promise<void>;
  showToast: (msg: string) => void;
  isTerminated?: boolean;
}

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
}: ParticipantListProps) {
  const [editingInitiative, setEditingInitiative] = useState<string | null>(null);
  const [initiativeValue, setInitiativeValue] = useState<string>('');

  const handleInitiativeSubmit = async (participantId: string) => {
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

        const isPC = participant.type === 'pc';
        const isNPC = participant.type === 'npc';
        const isMonster = participant.type === 'monster';

        return (
          <div
            key={participant.id}
            className={`card bg-base-100 shadow-md transition-all ${
              isCurrentTurn ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100' : ''
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
              <HPBar current={currentHp} max={maxHp} size="md" />

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