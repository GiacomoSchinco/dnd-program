import { Plus, Skull } from 'lucide-react';
import { SearchSelect } from '../ui';
import { ParticipantList } from './ParticipantList';
import type { Monster, CombatParticipant } from '../../types';

interface MonstersColumnProps {
  participants: CombatParticipant[];
  monsterLibrary: Monster[];
  currentTurnIndex: number;
  currentParticipantId: string | null;
  isTerminated: boolean;
  onAddMonster: (id: string) => void;
  applyDamage: (id: string, damage: number) => void;
  heal: (id: string, heal: number) => void;
  removeParticipant: (id: string) => void;
  updateParticipantInitiative: (id: string, initiative: number) => Promise<void>;
  showToast: (msg: string) => void;
}

export function MonstersColumn({
  participants,
  monsterLibrary,
  currentTurnIndex,
  currentParticipantId,
  isTerminated,
  onAddMonster,
  applyDamage,
  heal,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
}: MonstersColumnProps) {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-error flex items-center gap-1">
          <Skull size={16} /> Mostri ({participants.length})
        </h2>
        <SearchSelect
          placeholder="Cerca mostro..."
          disabled={isTerminated}
          buttonClassName="btn btn-sm btn-error gap-1"
          buttonContent={<><Plus size={14} /> Aggiungi Mostro</>}
          emptyText="Nessun mostro in libreria"
          options={monsterLibrary.map((m) => ({
            value: String(m.id),
            label: m.name,
            sublabel: `HP ${m.hp} · CA ${m.ac} · CR ${m.cr}`,
          }))}
          onSelect={(id) => onAddMonster(String(id))}
        />
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <ParticipantList
          participants={participants}
          currentTurnIndex={currentTurnIndex}
          currentParticipantId={currentParticipantId}
          applyDamage={applyDamage}
          heal={heal}
          removeParticipant={removeParticipant}
          updateParticipantInitiative={updateParticipantInitiative}
          showToast={showToast}
          isTerminated={isTerminated}
        />
      </div>
    </div>
  );
}
