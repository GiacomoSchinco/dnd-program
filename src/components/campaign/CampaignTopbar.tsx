import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDB } from '../../hooks/useDB';
import { useCampaignContext } from '../../context/CampaignContext';

export function CampaignTopbar() {
  const { campaigns, combats, activeCombat, loadCombat } = useDB();
  const { selectedCampaignId, setSelectedCampaignId } = useCampaignContext();
  const { pathname } = useLocation();
  const isOnCombat = pathname === '/combat';

  useEffect(() => {
    if (!campaigns?.length) return;

    const exists = campaigns.some((campaign) => campaign.id === selectedCampaignId);
    if (!exists) {
      setSelectedCampaignId(campaigns[0].id!);
    }
  }, [campaigns, selectedCampaignId, setSelectedCampaignId]);

  // Quando cambia la campagna selezionata, carica automaticamente
  // la battaglia più recente non terminata di quella campagna.
  useEffect(() => {
    if (selectedCampaignId == null) return;
    if (activeCombat?.campaignId === selectedCampaignId) return;

    const match = combats?.find(
      (c) => c.campaignId === selectedCampaignId && c.status !== 'terminated'
    );
    if (match) {
      loadCombat(match.id!);
    }
  }, [selectedCampaignId, activeCombat, combats, loadCombat]);

  return (
    <div className="sticky top-0 z-30 mb-4 rounded-2xl border border-base-300 bg-base-100/90 backdrop-blur px-3 py-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <span className="badge badge-primary badge-outline">Contesto</span>
          <span className="text-sm font-semibold">Campagna attiva</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm min-w-[220px]"
            value={selectedCampaignId ?? ''}
            onChange={(e) => setSelectedCampaignId(Number.parseInt(e.target.value, 10))}
            disabled={!campaigns?.length || isOnCombat}
            title={isOnCombat ? 'Non puoi cambiare campagna durante una battaglia' : undefined}
          >
            {!campaigns?.length && <option value="">Nessuna campagna</option>}
            {campaigns?.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
