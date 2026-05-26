import { useState, useMemo, useCallback } from 'react'
import { useSpellsDB } from '../hooks/useSpellsDB'
import { Toast } from '../components/Toast/Toast'
import { AntiqueButton } from '../components/custom/AntiqueButton'
import AncientContainer from '../components/custom/AncientContainer'

const SCHOOLS = [
  'Abiurazione', 'Ammaliamento', 'Divinazione', 'Evocazione',
  'Illusione', 'Invocazione', 'Necromanzia', 'Trasmutazione',
]

const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const emptySpell = {
  name: '', level: 1, school: 'Evocazione',
  castingTime: '1 azione', range: '18 metri',
  components: 'V, S', duration: 'Istantaneo', description: '',
}

const levelLabel = (l) => (l === 0 ? 'Trucco' : `Livello ${l}`)

const schoolColors = {
  Abiurazione: '#60a5fa',
  Ammaliamento: '#f472b6',
  Divinazione: '#a78bfa',
  Evocazione: '#fb923c',
  Illusione: '#34d399',
  Invocazione: '#fbbf24',
  Necromanzia: '#94a3b8',
  Trasmutazione: '#4ade80',
}

export function SpellsPage() {
  const { spells, addSpell, updateSpell, deleteSpell } = useSpellsDB()

  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterSchool, setFilterSchool] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingSpell, setEditingSpell] = useState(null)
  const [form, setForm] = useState(emptySpell)

  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!spells) return []
    return spells.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchLevel = filterLevel === 'all' || s.level === Number(filterLevel)
      const matchSchool = filterSchool === 'all' || s.school === filterSchool
      return matchSearch && matchLevel && matchSchool
    })
  }, [spells, search, filterLevel, filterSchool])

  // ── Form handlers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingSpell(null)
    setForm({ ...emptySpell })
    setShowForm(true)
  }

  const openEdit = (spell) => {
    setEditingSpell(spell)
    setForm({ ...spell })
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = { ...form, level: Number(form.level) }
    if (editingSpell) {
      await updateSpell(editingSpell.id, data)
      showToast(`${data.name} aggiornato`)
    } else {
      await addSpell(data)
      showToast(`${data.name} aggiunto`)
    }
    setShowForm(false)
  }

  const handleDelete = async (spell) => {
    if (!window.confirm(`Eliminare "${spell.name}"?`)) return
    await deleteSpell(spell.id)
    showToast(`${spell.name} eliminato`)
  }

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1 className="page-title">✨ Magie</h1>
        <AntiqueButton onClick={openAdd} size="sm">+ Nuova Magia</AntiqueButton>
      </header>

      <div className="page-main">
        {/* ── Filtri ── */}
        <div className="filter-bar">
          <input
            className="flex-1 min-w-[180px]"
            placeholder="🔍 Cerca per nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">Tutti i livelli</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{levelLabel(l)}</option>
            ))}
          </select>
          <select
            value={filterSchool}
            onChange={(e) => setFilterSchool(e.target.value)}
          >
            <option value="all">Tutte le scuole</option>
            {SCHOOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="filter-count">
            {filtered.length} {filtered.length === 1 ? 'magia' : 'magie'}
          </span>
        </div>

        {/* ── Form aggiunta/modifica ── */}
        {showForm && (
          <AncientContainer
            title={editingSpell ? 'Modifica Magia' : 'Nuova Magia'}
            showDecorations={false}
            contentClassName="p-4"
            className="mb-4"
          >
            <form onSubmit={handleSave}>
              <div className="ui-form-grid mb-3">
                <label className="ui-label">
                  Nome *
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome dell'incantesimo"
                  />
                </label>
                <label className="ui-label">
                  Livello
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{levelLabel(l)}</option>
                    ))}
                  </select>
                </label>
                <label className="ui-label">
                  Scuola
                  <select
                    value={form.school}
                    onChange={(e) => setForm({ ...form, school: e.target.value })}
                  >
                    {SCHOOLS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="ui-label">
                  Tempo di lancio
                  <input
                    value={form.castingTime}
                    onChange={(e) => setForm({ ...form, castingTime: e.target.value })}
                  />
                </label>
                <label className="ui-label">
                  Gittata
                  <input
                    value={form.range}
                    onChange={(e) => setForm({ ...form, range: e.target.value })}
                  />
                </label>
                <label className="ui-label">
                  Componenti
                  <input
                    value={form.components}
                    onChange={(e) => setForm({ ...form, components: e.target.value })}
                  />
                </label>
                <label className="ui-label">
                  Durata
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  />
                </label>
              </div>
              <label className="ui-label mb-3">
                Descrizione
                <textarea
                  className="resize-y min-h-[80px] font-[inherit]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrizione dell'incantesimo…"
                />
              </label>
              <div className="ui-form-actions">
                <AntiqueButton type="submit">
                  {editingSpell ? 'Salva' : 'Aggiungi'}
                </AntiqueButton>
                <AntiqueButton type="button" variant="ancient" onClick={() => setShowForm(false)}>
                  Annulla
                </AntiqueButton>
              </div>
            </form>
          </AncientContainer>
        )}

        {/* ── Lista magie ── */}
        <div className="flex flex-col gap-2">
          {filtered.map((spell) => (
            <div key={spell.id} className="spell-card">
              <div
                className="spell-card-header"
                onClick={() => setExpandedId(expandedId === spell.id ? null : spell.id)}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: (schoolColors[spell.school] ?? '#92400e') + '22',
                      color: schoolColors[spell.school] ?? '#92400e',
                    }}
                  >
                    {spell.school}
                  </span>
                  <span className="spell-level-badge">{levelLabel(spell.level)}</span>
                  <span className="spell-card-name">{spell.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <AntiqueButton
                    size="xs" variant="ghost"
                    onClick={(e) => { e.stopPropagation(); openEdit(spell) }}
                    title="Modifica"
                  >✏️</AntiqueButton>
                  <AntiqueButton
                    size="xs" variant="danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(spell) }}
                    title="Elimina"
                  >🗑</AntiqueButton>
                  <span className="text-amber-700 text-xs ml-1">
                    {expandedId === spell.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {expandedId === spell.id && (
                <div className="spell-card-body">
                  <div className="spell-stats-row">
                    <span>⏱ {spell.castingTime}</span>
                    <span>📐 {spell.range}</span>
                    <span>🔤 {spell.components}</span>
                    <span>⌛ {spell.duration}</span>
                  </div>
                  {spell.description && (
                    <p className="spell-desc">{spell.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="ui-empty">Nessuna magia trovata.</div>
          )}
        </div>
      </div>

      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
