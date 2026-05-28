import { useState } from 'react'
import { AntiqueButton } from '../custom/AntiqueButton'

const EMPTY_FORM = { name: '', hp: '', ac: '', damage: '' }

export function MonsterLibrary({
  monsterLibrary,
  addParticipant,
  addMonster,
  updateMonster,
  deleteMonster,
  showToast,
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId]     = useState(null)
  const [editForm, setEditForm]       = useState({})
  const [newForm, setNewForm]         = useState(EMPTY_FORM)
  const [initiatives, setInitiatives] = useState({})

  const updateNew  = (f) => (e) => setNewForm((p)  => ({ ...p,  [f]: e.target.value }))
  const updateEdit = (f) => (e) => setEditForm((p) => ({ ...p,  [f]: e.target.value }))

  const setInit = (id, val) =>
    setInitiatives((prev) => ({ ...prev, [id]: val }))

  /* ── Add to combat ── */
  const handleAddToCombat = async (monster) => {
    const initiative = parseInt(initiatives[monster.id] ?? 10) || 10
    await addParticipant({
      name:      monster.name,
      type:      'monster',
      currentHp: monster.hp,
      maxHp:     monster.hp,
      ac:        monster.ac,
      initiative,
      damage:    monster.damage,
    })
    showToast(`${monster.name} aggiunto al combattimento (Init: ${initiative})`)
  }

  /* ── Add new monster to library ── */
  const handleAddMonster = async () => {
    if (!newForm.name.trim() || !newForm.hp || !newForm.ac) {
      showToast('Compila nome, HP e CA')
      return
    }
    await addMonster({
      name:   newForm.name.trim(),
      hp:     parseInt(newForm.hp),
      ac:     parseInt(newForm.ac),
      damage: newForm.damage.trim() || '1d6',
    })
    showToast(`${newForm.name} aggiunto alla libreria`)
    setNewForm(EMPTY_FORM)
    setShowAddForm(false)
  }

  /* ── Edit monster ── */
  const startEdit = (monster) => {
    setEditingId(monster.id)
    setEditForm({ ...monster })
  }

  const handleUpdateMonster = async () => {
    if (!editForm.name?.trim() || !editForm.hp || !editForm.ac) {
      showToast('Compila tutti i campi')
      return
    }
    await updateMonster(editingId, {
      name:   editForm.name.trim(),
      hp:     parseInt(editForm.hp),
      ac:     parseInt(editForm.ac),
      damage: editForm.damage?.trim() || '1d6',
    })
    showToast('Mostro aggiornato')
    setEditingId(null)
    setEditForm({})
  }

  /* ── Delete monster ── */
  const handleDelete = async (monster) => {
    await deleteMonster(monster.id)
    showToast(`${monster.name} eliminato dalla libreria`)
  }

  return (
    <div className="monster-library-container">
      {/* ── Header ── */}
      <div className="monster-library-header">
        <h2>📚 Libreria Mostri</h2>
        <AntiqueButton
          variant="heal"
          onClick={() => setShowAddForm((s) => !s)}
        >
          {showAddForm ? '✕ Chiudi' : '+ Nuovo Mostro'}
        </AntiqueButton>
      </div>

      {/* ── Add Form ── */}
      {showAddForm && (
        <div className="monster-library-form-box">
          <h3>Aggiungi Mostro</h3>
          <div className="monster-library-form-grid">
            <input placeholder="Nome *"              value={newForm.name}   onChange={updateNew('name')}   />
            <input type="number" placeholder="HP *"  value={newForm.hp}     onChange={updateNew('hp')}    min="1" />
            <input type="number" placeholder="CA *"  value={newForm.ac}     onChange={updateNew('ac')}    min="1" />
            <input placeholder="Danno (es. 2d6+3)"   value={newForm.damage} onChange={updateNew('damage')} />
          </div>
          <div className="monster-library-form-actions">
            <AntiqueButton variant="heal" onClick={handleAddMonster}>Aggiungi</AntiqueButton>
            <AntiqueButton variant="secondary" onClick={() => setShowAddForm(false)}>Annulla</AntiqueButton>
          </div>
        </div>
      )}

      {/* ── Monster Grid ── */}
      <div className="monster-library-list">
        {!monsterLibrary?.length && (
          <div className="monster-library-empty">
            <p className="monster-library-empty-title">Nessun mostro in libreria</p>
            <p className="monster-library-empty-text">
              Crea il primo mostro con il pulsante in alto.
            </p>
          </div>
        )}

        {monsterLibrary?.map((monster) =>
          editingId === monster.id ? (
            /* ── Edit Card ── */
            <div key={monster.id} className={`monster-card monster-library-edit-card`}>
              <div className="monster-library-edit-grid">
                <input placeholder="Nome"   value={editForm.name   ?? ''} onChange={updateEdit('name')}   />
                <input type="number" placeholder="HP"   value={editForm.hp     ?? ''} onChange={updateEdit('hp')}     min="1" />
                <input type="number" placeholder="CA"   value={editForm.ac     ?? ''} onChange={updateEdit('ac')}     min="1" />
                <input placeholder="Danno" value={editForm.damage  ?? ''} onChange={updateEdit('damage')}  />
              </div>
              <div className="monster-library-form-actions">
                <AntiqueButton variant="heal" onClick={handleUpdateMonster}>✓ Salva</AntiqueButton>
                <AntiqueButton variant="secondary" onClick={() => setEditingId(null)}>✕ Annulla</AntiqueButton>
              </div>
            </div>
          ) : (
            /* ── Monster Card ── */
            <div key={monster.id} className="monster-card">
              <div className="monster-card-head">
                <div className="monster-info">
                  <span className="monster-name">{monster.name}</span>
                  <span className="monster-subtitle">Creatura pronta al combattimento</span>
                </div>

                <div className="monster-quick-actions">
                  <button
                    className="monster-btn-icon"
                    onClick={() => startEdit(monster)}
                    title="Modifica"
                  >
                    ✏
                  </button>
                  <button
                    className="monster-btn-icon-danger"
                    onClick={() => handleDelete(monster)}
                    title="Elimina"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <div className="monster-card-body">
                <div className="stat-pills">
                  <span className="pill">❤ {monster.hp}</span>
                  <span className="pill">🛡 {monster.ac}</span>
                  <span className="pill">⚔ {monster.damage}</span>
                </div>

                <div className="monster-card-actions">
                  <div className="init-row">
                    <label>Iniziativa</label>
                    <input
                      type="number"
                      className="init-input"
                      value={initiatives[monster.id] ?? 10}
                      onChange={(e) => setInit(monster.id, e.target.value)}
                    />
                  </div>

                  <AntiqueButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddToCombat(monster)}
                  >
                    + Combattimento
                  </AntiqueButton>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
