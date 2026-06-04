import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

const STORAGE_KEY = 'activeCampaignId';

interface CampaignContextType {
  selectedCampaignId: number | null;
  setSelectedCampaignId: (value: number | string | null) => void;
}

const CampaignContext = createContext<CampaignContextType | null>(null);

interface CampaignProviderProps {
  children: ReactNode;
}

export function CampaignProvider({ children }: CampaignProviderProps) {
  const [selectedCampaignId, setSelectedCampaignIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored == null || stored === '') return null;
    const parsed = Number.parseInt(stored, 10);
    return Number.isNaN(parsed) ? null : parsed;
  });

  const setSelectedCampaignId = useCallback((value: number | string | null) => {
    const normalized = value == null ? null : Number(value);
    if (normalized == null || Number.isNaN(normalized)) {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedCampaignIdState(null);
      return;
    }
    localStorage.setItem(STORAGE_KEY, String(normalized));
    setSelectedCampaignIdState(normalized);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedCampaignId,
      setSelectedCampaignId,
    }),
    [selectedCampaignId, setSelectedCampaignId],
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
