import { useState, useCallback } from 'react'
import { useCombatDB } from '../hooks/useCombatDB'
import { CombatTracker } from '../components/CombatTracker/CombatTracker'
import { MonsterLibrary } from '../components/MonsterLibrary/MonsterLibrary'
import { CombatHistory } from '../components/CombatHistory/CombatHistory'
import { Toast } from '../components/Toast/Toast'
import { AntiqueButton } from '../components/custom/AntiqueButton'

export function CombatPage() {
  const combatDB = useCombatDB()
  const [toast, setToast] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1 className="page-title">⚔️ Combattimento</h1>
        <AntiqueButton
          variant="parchment"
          onClick={() => setShowHistory((s) => !s)}
        >
          {showHistory ? '✕ Chiudi Storico' : '📜 Storico'}
        </AntiqueButton>
      </header>

      <main className="combat-columns">
        <div className="combat-col">
          <CombatTracker
            activeCombat={combatDB.activeCombat}
            applyDamage={combatDB.applyDamage}
            heal={combatDB.heal}
            nextTurn={combatDB.nextTurn}
            sortByInitiative={combatDB.sortByInitiative}
            addParticipant={combatDB.addParticipant}
            removeParticipant={combatDB.removeParticipant}
            updateParticipantInitiative={combatDB.updateParticipantInitiative}
            saveToHistory={combatDB.saveToHistory}
            newCombat={combatDB.newCombat}
            showToast={showToast}
          />
        </div>
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
      </main>

      {showHistory && (
        <div className="combat-history-panel">
          <CombatHistory
            combatHistory={combatDB.combatHistory}
            loadFromHistory={combatDB.loadFromHistory}
            deleteFromHistory={combatDB.deleteFromHistory}
            showToast={showToast}
          />
        </div>
      )}

      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
