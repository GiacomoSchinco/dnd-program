import { useState, useCallback } from 'react'
import { useCombatDB } from '../hooks/useCombatDB'
import { MonsterLibrary } from '../components/MonsterLibrary/MonsterLibrary'
import { Toast } from '../components/Toast/Toast'

export function MonstersPage() {
  const { monsterLibrary, addParticipant, addMonster, updateMonster, deleteMonster } =
    useCombatDB()
  const [toast, setToast] = useState('')
  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1 className="page-title">🐉 Libreria Mostri</h1>
      </header>
      <main className="page-main">
        <MonsterLibrary
          monsterLibrary={monsterLibrary}
          addParticipant={addParticipant}
          addMonster={addMonster}
          updateMonster={updateMonster}
          deleteMonster={deleteMonster}
          showToast={showToast}
        />
      </main>
      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
