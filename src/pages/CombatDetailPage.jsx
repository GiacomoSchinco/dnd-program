import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CombatTracker } from '../components/CombatTracker/CombatTracker'
import { MonsterLibrary } from '../components/MonsterLibrary/MonsterLibrary'
import { Toast } from '../components/Toast/Toast'
import { AntiqueButton } from '../components/custom/AntiqueButton'
import { useCombatDB } from '../hooks/useCombatDB'

export function CombatDetailPage() {
  const { combatId } = useParams()
  const navigate = useNavigate()
  const combatDB = useCombatDB()
  const [toast, setToast] = useState('')
  const [showMonsterLibrary, setShowMonsterLibrary] = useState(false)

  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  const numericCombatId = Number(combatId)
  const allCombats = combatDB.combats ?? []
  const campaigns = combatDB.campaigns ?? []
  const allCharacters = combatDB.characters ?? []
  const combatRecord = allCombats.find((combat) => combat.id === numericCombatId)
  const activeCombat =
    combatDB.activeCombat?.combatId === numericCombatId
      ? combatDB.activeCombat
      : null

  useEffect(() => {
    if (!Number.isFinite(numericCombatId)) return
    if (activeCombat?.combatId === numericCombatId) return
    if (!combatRecord) return
    combatDB.loadCombat(numericCombatId)
  }, [numericCombatId, activeCombat?.combatId, combatRecord, combatDB])

  const selectedCampaignId = activeCombat?.campaignId ?? combatRecord?.campaignId ?? null
  const selectedCampaign = campaigns.find((campaign) => campaign.id === selectedCampaignId)

  const campaignCharacters = useMemo(
    () => allCharacters.filter((character) => character.campaignId === selectedCampaignId),
    [allCharacters, selectedCampaignId],
  )

  const statusLabel =
    activeCombat?.status === 'terminated' || combatRecord?.status === 'terminated'
      ? 'Terminata'
      : activeCombat?.status === 'in_progress' || combatRecord?.status === 'in_progress'
        ? 'In corso'
        : 'Preparata'

  const statusClass =
    statusLabel === 'Terminata'
      ? 'terminated'
      : statusLabel === 'In corso'
        ? 'in-progress'
        : 'prepared'

  return (
    <div className="page-layout">
      <header className="page-header">
        <div>
          <p className="combat-detail-kicker">Dettaglio battaglia</p>
          <h1 className="page-title">⚔️ {combatRecord?.name || 'Battaglia'}</h1>
          <p className="combat-table-subtitle">
            {selectedCampaign ? `Campagna: ${selectedCampaign.name}` : 'Campagna non trovata'}
          </p>
        </div>
        <div className="combat-header-actions">
          <AntiqueButton variant="ancient" onClick={() => navigate('/combat')}>
            ← Torna all'elenco
          </AntiqueButton>
          <AntiqueButton
            variant="secondary"
            onClick={() => setShowMonsterLibrary((show) => !show)}
          >
            {showMonsterLibrary ? '🙈 Nascondi Mostri' : '👹 Mostri'}
          </AntiqueButton>
          <span
            className={`combat-status-badge ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>
      </header>

      {!combatRecord ? (
        <section className="combat-detail-empty" aria-label="Battaglia non trovata">
          <h2 className="combat-detail-title">Battaglia non trovata</h2>
          <p className="combat-table-subtitle">
            Il record selezionato non esiste piu o non appartiene a questa sessione.
          </p>
        </section>
      ) : !activeCombat ? (
        <section className="combat-detail-empty" aria-label="Caricamento battaglia">
          <h2 className="combat-detail-title">Caricamento battaglia...</h2>
          <p className="combat-table-subtitle">
            Sto preparando il dettaglio del combattimento selezionato.
          </p>
        </section>
      ) : (
        <section className="combat-detail-section" aria-label="Dettaglio completo battaglia">
          <main className={`combat-columns ${showMonsterLibrary ? '' : 'combat-columns-single'}`}>
            <div className="combat-col">
              <CombatTracker
                activeCombat={activeCombat}
                campaignCharacters={campaignCharacters}
                selectedCampaignId={selectedCampaignId}
                applyDamage={combatDB.applyDamage}
                heal={combatDB.heal}
                nextTurn={combatDB.nextTurn}
                sortByInitiative={combatDB.sortByInitiative}
                addParticipant={combatDB.addParticipant}
                removeParticipant={combatDB.removeParticipant}
                updateParticipantInitiative={combatDB.updateParticipantInitiative}
                saveToHistory={combatDB.saveToHistory}
                setCombatStatus={combatDB.setCombatStatus}
                newCombat={combatDB.newCombat}
                showToast={showToast}
              />
            </div>
            {showMonsterLibrary && (
              <div className="combat-col">
                <MonsterLibrary
                  monsterLibrary={combatDB.monsterLibrary}
                  addParticipant={combatDB.addParticipant}
                  addMonster={combatDB.addMonster}
                  updateMonster={combatDB.updateMonster}
                  deleteMonster={combatDB.deleteMonster}
                  showToast={showToast}
                />
              </div>
            )}
          </main>
        </section>
      )}

      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}