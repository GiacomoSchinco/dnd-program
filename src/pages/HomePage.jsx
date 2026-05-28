import { Link } from 'react-router-dom'

const quickLinks = [
  {
    to: '/combat',
    emoji: '⚔️',
    title: 'Combattimento',
    description: 'Apri battaglie, gestisci iniziativa, danni e turni senza perdere ritmo.',
    accent: 'war',
  },
  {
    to: '/party',
    emoji: '📚',
    title: 'Campagne',
    description: 'Organizza gruppi, personaggi, HP correnti e preparazione delle sessioni.',
    accent: 'campaign',
  },
  {
    to: '/monsters',
    emoji: '🐉',
    title: 'Mostri',
    description: 'Consulta la libreria, modifica creature e inseriscile negli scontri al volo.',
    accent: 'monster',
  },
  {
    to: '/spells',
    emoji: '✨',
    title: 'Magie',
    description: 'Trova in fretta incantesimi, dettagli utili e riferimenti per il tavolo.',
    accent: 'spell',
  },
]

const overviewItems = [
  {
    label: 'Flusso ordinato',
    value: 'Campagna → Battaglia → Dettaglio',
  },
  {
    label: 'Uso al tavolo',
    value: 'Più rapido, meno schermate confuse',
  },
  {
    label: 'Stato attuale',
    value: 'Pronto per campagne, mostri e combattimenti',
  },
]

const workflowSteps = [
  'Scegli una campagna e prepara la battaglia dalla tabella.',
  'Apri il dettaglio per aggiungere PG, NPC e mostri in un’unica vista.',
  'Salva lo stato dello scontro e tieni sincronizzati gli HP del party.',
]

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">D&D Combat Tracker</p>
          <h1 className="home-title">Una plancia di regia, non una home provvisoria</h1>
          <p className="home-subtitle">
            Tutto quello che ti serve per condurre la sessione in modo pulito:
            campagne, battaglie, mostri, magie e gestione rapida del tavolo.
          </p>
          <div className="home-hero-actions">
            <Link className="home-primary-cta" to="/combat">
              Apri gestione combattimenti
            </Link>
            <Link className="home-secondary-cta" to="/party">
              Vai alle campagne
            </Link>
          </div>
        </div>

        <aside className="home-overview-card">
          <p className="home-overview-label">Panoramica rapida</p>
          <div className="home-overview-list">
            {overviewItems.map((item) => (
              <div className="home-overview-item" key={item.label}>
                <span className="home-overview-item-label">{item.label}</span>
                <strong className="home-overview-item-value">{item.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </header>

      <section className="home-layout">
        <div className="home-main-column">
          <section className="home-quick-links">
            <div className="home-section-heading">
              <p className="home-section-kicker">Accessi rapidi</p>
              <h2 className="home-section-title">Le aree che userai davvero</h2>
            </div>

            <div className="home-grid">
              {quickLinks.map((section) => (
                <Link
                  className={`home-card home-card-${section.accent}`}
                  key={section.to}
                  to={section.to}
                >
                  <div className="home-card-topline">
                    <span className="home-emoji" aria-hidden="true">
                      {section.emoji}
                    </span>
                    <span className="home-card-pill">Apri sezione</span>
                  </div>
                  <h2 className="home-card-title">{section.title}</h2>
                  <p className="home-card-description">{section.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="home-side-column">
          <section className="home-workflow-panel">
            <p className="home-section-kicker">Workflow</p>
            <h2 className="home-section-title">Come usarlo bene</h2>
            <div className="home-workflow-steps">
              {workflowSteps.map((step, index) => (
                <div className="home-workflow-step" key={step}>
                  <span className="home-workflow-index">0{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="home-focus-panel">
            <p className="home-section-kicker">Focus</p>
            <h2 className="home-section-title">Obiettivo della sessione</h2>
            <p className="home-focus-copy">
              Tenere pulita la gestione del tavolo: meno click inutili, nomi chiari,
              battaglie collegate alle campagne e dettaglio separato quando serve.
            </p>
            <Link className="home-inline-link" to="/combat">
              Vai subito alla tabella battaglie
            </Link>
          </section>
        </aside>
      </section>
    </div>
  )
}
