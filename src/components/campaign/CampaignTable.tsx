import { useMemo, useCallback } from 'react';
import { DataTable } from '../../components/ui';
import { Pencil, Trash2 } from 'lucide-react';
import { Campaign } from '../../types';

interface CampaignTableProps {
  campaigns: Campaign[];
  selectedCampaignId: number | null;
  compact?: boolean;
  disabled?: boolean;
  onSelect: (id: number | null) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  selectedCampaignId,
  compact = false,
  disabled = false,
  onSelect,
  onEdit,
  onDelete,
}: CampaignTableProps) {
  const sortedCampaigns = useMemo(() => {
    return [...(campaigns ?? [])].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [campaigns]);

  const handleRowClick = useCallback(
    (id: unknown) => {
      const numericId = id != null ? Number(id) : null;
      onSelect(numericId);
    },
    [onSelect],
  );

  return (
    <DataTable
      initialData={sortedCampaigns}
      visibleColumns={['name', 'description', 'createdAt', 'active', 'actions']}
      labels={{
        name: 'Nome',
        description: 'Descrizione',
        createdAt: 'Creata il',
        active: 'Stato',
        actions: 'Azioni',
      }}
      customRenderers={{
        createdAt: (value) => (
          <span className="text-sm">{value ? new Date(value).toLocaleDateString('it-IT') : '-'}</span>
        ),
        description: (value) => (
          <span className="text-sm text-base-content/80">{value || '-'}</span>
        ),
        active: (_, row) =>
          row?.id === selectedCampaignId ? (
            <span className="badge badge-primary badge-sm">Attiva</span>
          ) : (
            <span className="badge badge-ghost badge-sm">Inattiva</span>
          ),
        actions: (_, row) => (
          <div className="flex gap-1 justify-end">
            <button
              className="btn btn-xs btn-primary gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              disabled={disabled}
            >
              <Pencil size={12} /> Modifica
            </button>
            <button
              className="btn btn-xs btn-error gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
              disabled={disabled}
            >
              <Trash2 size={12} /> Elimina
            </button>
          </div>
        ),
      }}
      onRowClick={(id) => handleRowClick(id)}
      emptyMessage="Nessuna campagna disponibile."
      pagination
      itemsPerPage={compact ? 5 : 10}
    />
  );
}
