import { useCombat } from './useCombat';
import { useCampaigns } from './useCampaigns';
import { useLibrary } from './useLibrary';

export function useDB() {
  const combat = useCombat();
  const campaigns = useCampaigns();
  const library = useLibrary();

  return {
    ...combat,
    ...campaigns,
    ...library,
  };
}
