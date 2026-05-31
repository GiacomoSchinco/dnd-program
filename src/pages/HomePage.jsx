import { useCombatDB } from '../hooks/useCombatDB';
import { CampaignCrudPanel } from '../components/custom/CampaignCrudPanel';

export function HomePage() {
  const { activeCombat, campaigns, combatHistory } = useCombatDB();

  const activeCampaign = activeCombat?.campaignId
    ? campaigns?.find((campaign) => campaign.id === activeCombat.campaignId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="hero rounded-box bg-gradient-to-r from-primary/20 to-secondary/20 p-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">🎲 D&D Combat Tracker</h1>
            <p className="py-6 text-base-content/70">
              Gestisci combattimenti, traccia HP, salva campagne e molto altro
            </p>
            <a href="/campaigns" className="btn btn-primary btn-lg">
              Apri Hub Combattimento ⚔️
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-primary">
            <span className="text-3xl">📚</span>
          </div>
          <div className="stat-title">Campagna Attiva</div>
          <div className="stat-value text-primary">
            {activeCampaign?.name || 'Nessuna'}
          </div>
          <div className="stat-desc">
            {activeCampaign?.description || 'Crea una nuova campagna'}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <span className="text-3xl">⚔️</span>
          </div>
          <div className="stat-title">Combattimento Attivo</div>
          <div className="stat-value text-secondary">
            {activeCombat ? 'Sì' : 'No'}
          </div>
          <div className="stat-desc">
            {activeCombat?.participants?.length || 0} partecipanti
          </div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-figure text-accent">
            <span className="text-3xl">📜</span>
          </div>
          <div className="stat-title">Storico</div>
          <div className="stat-value text-accent">
            {combatHistory?.length || 0}
          </div>
          <div className="stat-desc">combattimenti salvati</div>
        </div>
      </div>

      <CampaignCrudPanel title="Campagne (CRUD rapido)" compact />
    </div>
  );
}