import { useState, useCallback } from 'react'
import { usePartyDB } from '../hooks/usePartyDB'
import { useCombatDB } from '../hooks/useCombatDB'
import { Toast } from '../components/Toast/Toast'
import { AntiqueButton } from '../components/custom/AntiqueButton'
import AncientContainer from '../components/custom/AncientContainer'

const CLASSES = [
  'Barbaro', 'Bardo', 'Chierico', 'Druido', 'Guerriero',
  'Ladro', 'Mago', 'Monaco', 'Paladino', 'Ranger', 'Stregone', 'Warlock',
]
const RACES = [
  'Draconide', 'Elfo', 'Gnomo', 'Halfling', 'Mezzelfo',
  'Mezzorco', 'Nano', 'Tiefling', 'Umano',
]

const emptyChar = {
  name: '', class: 'Guerriero', race: 'Umano',
  level: 1, maxHp: 10, ac: 10,
}

export function PartyPage() {
  const { campaigns, characters, addCampaign, updateCampaign, deleteCampaign,
    addCharacter, updateCharacter, deleteCharacter } = usePartyDB()
  const { addParticipant } = useCombatDB()

  const [toast, setToast] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  // Campaign form
  const [newCampaignName, setNewCampaignName] = useState('')
  const [editingCampaign, setEditingCampaign] = useState(null) // { id, name }

  // Character form
  const [showCharForm, setShowCharForm] = useState(false)
  const [editingChar, setEditingChar] = useState(null) // character object
  const [charForm, setCharForm] = useState(emptyChar)

  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  // ── Campaigns ──────────────────────────────────────────────────────────────
  const handleAddCampaign = async (e) => {
    e.preventDefault()
    if (!newCampaignName.trim()) return
    await addCampaign(newCampaignName.trim())
    setNewCampaignName('')
  }

  const handleSaveCampaign = async () => {
    if (!editingCampaign?.name.trim()) return
    await updateCampaign(editingCampaign.id, editingCampaign.name.trim())
    setEditingCampaign(null)
  }

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Eliminare la campagna e tutti i suoi personaggi?')) return
    await deleteCampaign(id)
    if (selectedCampaign === id) setSelectedCampaign(null)
  }

  // ── Characters ─────────────────────────────────────────────────────────────
  const campaignChars = (characters ?? []).filter(
    (c) => c.campaignId === selectedCampaign,
  )

  const openAddChar = () => {
    setEditingChar(null)
    setCharForm({ ...emptyChar })
    setShowCharForm(true)
  }

  const openEditChar = (char) => {
    setEditingChar(char)
    setCharForm({ ...char })
    setShowCharForm(true)
  }

  const handleSaveChar = async (e) => {
    e.preventDefault()
    const data = {
      ...charForm,
      level: Number(charForm.level) || 1,
      maxHp: Number(charForm.maxHp) || 1,
      ac: Number(charForm.ac) || 10,
    }
    if (editingChar) {
      await updateCharacter(editingChar.id, data)
      showToast(`${data.name} aggiornato`)
    } else {
      await addCharacter({ ...data, campaignId: selectedCampaign })
      showToast(`${data.name} aggiunto al gruppo`)
    }
    setShowCharForm(false)
  }

  const handleDeleteChar = async (char) => {
    if (!window.confirm(`Eliminare ${char.name}?`)) return
    await deleteCharacter(char.id)
    showToast(`${char.name} rimosso`)
  }

  const handleAddToCombat = async (char) => {
    await addParticipant({
      name: char.name,
      maxHp: char.maxHp,
      currentHp: char.maxHp,
      ac: char.ac,
      initiative: 0,
      type: 'pc',
    })
    showToast(`${char.name} aggiunto al combattimento`)
  }

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1 className="page-title">👥 Gruppo</h1>
      </header>

      <div className="page-body">
        {/* ── Sidebar campagne ── */}
        <aside className="page-sidebar">
          <h2 className="section-title">Campagne</h2>

          <form className="flex gap-2" onSubmit={handleAddCampaign}>
            <input
              className="flex-1 min-w-0"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              placeholder="Nome campagna…"
            />
            <AntiqueButton type="submit" size="sm">+</AntiqueButton>
          </form>

          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {(campaigns ?? []).map((camp) => (
              <li key={camp.id}>
                {editingCampaign?.id === camp.id ? (
                  <div className="flex gap-1">
                    <input
                      className="flex-1 min-w-0"
                      value={editingCampaign.name}
                      onChange={(e) =>
                        setEditingCampaign({ ...editingCampaign, name: e.target.value })
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveCampaign()}
                      autoFocus
                    />
                    <AntiqueButton size="xs" onClick={handleSaveCampaign}>✓</AntiqueButton>
                    <AntiqueButton size="xs" variant="ancient" onClick={() => setEditingCampaign(null)}>✕</AntiqueButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      className={`campaign-item-btn${selectedCampaign === camp.id ? ' is-active' : ''}`}
                      onClick={() =>
                        setSelectedCampaign(selectedCampaign === camp.id ? null : camp.id)
                      }
                    >
                      <span>⚔ {camp.name}</span>
                      <span className="campaign-count">
                        {(characters ?? []).filter((c) => c.campaignId === camp.id).length} PG
                      </span>
                    </button>
                    <AntiqueButton
                      size="xs" variant="ghost"
                      onClick={() => setEditingCampaign({ id: camp.id, name: camp.name })}
                      title="Rinomina"
                    >✏️</AntiqueButton>
                    <AntiqueButton
                      size="xs" variant="danger"
                      onClick={() => handleDeleteCampaign(camp.id)}
                      title="Elimina"
                    >🗑</AntiqueButton>
                  </div>
                )}
              </li>
            ))}
            {(campaigns ?? []).length === 0 && (
              <li className="ui-empty">Nessuna campagna. Creane una!</li>
            )}
          </ul>
        </aside>

        {/* ── Sezione personaggi ── */}
        <section className="page-section">
          {selectedCampaign === null ? (
            <div className="ui-empty-center">
              <p>Seleziona una campagna per vedere i personaggi</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="section-title">
                  {(campaigns ?? []).find((c) => c.id === selectedCampaign)?.name}
                </h2>
                <AntiqueButton onClick={openAddChar} size="sm">+ Nuovo PG</AntiqueButton>
              </div>

              {showCharForm && (
                <AncientContainer
                  title={editingChar ? 'Modifica Personaggio' : 'Nuovo Personaggio'}
                  showDecorations={false}
                  contentClassName="p-4"
                >
                  <form onSubmit={handleSaveChar}>
                    <div className="ui-form-grid-3 mb-3">
                      <label className="ui-label">
                        Nome
                        <input
                          required
                          value={charForm.name}
                          onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                          placeholder="Nome del personaggio"
                        />
                      </label>
                      <label className="ui-label">
                        Classe
                        <select
                          value={charForm.class}
                          onChange={(e) => setCharForm({ ...charForm, class: e.target.value })}
                        >
                          {CLASSES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </label>
                      <label className="ui-label">
                        Razza
                        <select
                          value={charForm.race}
                          onChange={(e) => setCharForm({ ...charForm, race: e.target.value })}
                        >
                          {RACES.map((r) => <option key={r}>{r}</option>)}
                        </select>
                      </label>
                      <label className="ui-label">
                        Livello
                        <input
                          type="number" min="1" max="20"
                          value={charForm.level}
                          onChange={(e) => setCharForm({ ...charForm, level: e.target.value })}
                        />
                      </label>
                      <label className="ui-label">
                        HP Massimi
                        <input
                          type="number" min="1"
                          value={charForm.maxHp}
                          onChange={(e) => setCharForm({ ...charForm, maxHp: e.target.value })}
                        />
                      </label>
                      <label className="ui-label">
                        CA
                        <input
                          type="number" min="1"
                          value={charForm.ac}
                          onChange={(e) => setCharForm({ ...charForm, ac: e.target.value })}
                        />
                      </label>
                    </div>
                    <div className="ui-form-actions">
                      <AntiqueButton type="submit">
                        {editingChar ? 'Salva' : 'Aggiungi'}
                      </AntiqueButton>
                      <AntiqueButton
                        type="button" variant="ancient"
                        onClick={() => setShowCharForm(false)}
                      >
                        Annulla
                      </AntiqueButton>
                    </div>
                  </form>
                </AncientContainer>
              )}

              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {campaignChars.map((char) => (
                  <div key={char.id} className="char-card">
                    <div className="flex items-center justify-between">
                      <div className="char-name">{char.name}</div>
                      <div className="char-badge">Lv {char.level}</div>
                    </div>
                    <div className="char-sub">{char.class} · {char.race}</div>
                    <div className="char-stats">
                      <span>❤️ {char.maxHp} HP</span>
                      <span>🛡 {char.ac} CA</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <AntiqueButton
                        variant="primary" size="xs" className="flex-1"
                        onClick={() => handleAddToCombat(char)}
                      >
                        ⚔️ Combattimento
                      </AntiqueButton>
                      <AntiqueButton size="xs" variant="ghost" onClick={() => openEditChar(char)} title="Modifica">✏️</AntiqueButton>
                      <AntiqueButton size="xs" variant="danger" onClick={() => handleDeleteChar(char)} title="Elimina">🗑</AntiqueButton>
                    </div>
                  </div>
                ))}
                {campaignChars.length === 0 && !showCharForm && (
                  <div className="ui-empty">
                    Nessun personaggio. Clicca &quot;+ Nuovo PG&quot; per aggiungerne uno.
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
