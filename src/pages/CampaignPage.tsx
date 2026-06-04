import { CampaignCrudPanel } from '../components/campaign';

export function CampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestione Campagne</h1>
        <p className="text-base-content/60">
          Crea, modifica, elimina e imposta la campagna attiva da questa pagina dedicata.
        </p>
      </div>

      <CampaignCrudPanel title="Campagne" />
    </div>
  );
}
