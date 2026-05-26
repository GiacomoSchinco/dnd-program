function formatDate(iso) {
  return new Date(iso).toLocaleString('it-IT', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export function CombatHistory({
  combatHistory,
  loadFromHistory,
  deleteFromHistory,
  showToast,
}) {
  const handleLoad = async (combat) => {
    await loadFromHistory(combat.id)
    showToast(`"${combat.name}" caricato nel combattimento attivo`)
  }

  const handleDelete = async (combat) => {
    await deleteFromHistory(combat.id)
    showToast(`"${combat.name}" eliminato dallo storico`)
  }

  return (
    <div className="combat-history-container">
      <h2>📜 Storico Combattimenti</h2>

      {!combatHistory?.length ? (
        <p className="combat-history-empty">Nessun combattimento salvato nello storico.</p>
      ) : (
        <div className="combat-history-list">
          {combatHistory.map((combat) => (
            <div key={combat.id} className="combat-history-item">
              <div className="combat-history-info">
                <span className="combat-history-name">{combat.name}</span>
                <span className="combat-history-meta">
                  {formatDate(combat.date)} &middot;&nbsp;
                  {combat.participants?.length ?? 0} partecipanti &middot;&nbsp;
                  Round {combat.round ?? 1}
                </span>
              </div>
              <div className="combat-history-actions">
                <button className="btn-load" onClick={() => handleLoad(combat)}>▶ Carica</button>
                <button className="btn-delete" onClick={() => handleDelete(combat)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
