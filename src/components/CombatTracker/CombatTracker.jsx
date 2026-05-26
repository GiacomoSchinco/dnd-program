import { useState } from 'react'
import { ParticipantList } from '../ParticipantList/ParticipantList'
import { AntiqueButton } from '../custom/AntiqueButton'

const EMPTY_PC_FORM = { name: '', maxHp: '', ac: '', initiative: '' }

export function CombatTracker({
  activeCombat,
  applyDamage,
  heal,
  nextTurn,
  sortByInitiative,
  addParticipant,
  removeParticipant,
  updateParticipantInitiative,
  saveToHistory,
  newCombat,
  showToast,
}) {
  const [showAddPC, setShowAddPC] = useState(false)
  const [pcForm, setPcForm] = useState(EMPTY_PC_FORM)
  const [saveName, setSaveName] = useState('')

  const participants    = activeCombat?.participants    ?? []
  const currentTurnIndex = activeCombat?.currentTurnIndex ?? 0
  const round           = activeCombat?.round           ?? 1

  const updateField = (field) => (e) =>
    setPcForm((f) => ({ ...f, [field]: e.target.value }))

  const handleAddPC = async () => {
    if (!pcForm.name.trim() || !pcForm.maxHp || !pcForm.ac) {
      showToast('Compila nome, HP massimi e CA')
      return
    }
    await addParticipant({
      name:      pcForm.name.trim(),
      type:      'pc',
      currentHp: parseInt(pcForm.maxHp),
      maxHp:     parseInt(pcForm.maxHp),
      ac:        parseInt(pcForm.ac),
      initiative: parseInt(pcForm.initiative) || 0,
    })
    showToast(`${pcForm.name} aggiunto al combattimento`)
    setPcForm(EMPTY_PC_FORM)
    setShowAddPC(false)
  }

  const handleSave = async () => {
    if (!participants.length) {
      showToast('Nessun partecipante da salvare')
      return
    }
    await saveToHistory(saveName.trim() || activeCombat?.name || 'Combattimento')
    showToast('Combattimento salvato nello storico')
    setSaveName('')
  }

  const handleNew = async () => {
    await newCombat()
    showToast('Nuovo combattimento iniziato')
    setSaveName('')
  }

  return (
    <div className="combat-tracker-container">
      {/* ── Header ── */}
      <div className="combat-tracker-header">
        <div className="combat-tracker-title-row">
          <h2>⚔️ Combattimento Attivo</h2>
          <span className="round-badge">Round {round}</span>
        </div>
        <div className="combat-tracker-controls">
          <AntiqueButton
            onClick={nextTurn}
            disabled={!participants.length}
          >
            ▶ Turno Successivo
          </AntiqueButton>
          <AntiqueButton
            variant="secondary"
            onClick={sortByInitiative}
            disabled={!participants.length}
          >
            ↕ Ordina
          </AntiqueButton>
          <AntiqueButton
            variant="heal"
            onClick={() => setShowAddPC((s) => !s)}
          >
            {showAddPC ? '✕ Chiudi' : '+ PG'}
          </AntiqueButton>
        </div>
      </div>

      {/* ── Add PC Form ── */}
      {showAddPC && (
        <div className="combat-tracker-add-pc-form">
          <h3>Aggiungi Personaggio Giocante</h3>
          <div className="combat-tracker-form-row">
            <input
              placeholder="Nome *"
              value={pcForm.name}
              onChange={updateField('name')}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPC()}
            />
            <input
              type="number"
              placeholder="HP Max *"
              value={pcForm.maxHp}
              onChange={updateField('maxHp')}
              min="1"
            />
            <input
              type="number"
              placeholder="CA *"
              value={pcForm.ac}
              onChange={updateField('ac')}
              min="1"
            />
            <input
              type="number"
              placeholder="Iniziativa"
              value={pcForm.initiative}
              onChange={updateField('initiative')}
            />
          </div>
          <div className="combat-tracker-form-actions">
            <AntiqueButton variant="heal" onClick={handleAddPC}>
              Aggiungi PG
            </AntiqueButton>
            <AntiqueButton
              variant="secondary"
              onClick={() => setShowAddPC(false)}
            >
              Annulla
            </AntiqueButton>
          </div>
        </div>
      )}

      {/* ── Participant List ── */}
      <div className="combat-tracker-list-wrapper">
        <ParticipantList
          participants={participants}
          currentTurnIndex={currentTurnIndex}
          applyDamage={applyDamage}
          heal={heal}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={showToast}
        />
      </div>

      {/* ── Footer ── */}
      <div className="combat-tracker-footer">
        <input
          className="combat-tracker-save-input"
          placeholder="Nome combattimento..."
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <AntiqueButton variant="secondary" onClick={handleSave}>
          💾 Salva
        </AntiqueButton>
        <AntiqueButton variant="danger" onClick={handleNew}>
          🗑 Nuovo
        </AntiqueButton>
      </div>
    </div>
  )
}
