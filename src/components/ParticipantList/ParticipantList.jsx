import { ParticipantCard } from '../ParticipantCard/ParticipantCard'

export function ParticipantList({
  participants,
  currentTurnIndex,
  applyDamage,
  heal,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
}) {
  if (!participants || participants.length === 0) {
    return (
      <div className="participant-list-empty">
        <p>Nessun partecipante nel combattimento.</p>
        <p>Aggiungi un PG con il form sopra o un mostro dalla libreria.</p>
      </div>
    )
  }

  return (
    <div className="participant-list">
      {participants.map((participant, index) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          isCurrentTurn={index === currentTurnIndex}
          applyDamage={applyDamage}
          heal={heal}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={showToast}
        />
      ))}
    </div>
  )
}
