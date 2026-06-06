import { User, Skull } from 'lucide-react';
import type { CombatParticipant } from '../../types';

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  pc: <User size={14} />,
  player: <User size={14} />,
  npc: <User size={14} />,
  monster: <Skull size={14} />,
};

interface InitiativeParticipantRowProps {
  participant: CombatParticipant & { _origIdx: number };
  isActive: boolean;
  currentTurnIndex: number;
  round: number;
}

/**
 * InitiativeParticipantRow — riga partecipante nel pannello iniziativa espanso.
 */
export function InitiativeParticipantRow({
  participant: p,
  isActive,
  currentTurnIndex,
  round,
}: InitiativeParticipantRowProps) {
  const turnsCompleted = p._origIdx < currentTurnIndex ? round : round - 1;
  const hpPct = p.maxHp > 0 ? Math.max(0, Math.min(100, (p.currentHp / p.maxHp) * 100)) : 0;
  const hpClass = hpPct > 60 ? 'progress-success' : hpPct > 30 ? 'progress-warning' : 'progress-error';
  const isDead = p.currentHp <= 0;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
        ${isActive ? 'bg-primary/20 ring-1 ring-primary' : isDead ? 'opacity-40' : 'hover:bg-base-200'}
      `}
    >
      {/* Freccia turno attivo */}
      <span className="w-3 shrink-0 text-xs text-primary font-bold">
        {isActive ? '▶' : ''}
      </span>

      {/* Badge iniziativa */}
      <span className="badge badge-sm font-mono tabular-nums w-10 shrink-0 justify-center">
        {p.initiative ?? 0}
      </span>

      {/* Icona tipo */}
      <span className="flex items-center shrink-0">{TYPE_ICON_MAP[p.type] ?? <User size={14} />}</span>

      {/* Nome */}
      <span className={`flex-1 text-sm truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
        {p.name}
      </span>

      {/* HP */}
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        <span className="text-xs text-base-content/60 tabular-nums leading-none">
          {p.currentHp}/{p.maxHp}
        </span>
        <progress
          className={`progress ${hpClass} w-14 h-1.5`}
          value={hpPct}
          max={100}
        />
      </div>

      {/* Turni completati */}
      <span
        className="badge badge-ghost badge-sm shrink-0 tabular-nums"
        title="Turni completati"
      >
        {turnsCompleted}t
      </span>
    </div>
  );
}
