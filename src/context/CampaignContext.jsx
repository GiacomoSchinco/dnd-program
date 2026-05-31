import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'activeCampaignId';

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [selectedCampaignId, setSelectedCampaignIdState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored == null || stored === '') return null;
    const parsed = Number.parseInt(stored, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });

  const setSelectedCampaignId = (value) => {
    const normalized = value == null ? null : Number(value);
    if (normalized == null || Number.isNaN(normalized)) {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedCampaignIdState(null);
      return;
    }
    localStorage.setItem(STORAGE_KEY, String(normalized));
    setSelectedCampaignIdState(normalized);
  };

  const contextValue = useMemo(
    () => ({
      selectedCampaignId,
      setSelectedCampaignId,
    }),
    [selectedCampaignId],
  );

  return <CampaignContext.Provider value={contextValue}>{children}</CampaignContext.Provider>;
}

export function useCampaignContext() {
  const ctx = useContext(CampaignContext);
  if (!ctx) {
    throw new Error('useCampaignContext must be used inside CampaignProvider');
  }
  return ctx;
}
