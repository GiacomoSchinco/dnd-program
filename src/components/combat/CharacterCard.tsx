import { Heart, Pencil, Trash2, Shield, Plus, Minus } from 'lucide-react';
import { DndIcon } from '../ui/DndIcon';
import { getClassIcon, getClassColor, getClassName } from '../../utils/icons';

interface CharacterCardProps {
  name: string;
  race?: string;
  characterClass?: string;
  level?: number;
  ac?: number;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  onHeal?: (amount: number) => void;
  onDamage?: (amount: number) => void;
  variant?: 'character' | 'participant';
}

export function CharacterCard({
  name,
  race,
  characterClass,
  level,
  ac,
  currentHp,
  maxHp,
  tempHp = 0,
  onEdit,
  onDelete,
  onClick,
  onHeal,
  onDamage,
  variant = 'character', // 'character' | 'participant'
}: CharacterCardProps) {
  const hpPercent = currentHp != null && maxHp ? (currentHp / maxHp) * 100 : 100;
  let hpColor = 'progress-success';
  if (hpPercent < 25) hpColor = 'progress-error';
  else if (hpPercent < 50) hpColor = 'progress-warning';

  const currentHpValue = currentHp ?? maxHp ?? 0;
  const maxHpValue = maxHp ?? currentHp ?? 100;
  const tempHpValue = tempHp ?? 0;
    const classIconName = getClassIcon(characterClass);
  const classLabel = getClassName(characterClass);
  const classColor = getClassColor(characterClass);

  const ClassIconEl = classIconName
    ? <DndIcon name={classIconName} size={28} className={classColor} />
    : <span className={`font-bold text-base ${classColor}`}>{classLabel?.[0] ?? '?'}</span>;

  // Versione compatta per liste partecipanti
  if (variant === 'participant') {
    return (
      <div
        className="card card-side bg-base-100 shadow-md hover:shadow-lg transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-center px-4 bg-base-200 rounded-l-2xl">
          {ClassIconEl}
        </div>
        <div className="card-body p-3 gap-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold leading-tight">{name}</h3>
              <p className="text-xs text-base-content/60">{classLabel} · Liv {level}</p>
            </div>
            {currentHp !== undefined && (
              <span className="text-sm font-bold tabular-nums">
                {currentHpValue}<span className="text-base-content/40 font-normal">/{maxHpValue}</span>
              </span>
            )}
          </div>
          {currentHp !== undefined && (
            <progress className={`progress ${hpColor} w-full h-1.5`} value={currentHpValue} max={maxHpValue} />
          )}
        </div>
      </div>
    );
  }

  // Versione character (per PartyPage)
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body p-4 gap-3">

        {/* Header: emoji + nome + livello */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-base-200 rounded-xl shrink-0">
            {ClassIconEl}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-lg leading-tight truncate">{name}</h2>
              <span className="badge badge-primary shrink-0">Liv {level}</span>
            </div>
            <p className="text-sm text-base-content/60 truncate">
              {race || '—'} · {classLabel}
            </p>
          </div>
        </div>

        {/* HP bar */}
        {maxHp != null && (
          <div>
            <div className="flex justify-between text-xs text-base-content/60 mb-1">
              <span className="flex items-center gap-1"><Heart size={12} /> HP</span>
              <span className="font-semibold text-base-content">
                {currentHpValue} / {maxHpValue}
                {tempHpValue > 0 && <span className="text-info ml-1">+{tempHpValue}</span>}
              </span>
            </div>
            <progress className={`progress ${hpColor} w-full h-2`} value={currentHpValue} max={maxHpValue} />
          </div>
        )}

        {/* Pulsanti cura/danno */}
        {onHeal && onDamage && (
          <div className="flex items-stretch gap-3 pt-1">
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-error/70 uppercase tracking-wider">Danno</span>
              <div className="flex gap-1">
                <button className="btn btn-xs btn-soft btn-error min-w-0 px-1.5" onClick={() => onDamage(10)} title="Danno 10">-10</button>
                <button className="btn btn-xs btn-soft btn-error min-w-0 px-1.5" onClick={() => onDamage(5)} title="Danno 5">-5</button>
                <button className="btn btn-xs btn-soft btn-error min-w-0 px-1.5" onClick={() => onDamage(1)} title="Danno 1">-1</button>
              </div>
            </div>
            <div className="flex items-center justify-center w-px bg-base-300/50 self-stretch" />
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-success/70 uppercase tracking-wider">Cura</span>
              <div className="flex gap-1">
                <button className="btn btn-xs btn-soft btn-success min-w-0 px-1.5" onClick={() => onHeal(1)} title="Cura 1">+1</button>
                <button className="btn btn-xs btn-soft btn-success min-w-0 px-1.5" onClick={() => onHeal(5)} title="Cura 5">+5</button>
                <button className="btn btn-xs btn-soft btn-success min-w-0 px-1.5" onClick={() => onHeal(10)} title="Cura 10">+10</button>
              </div>
            </div>
          </div>
        )}

        {/* CA */}
        {ac != null && (
          <div className="flex items-center gap-1 text-sm">
            <span className="flex items-center gap-1 text-base-content/50"><Shield size={12} /> CA</span>
            <span className="font-bold">{ac}</span>
          </div>
        )}

        {/* Azioni */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-base-200">
            {onEdit && (
              <button className="btn btn-sm btn-ghost flex-1 gap-1" onClick={onEdit}>
                <Pencil size={14} /> Modifica
              </button>
            )}
            {onDelete && (
              <button className="btn btn-sm btn-ghost btn-error flex-1 gap-1" onClick={onDelete}>
                <Trash2 size={14} /> Elimina
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}