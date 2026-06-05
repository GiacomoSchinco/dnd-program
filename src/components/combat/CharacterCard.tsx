import { Pencil, Trash2, Shield } from 'lucide-react';
import { DndIcon } from '../ui/DndIcon';
import { HPBar } from '../ui/HPBar';
import { QuickHealthActions } from '../ui/QuickHealthActions';
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
            <HPBar current={currentHpValue} max={maxHpValue} size="xs" showLabel={false} />
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
          <HPBar current={currentHpValue} max={maxHpValue} temp={tempHpValue} size="sm" />
        )}

        {/* Pulsanti cura/danno */}
        {onHeal && onDamage && (
          <QuickHealthActions onDamage={onDamage} onHeal={onHeal} variant="card" />
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