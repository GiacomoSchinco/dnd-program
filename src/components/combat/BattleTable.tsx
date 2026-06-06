import { Swords, Trash2 } from 'lucide-react';
import { DataTable } from '../ui';
import type { Combat } from '../../types';

interface BattleTableProps {
  combats: Combat[];
  onLoad: (combatId: number) => void;
  onDelete: (combatId: number, e: React.MouseEvent<HTMLButtonElement>) => void;
  emptyMessage?: string;
}

/**
 * BattleTable — DataTable condivisa per l'elenco battaglie.
 * Usata sia in CombatHubPage che in CombatHubBattlesPage.
 */
export function BattleTable({ combats, onLoad, onDelete, emptyMessage }: BattleTableProps) {
  return (
    <DataTable<Combat>
      initialData={combats}
      visibleColumns={['name', 'date', 'status', 'participants', 'round', 'actions']}
      labels={{
        name: 'Battaglia',
        date: 'Data',
        status: 'Stato',
        participants: 'Partecipanti',
        round: 'Round',
        actions: 'Azioni',
      }}
      customRenderers={{
        date: (value) => (
          <span className="text-sm">
            {value ? new Date(value).toLocaleString('it-IT') : '-'}
          </span>
        ),
        status: (value) => (
          <span className={`badge ${value === 'terminated' ? 'badge-error' : 'badge-success'}`}>
            {value === 'terminated' ? 'Conclusa' : 'In corso'}
          </span>
        ),
        participants: (value) => <span>{Array.isArray(value) ? value.length : 0}</span>,
        round: (value) => <span>{value ?? 1}</span>,
        actions: (_, row) => (
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-xs btn-primary gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onLoad(row.id!);
              }}
            >
              <Swords size={12} /> Riprendi
            </button>
            <button
              className="btn btn-xs btn-error gap-1"
              onClick={(e) => onDelete(row.id!, e)}
            >
              <Trash2 size={12} /> Elimina
            </button>
          </div>
        ),
      }}
      onRowClick={(id) => onLoad(id as number)}
      emptyMessage={emptyMessage ?? 'Nessuna battaglia trovata.'}
      pagination
      itemsPerPage={10}
    />
  );
}
