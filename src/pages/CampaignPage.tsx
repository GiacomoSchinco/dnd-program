import { useState } from 'react';
import { CampaignPanel } from '../components/campaign';
import { PageWrapper, PageHeader } from '../components/ui';
import { BookOpen, Plus } from 'lucide-react';

export function CampaignPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <PageWrapper>
      <PageHeader
        icon={<BookOpen size={28} />}
        title="Gestione Campagne"
        subtitle="Crea, modifica, elimina e imposta la campagna attiva da questa pagina dedicata."
        actions={
          <button className="btn btn-primary gap-1" onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Nuova Campagna
          </button>
        }
      />
      <CampaignPanel showCreate={showCreate} onCloseCreate={() => setShowCreate(false)} />
    </PageWrapper>
  );
}
