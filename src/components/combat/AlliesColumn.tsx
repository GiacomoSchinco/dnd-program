import { Shield, Plus, User, Pencil } from 'lucide-react';
import { SearchSelect } from '../ui';
import { ParticipantList } from './ParticipantList';
import type { Character, Npc, CombatParticipant } from '../../types';

interface AlliesColumnProps {
  participants: CombatParticipant[];
  campaignCharacters: Character[];
  npcLibrary: Npc[];
  currentTurnIndex: number;
  currentParticipantId: string | null;
  isTerminated: boolean;
  onAddPG: (id: string) => void;
  onAddNpcFromLibrary: (id: string) => void;
  onOpenCreateNpc: () => void;
  applyDamage: (id: string, damage: number) => void;
  heal: (id: string, heal: number) => void;
  removeParticipant: (id: string) => void;
  updateParticipantInitiative: (id: string, initiative: number) => Promise<void>;
  showToast: (msg: string) => void;
}

export function AlliesColumn({
  participants,
  campaignCharacters,
  npcLibrary,
  currentTurnIndex,
  currentParticipantId,
  isTerminated,
  onAddPG,
  onAddNpcFromLibrary,
  onOpenCreateNpc,
  applyDamage,
  heal,
  removeParticipant,
  updateParticipantInitiative,
  showToast,
}: AlliesColumnProps) {
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-success flex items-center gap-1">
          <Shield size={16} /> Alleati ({participants.length})
        </h2>
        <div className="flex gap-2">
          <SearchSelect
            placeholder="Cerca personaggio..."
            disabled={isTerminated}
            buttonClassName="btn btn-sm btn-success gap-1"
            buttonContent={<><Plus size={14} /> PG</>}
            emptyText="Nessun PG nella campagna"
            options={campaignCharacters.map((c) => ({
              value: String(c.id),
              label: c.name,
              sublabel: `HP ${c.currentHp ?? c.maxHp}/${c.maxHp} · CA ${c.ac ?? 10}`,
            }))}
            onSelect={(id) => onAddPG(String(id))}
          />
          <SearchSelect
            placeholder="Cerca NPC..."
            disabled={isTerminated}
            buttonClassName="btn btn-sm btn-info gap-1"
            buttonContent={<><User size={14} /> NPC</>}
            emptyText="Nessun NPC in libreria"
            options={npcLibrary.map((n) => ({
              value: String(n.id),
              label: n.name,
              sublabel: `HP ${n.hp} · CA ${n.ac}`,
            }))}
            onSelect={(id) => onAddNpcFromLibrary(String(id))}
            extraActions={
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-base-300 transition-colors flex items-center gap-2 text-info font-semibold text-sm"
                onClick={onOpenCreateNpc}
              >
                <Pencil size={13} /> Crea nuovo NPC...
              </button>
            }
          />
        </div>
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
