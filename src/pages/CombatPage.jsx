import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCombatDB } from '../hooks/useCombatDB'
import { Toast } from '../components/Toast/Toast'
import { AntiqueButton } from '../components/custom/AntiqueButton'
import DataTable from '../components/custom/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'

export function CombatPage() {
  const navigate = useNavigate()
  const combatDB = useCombatDB()
  const [toast, setToast] = useState('')
  const [selectedCampaignId, setSelectedCampaignId] = useState(null)
  const [showPrepareModal, setShowPrepareModal] = useState(false)
  const [newCombatName, setNewCombatName] = useState('')

  const showToast = useCallback((msg) => setToast(msg), [])
  const hideToast = useCallback(() => setToast(''), [])

  const campaigns = combatDB.campaigns ?? []
  const allCombats = combatDB.combats ?? []

  useEffect(() => {
    if (selectedCampaignId != null) return
    if (!campaigns.length) return
    setSelectedCampaignId(campaigns[0].id)
  }, [campaigns, selectedCampaignId])

  const campaignCombats = useMemo(
    () => allCombats.filter((c) => c.campaignId === selectedCampaignId),
    [allCombats, selectedCampaignId],
  )

  const combatTableRows = useMemo(
    () => campaignCombats.map((combat) => {
      const baseStatus = combat.status ?? 'prepared'
      return {
        ...combat,
        participantsCount: combat.participants?.length ?? 0,
        displayStatus: baseStatus === 'completed' ? 'Svolta' : 'Preparata',
      }
    }),
    [campaignCombats],
  )

  const openPrepareCombatModal = () => {
    if (selectedCampaignId == null) {
      showToast('Seleziona prima una campagna')
      return
    }
    setNewCombatName('')
    setShowPrepareModal(true)
  }

  const handleCreateCombat = async () => {
    if (selectedCampaignId == null) {
      showToast('Seleziona prima una campagna')
      return
    }

    const name = newCombatName.trim()
    if (!name) {
      showToast('Inserisci un nome battaglia')
      return
    }

    const combatId = await combatDB.createCombatForCampaign(selectedCampaignId, name)
    setShowPrepareModal(false)
    setNewCombatName('')
    showToast('Battaglia creata e pronta')
    if (combatId) {
      navigate(`/combat/${combatId}`)
    }
  }

  const handleSelectCombat = (combatId) => {
    if (!combatId) return
    navigate(`/combat/${Number(combatId)}`)
  }

  return (
    <div className="page-layout">
      <header className="page-header">
        <h1 className="page-title">⚔️ Combattimento</h1>
        <div className="combat-header-actions">
          <AntiqueButton variant="primary" onClick={openPrepareCombatModal}>
            🛠️ Prepara Battaglia
          </AntiqueButton>
        </div>
      </header>

      <div className="combat-setup-bar">
        <label className="combat-setup-field">
          Campagna
          <select
            value={selectedCampaignId ?? ''}
            onChange={(e) => {
              const val = e.target.value
              setSelectedCampaignId(val ? Number(val) : null)
            }}
          >
            {!campaigns.length && <option value="">Nessuna campagna</option>}
            {campaigns.map((camp) => (
              <option key={camp.id} value={camp.id}>{camp.name}</option>
            ))}
          </select>
        </label>
      </div>

      <section className="combat-table-section" aria-label="Tabella combattimenti">
        <div className="combat-table-section-header">
          <div>
            <h2 className="combat-table-title">Battaglie della campagna</h2>
            <p className="combat-table-subtitle">
              Seleziona una battaglia per aprire il dettaglio completo qui sotto.
            </p>
          </div>
          <span className="combat-table-count">{combatTableRows.length}</span>
        </div>

        <DataTable
          initialData={combatTableRows}
          idKey="id"
          columns={[
            { key: 'name', label: 'Battaglia' },
            {
              key: 'displayStatus',
              label: 'Stato',
              render: (value) => {
                const statusClass =
                  value === 'Attiva'
                    ? 'active'
                    : value === 'Svolta'
                      ? 'completed'
                      : 'prepared'
                return (
                  <span className={`combat-status-badge ${statusClass}`}>
                    {String(value)}
                  </span>
                )
              },
            },
            {
              key: 'participantsCount',
              label: 'Partecipanti',
              render: (value) => `${value} totali`,
            },
            {
              key: 'round',
              label: 'Round',
              render: (value) => `Round ${value ?? 1}`,
            },
            {
              key: 'date',
              label: 'Aggiornata',
              render: (value) => new Date(value).toLocaleString('it-IT'),
            },
          ]}
          onRowClick={(combatId) => handleSelectCombat(combatId)}
          emptyMessage="Nessuna battaglia preparata o svolta per questa campagna"
          className="combat-table"
        />
      </section>

      <section className="combat-detail-empty" aria-label="Apri battaglia">
        <h2 className="combat-detail-title">Apri una battaglia dalla tabella</h2>
        <p className="combat-table-subtitle">
          Entrerai in una pagina dedicata, con dettaglio completo del combattimento e gestione mostri.
        </p>
      </section>

      <Dialog
        open={showPrepareModal}
        onOpenChange={(open) => {
          setShowPrepareModal(open)
          if (!open) setNewCombatName('')
        }}
      >
        <DialogContent className="max-w-lg bg-parchment-100 border-2 border-amber-900/30">
          <DialogHeader>
            <DialogTitle className="fantasy-title">Prepara Battaglia</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-amber-900/80">
              Crea una nuova battaglia per la campagna selezionata.
            </p>
            <label className="ui-label">
              Nome battaglia
              <input
                value={newCombatName}
                onChange={(e) => setNewCombatName(e.target.value)}
                placeholder="Es. Assalto alla Torre, Agguato nel Bosco, Cripta del Re"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCombat()}
                autoFocus
              />
            </label>
          </div>

          <div className="ui-form-actions mt-4">
            <AntiqueButton variant="primary" onClick={handleCreateCombat}>
              Crea Battaglia
            </AntiqueButton>
            <AntiqueButton
              variant="ancient"
              onClick={() => {
                setShowPrepareModal(false)
                setNewCombatName('')
              }}
            >
              Annulla
            </AntiqueButton>
          </div>
        </DialogContent>
      </Dialog>

      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
