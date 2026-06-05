import { useDB } from '../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCampaignContext } from '../context/CampaignContext';
import { Swords, Plus, BookOpen, Skull, Sparkles, Users, BarChart3, ScrollText } from 'lucide-react';
import { DndIcon } from '../components/ui/DndIcon';
import { PageWrapper } from '../components/ui';

export function HomePage() {
  const navigate = useNavigate();
  const { activeCombat, campaigns, combatHistory, loadCombat } = useDB();
  const { setSelectedCampaignId } = useCampaignContext();

  const activeCampaign = activeCombat?.campaignId
    ? campaigns?.find((campaign) => campaign.id === activeCombat.campaignId)
    : null;

  const recentCombats = combatHistory?.slice(0, 3) || [];
  const hasActiveCombat = activeCombat && activeCombat.participants?.length > 0;

  const handleResumeCombat = () => {
    if (activeCombat?.id) {
      navigate(`/combat/${activeCombat.id}`);
    } else {
      navigate('/combat-hub');
    }
  };

  const handleNewCombat = () => {
    navigate('/combat-hub');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        navigate('/combat-hub');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if ((activeCombat?.participants?.length ?? 0) > 0) {
          activeCombat?.id ? navigate(`/combat/${activeCombat.id}`) : navigate('/combat-hub');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, activeCombat]);

  // Titolo finestra dinamico (Electron)
  useEffect(() => {
    document.title = activeCombat
      ? `Combattimento - Castle Keeper`
      : 'Castle Keeper — Your D&D Adventure Hub';
  }, [activeCombat]);

  return (
    <PageWrapper>
      {/* Hero Section - Più compatta e orientata all'azione */}
      <div className="hero rounded-box bg-gradient-to-r from-primary/30 to-secondary/30 p-6">
        <div className="hero-content text-center p-4">
          <div className="max-w-lg">
            <DndIcon name="logo" size={56} className="text-primary mb-3" />
            <h1 className="text-4xl font-bold">Castle Keeper</h1>
            <p className="py-4 text-base-content/70">
              Your D&D Adventure Hub
            </p>
            
            {/* Azione principale ben visibile */}
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {hasActiveCombat ? (
                <button 
                  className="btn btn-primary btn-lg gap-2"
                  onClick={handleResumeCombat}
                >
                  <Swords size={20} />
                  Riprendi Combattimento
                  <span className="badge badge-secondary badge-sm ml-2">
                    {activeCombat.participants.length}
                  </span>
                </button>
              ) : (
                <button 
                  className="btn btn-primary btn-lg gap-2"
                  onClick={handleNewCombat}
                >
                  <Plus size={20} />
                  Nuovo Combattimento
                </button>
              )}
              
              <button 
                className="btn btn-outline btn-lg gap-2"
                onClick={() => navigate('/campaigns')}
              >
                <BookOpen size={20} />
                Gestisci Campagne
              </button>
              <button 
                className="btn btn-outline btn-lg gap-2"
                onClick={() => navigate('/combat-hub')}
              >
                <Swords size={20} />
                Hub Combattimento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stato Combattimento Attivo - Card evidenziata */}
      {hasActiveCombat && (
        <div className="alert alert-success shadow-lg">
            <span className="flex items-center gap-3">
              <Swords size={24} />
              <div>
                <h3 className="font-bold">Combattimento in corso</h3>
                <p className="text-sm">
                  {activeCampaign?.name && `Campagna: ${activeCampaign.name} · `}
                  {activeCombat.participants.length} partecipanti · Round {activeCombat.round || 1}
                </p>
              </div>
            </span>
          <div className="flex-none">
            <button 
              className="btn btn-sm btn-success"
              onClick={handleResumeCombat}
            >
              Riprendi
            </button>
          </div>
        </div>
      )}

      {/* Statistiche - Ridotte a 2 card più informative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Campagna */}
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-base-content/60 text-sm">Campagna Attiva</div>
                <div className="stat-value text-primary text-2xl mt-1">
                  {activeCampaign?.name || 'Nessuna campagna'}
                </div>
                {activeCampaign?.description && (
                  <div className="stat-desc text-sm mt-1 line-clamp-1">
                    {activeCampaign.description}
                  </div>
                )}
              </div>
              <BookOpen size={36} className="opacity-50" />
            </div>
            {!activeCampaign && (
              <div className="mt-3">
                <button 
                  className="btn btn-xs btn-outline"
                  onClick={() => navigate('/campaigns')}
                >
                  Crea campagna
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card Statistiche */}
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-base-content/60 text-sm">Statistiche</div>
                <div className="flex gap-6 mt-2">
                  <div>
                    <div className="stat-value text-secondary text-xl">
                      {combatHistory?.length || 0}
                    </div>
                    <div className="stat-desc text-xs">Combattimenti</div>
                  </div>
                  <div>
                    <div className="stat-value text-accent text-xl">
                      {activeCombat?.participants?.length || 0}
                    </div>
                    <div className="stat-desc text-xs">In campo</div>
                  </div>
                  <div>
                    <div className="stat-value text-info text-xl">
                      {campaigns?.length || 0}
                    </div>
                    <div className="stat-desc text-xs">Campagne</div>
                  </div>
                </div>
              </div>
              <BarChart3 size={36} className="opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Combattimenti Recenti - Solo se esistono */}
      {recentCombats.length > 0 && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title text-lg flex items-center gap-1"><ScrollText size={16} /> Combattimenti recenti</h2>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/combat')}
              >
                Vedi tutti →
              </button>
            </div>
            <div className="space-y-2">
              {recentCombats.map((combat) => (
                <div 
                  key={combat.id}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
                  onClick={async () => {
                    if (combat.campaignId != null) setSelectedCampaignId(combat.campaignId);
                    await loadCombat(combat.id!);
                    navigate('/combat');
                  }}
                >
                  <div>
                    <span className="font-medium">{combat.name}</span>
                    <p className="text-xs text-base-content/50">
                      {new Date(combat.date).toLocaleDateString('it-IT')}
                      {combat.participants && ` · ${combat.participants.length} partecipanti`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge badge-sm ${
                      combat.status === 'terminated' ? 'badge-error' : 'badge-success'
                    }`}>
                      {combat.status === 'terminated' ? 'Concluso' : 'In corso'}
                    </span>
                    <button className="btn btn-xs btn-ghost">Riprendi →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scorciatoie tastiera */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center text-xs text-base-content/40 pt-2">
        <span><kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">N</kbd> Nuovo combattimento</span>
        <span><kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Shift</kbd> + <kbd className="kbd kbd-xs">R</kbd> Riprendi combattimento</span>
      </div>

      {/* Azioni rapide */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button 
          className="btn btn-outline btn-sm gap-1"
          onClick={() => navigate('/monsters')}
        >
          <Skull size={14} /> Libreria Mostri
        </button>
        <button 
          className="btn btn-outline btn-sm gap-1"
          onClick={() => navigate('/spells')}
        >
          <Sparkles size={14} /> Grimorio
        </button>
        <button 
          className="btn btn-outline btn-sm gap-1"
          onClick={() => navigate('/party')}
        >
          <Users size={14} /> Party
        </button>
      </div>
    </PageWrapper>
  );
}