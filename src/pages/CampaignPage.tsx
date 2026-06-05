import { CampaignPanel } from '../components/campaign';
import { PageWrapper } from '../components/ui';

export function CampaignPage() {
  return (
    <PageWrapper>
      <div>
        <h1 className="text-3xl font-bold">Gestione Campagne</h1>
        <p className="text-base-content/60">
          Crea, modifica, elimina e imposta la campagna attiva da questa pagina dedicata.
        </p>
      </div>

      <CampaignPanel title="Campagne" />
    </PageWrapper>
  );
}
