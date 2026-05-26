import { useState, useEffect } from 'react'
import { AncientScroll } from '../custom/AncientScroll'

export function ParticipantCard({
  participant,
  isCurrentTurn,
  applyDamage,
  heal,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
}) {
  const { id, name, type, currentHp, maxHp, ac, initiative, damage } = participant

  const [customDamage, setCustomDamage] = useState('')
  const [initiativeVal, setInitiativeVal] = useState(String(initiative ?? 0))

  // Sync initiative input when DB value changes
  useEffect(() => {
    setInitiativeVal(String(initiative ?? 0))
  }, [initiative])

  const hpPercent = maxHp > 0 ? Math.round((currentHp / maxHp) * 100) : 0

  const hpBarClass =
    hpPercent > 50
      ? 'hp-good'
      : hpPercent > 25
      ? 'hp-warning'
      : 'hp-danger'

  const handleQuickAction = async (amount) => {
    if (amount > 0) {
      await applyDamage(id, amount)
      showToast(`${name}: −${amount} HP`)
    } else {
      await heal(id, Math.abs(amount))
      showToast(`${name}: +${Math.abs(amount)} HP`)
    }
  }

  const handleCustomApply = async () => {
    const val = parseInt(customDamage, 10)
    if (isNaN(val) || val === 0) return
    if (val > 0) {
      await applyDamage(id, val)
      showToast(`${name}: −${val} HP`)
    } else {
      await heal(id, Math.abs(val))
      showToast(`${name}: +${Math.abs(val)} HP`)
    }
    setCustomDamage('')
  }

  const handleInitiativeBlur = async () => {
    await updateParticipantInitiative(id, initiativeVal)
  }

  const cardClass = [
    'participant-card',
    type === 'pc' ? 'pc-card' : 'monster-card',
    isCurrentTurn ? 'active-turn' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const cardContent = (
    <>
      {/* ── Header ── */}
      <div className="card-header">
        <div className="card-name-group">
          <span
            className={`type-badge ${
              type === 'pc' ? 'pc-badge' : 'monster-badge'
            }`}
          >
            {type === 'pc' ? 'PG' : 'M'}
          </span>
          <span className="card-name">{name}</span>
          {isCurrentTurn && (
            <span className="turn-tag">◄ TURNO</span>
          )}
        </div>

        <div className="card-stats">
          <span className="stat-chip">CA {ac}</span>
          <div className="initiative-group">
            <label className="init-label">Init</label>
            <input
              type="number"
              className="initiative-input"
              value={initiativeVal}
              onChange={(e) => setInitiativeVal(e.target.value)}
              onBlur={handleInitiativeBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleInitiativeBlur()}
            />
          </div>
        </div>

        <button
          className="remove-btn"
          onClick={() => removeParticipant(id)}
          title="Rimuovi dal combattimento"
        >
          ✕
        </button>
      </div>

      {/* ── HP ── */}
      <div className="hp-section">
        <div className="hp-text-row">
          <span className="hp-text">
            {currentHp} / {maxHp} HP
          </span>
          <span className="hp-percent">{hpPercent}%</span>
        </div>
        <div className="hp-bar-track">
          <div
            className={`hp-bar-fill ${hpBarClass}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {damage && <div className="damage-info">⚔ {damage}</div>}

      {/* ── Actions ── */}
      <div className="card-actions">
        <div className="quick-btns">
          {[10, 5, 1].map((v) => (
            <button
              key={`d-${v}`}
              className="dmg-btn"
              onClick={() => handleQuickAction(v)}
            >
              −{v}
            </button>
          ))}
          {[1, 5].map((v) => (
            <button
              key={`h-${v}`}
              className="heal-btn"
              onClick={() => handleQuickAction(-v)}
            >
              +{v}
            </button>
          ))}
        </div>

        <div className="custom-row">
          <input
            type="number"
            className="custom-input"
            placeholder="Danno (neg = cura)"
            value={customDamage}
            onChange={(e) => setCustomDamage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomApply()}
          />
          <button className="apply-btn" onClick={handleCustomApply}>
            Applica
          </button>
        </div>
      </div>
    </>
  )

  return (
    <AncientScroll
      className={cardClass}
      variant="rolled"
      texture={false}
      watermark={false}
    >
      {cardContent}
    </AncientScroll>
  )
}
