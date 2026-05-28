import { useEffect, useState } from 'react'
import { ParticipantList } from '../ParticipantList/ParticipantList'
import { AntiqueButton } from '../custom/AntiqueButton'
import AncientContainer from '../custom/AncientContainer'

const EMPTY_NPC_FORM = { name: '', maxHp: '', ac: '', initiative: '' }

export function CombatTracker({
  activeCombat,
  campaignCharacters = [],
  selectedCampaignId,
  applyDamage,
  heal,
  nextTurn,
  sortByInitiative,
  addParticipant,
  removeParticipant,
  updateParticipantInitiative,
  saveToHistory,
  setCombatStatus,
  newCombat,
  showToast,
}) {
  const [showAddPG, setShowAddPG] = useState(false)
  const [showAddNPC, setShowAddNPC] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState('')
  const [pgInitiative, setPgInitiative] = useState('')
  const [npcForm, setNpcForm] = useState(EMPTY_NPC_FORM)
  const [saveName, setSaveName] = useState('')

  const participants    = activeCombat?.participants    ?? []
  const currentTurnIndex = activeCombat?.currentTurnIndex ?? 0
  const round           = activeCombat?.round           ?? 1
  const combatStatus    = activeCombat?.status ?? 'prepared'

  useEffect(() => {
    setSaveName(activeCombat?.name ?? '')
  }, [activeCombat?.name])

  const updateNpcField = (field) => (e) =>
    setNpcForm((f) => ({ ...f, [field]: e.target.value }))

  const handleAddPGFromCampaign = async () => {
    if (isTerminated) {
      showToast('Battaglia terminata: imposta In corso per modificare')
      return
    }

    if (selectedCampaignId == null) {
      showToast('Seleziona prima una campagna')
      return
    }

    if (!selectedCharacterId) {
      showToast('Seleziona un personaggio dalla campagna')
      return
    }

    const char = campaignCharacters.find((c) => String(c.id) === selectedCharacterId)
    if (!char) {
      showToast('Personaggio non trovato')
      return
    }

    const maxHp = Number(char.maxHp) || 1
    const currentHp = char.currentHp ?? maxHp

    await addParticipant({
      name: char.name,
      type: 'pc',
      characterId: char.id,
      campaignId: char.campaignId,
      currentHp: Math.max(0, Math.min(maxHp, Number(currentHp))),
      maxHp,
      ac: Number(char.ac) || 10,
      initiative: parseInt(pgInitiative) || 0,
    })
    showToast(`${char.name} aggiunto al combattimento`)
    setSelectedCharacterId('')
    setPgInitiative('')
    setShowAddPG(false)
  }

  const handleAddNPC = async () => {
    if (isTerminated) {
      showToast('Battaglia terminata: imposta In corso per modificare')
      return
    }

    if (!npcForm.name.trim() || !npcForm.maxHp || !npcForm.ac) {
      showToast('Compila nome, HP massimi e CA')
      return
    }
    await addParticipant({
      name: npcForm.name.trim(),
      type: 'npc',
      currentHp: parseInt(npcForm.maxHp),
      maxHp: parseInt(npcForm.maxHp),
      ac: parseInt(npcForm.ac),
      initiative: parseInt(npcForm.initiative) || 0,
    })
    showToast(`${npcForm.name} aggiunto come NPC`)
    setNpcForm(EMPTY_NPC_FORM)
    setShowAddNPC(false)
  }

  const handleSave = async () => {
    await saveToHistory(saveName.trim() || activeCombat?.name || 'Combattimento')
    showToast('Nome battaglia salvato')
  }

  const handleNew = async () => {
    await newCombat()
    showToast('Nuovo combattimento iniziato')
  }

  const handleSetInProgress = async () => {
    if (!activeCombat?.combatId) {
      showToast('Apri prima una battaglia')
      return
    }
    await setCombatStatus(activeCombat.combatId, 'in_progress')
    showToast('Battaglia impostata in corso')
  }

  const handleTerminate = async () => {
    if (!activeCombat?.combatId) {
      showToast('Apri prima una battaglia da terminare')
      return
    }

    await setCombatStatus(activeCombat.combatId, 'terminated')
    showToast('Battaglia terminata')
  }

  const statusLabel =
    combatStatus === 'terminated'
      ? 'Terminata'
      : combatStatus === 'in_progress'
        ? 'In corso'
        : 'Preparata'

  const statusClass =
    combatStatus === 'terminated'
      ? 'terminated'
      : combatStatus === 'in_progress'
        ? 'in-progress'
        : 'prepared'

  const canMutateStatus = !!activeCombat?.combatId
  const isTerminated = combatStatus === 'terminated'

  const headerTitle =
    combatStatus === 'terminated'
      ? '⚔️ Battaglia Terminata'
      : '⚔️ Combattimento Attivo'

  const actionBlocked = !participants.length || isTerminated

  const mutationDisabledMessage = isTerminated
    ? 'Battaglia terminata'
    : undefined

  const handleNextTurn = () => {
    if (isTerminated) {
      showToast('Questa battaglia e terminata: riaprila come In corso per continuare')
      return
    }
    nextTurn()
  }

  const handleSort = () => {
    if (isTerminated) {
      showToast('Questa battaglia e terminata: riaprila come In corso per continuare')
      return
    }
    sortByInitiative()
  }

  return (
    <div className="combat-tracker-container">
      {/* ── Header ── */}
      <div className="combat-tracker-header">
        <div className="combat-tracker-title-row">
          <h2>{headerTitle}</h2>
          <span className="round-badge">Round {round}</span>
        </div>
        <div className="combat-tracker-management">
          <div className="combat-tracker-save-row">
            <input
              className="combat-tracker-save-input"
              placeholder="Nome combattimento..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <AntiqueButton variant="secondary" onClick={handleSave}>
              💾 Salva Nome
            </AntiqueButton>
          </div>
          <div className="combat-tracker-status-row">
            <span className={`combat-status-badge ${statusClass}`}>
              {statusLabel}
            </span>
            <AntiqueButton
              variant="primary"
              onClick={handleSetInProgress}
              disabled={!canMutateStatus || combatStatus === 'in_progress'}
            >
              ▶ In corso
            </AntiqueButton>
            <AntiqueButton
              variant="danger"
              onClick={handleTerminate}
              disabled={!canMutateStatus || isTerminated}
            >
              ✓ Terminata
            </AntiqueButton>
          </div>
        </div>
        <div className="combat-tracker-controls">
          <AntiqueButton
            onClick={handleNextTurn}
            disabled={actionBlocked}
            title={mutationDisabledMessage}
          >
            ▶ Turno Successivo
          </AntiqueButton>
          <AntiqueButton
            variant="secondary"
            onClick={handleSort}
            disabled={actionBlocked}
            title={mutationDisabledMessage}
          >
            ↕ Ordina
          </AntiqueButton>
          <AntiqueButton
            variant="heal"
            onClick={() => setShowAddPG((s) => !s)}
            disabled={isTerminated}
            title={mutationDisabledMessage}
          >
            {showAddPG ? '✕ Chiudi PG' : '+ PG'}
          </AntiqueButton>
          <AntiqueButton
            variant="secondary"
            onClick={() => setShowAddNPC((s) => !s)}
            disabled={isTerminated}
            title={mutationDisabledMessage}
          >
            {showAddNPC ? '✕ Chiudi NPC' : '+ NPC'}
          </AntiqueButton>
          <AntiqueButton variant="danger" onClick={handleNew}>
            🗑 Nuovo
          </AntiqueButton>
        </div>
      </div>

      {/* ── Add PG da campagna ── */}
      {showAddPG && (
        <div className="combat-tracker-add-pc-form">
          <h3>Aggiungi PG dalla campagna</h3>
          <div className="combat-tracker-form-row combat-tracker-form-row-pg">
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              disabled={selectedCampaignId == null}
            >
              <option value="">Seleziona un PG...</option>
              {campaignCharacters.map((char) => (
                <option key={char.id} value={String(char.id)}>
                  {char.name} (HP {char.currentHp ?? char.maxHp}/{char.maxHp})
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Iniziativa"
              value={pgInitiative}
              onChange={(e) => setPgInitiative(e.target.value)}
            />
          </div>
          <div className="combat-tracker-form-actions">
            <AntiqueButton variant="heal" onClick={handleAddPGFromCampaign}>
              Aggiungi PG
            </AntiqueButton>
            <AntiqueButton variant="ancient" onClick={() => setShowAddPG(false)}>
              Annulla
            </AntiqueButton>
          </div>
        </div>
      )}

      {/* ── Add NPC manuale ── */}
      {showAddNPC && (
        <AncientContainer
          title="Aggiungi NPC"
          showDecorations={false}
          contentClassName="p-4"
        >
          <div className="ui-form-grid-3 mb-3">
            <label className="ui-label">
              Nome
              <input
                placeholder="Nome NPC *"
                value={npcForm.name}
                onChange={updateNpcField('name')}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNPC()}
              />
            </label>
            <label className="ui-label">
              HP Massimi
              <input
                type="number"
                placeholder="HP Max *"
                value={npcForm.maxHp}
                onChange={updateNpcField('maxHp')}
                min="1"
              />
            </label>
            <label className="ui-label">
              CA
              <input
                type="number"
                placeholder="CA *"
                value={npcForm.ac}
                onChange={updateNpcField('ac')}
                min="1"
              />
            </label>
            <label className="ui-label">
              Iniziativa
              <input
                type="number"
                placeholder="Iniziativa"
                value={npcForm.initiative}
                onChange={updateNpcField('initiative')}
              />
            </label>
          </div>

          <div className="ui-form-actions">
            <AntiqueButton variant="heal" onClick={handleAddNPC} disabled={isTerminated}>
              Aggiungi NPC
            </AntiqueButton>
            <AntiqueButton
              variant="ancient"
              onClick={() => setShowAddNPC(false)}
            >
              Annulla
            </AntiqueButton>
          </div>
        </AncientContainer>
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
    </div>
  )
}
