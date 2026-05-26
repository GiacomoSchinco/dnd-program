import { Link } from 'react-router-dom'

const sections = [
  {
    to: '/combat',
    emoji: '⚔️',
    title: 'Combattimento',
    description: 'Avvia e gestisci turni, iniziativa e log delle azioni.',
  },
  {
    to: '/party',
    emoji: '👥',
    title: 'Gruppo',
    description: 'Crea i personaggi e tieni d\'occhio statistiche e inventario.',
  },
  {
    to: '/monsters',
    emoji: '🐉',
    title: 'Mostri',
    description: 'Consulta la libreria dei mostri e prepara gli scontri.',
  },
  {
    to: '/spells',
    emoji: '✨',
    title: 'Magie',
    description: 'Cerca rapidamente incantesimi e dettagli utili al tavolo.',
  },
]

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <p className="home-kicker">D&D Combat Tracker</p>
        <h1 className="home-title">La tua schermata di comando</h1>
        <p className="home-subtitle">
          Apri subito la sezione che ti serve e tieni la sessione fluida dal
          primo round all\'ultimo tiro di dado.
        </p>
        <Link className="home-primary-cta" to="/combat">
          Inizia un combattimento
        </Link>
      </header>

      <section className="home-grid">
        {sections.map((section) => (
          <Link className="home-card" key={section.to} to={section.to}>
            <span className="home-emoji" aria-hidden="true">
              {section.emoji}
            </span>
            <h2 className="home-card-title">{section.title}</h2>
            <p className="home-card-description">{section.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
