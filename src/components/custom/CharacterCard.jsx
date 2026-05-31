import { Heart, Pencil, Trash2, Shield } from 'lucide-react';
import { DndIcon } from './DndIcon';

// Mappa classi in italiano
const getItalianClass = (className) => {
  const map = {
    'Guerriero': 'Guerriero', 'Warrior': 'Guerriero', 'Fighter': 'Guerriero',
    'Mago': 'Mago', 'Wizard': 'Mago',
    'Ladro': 'Ladro', 'Rogue': 'Ladro',
    'Chierico': 'Chierico', 'Cleric': 'Chierico',
    'Barbaro': 'Barbaro', 'Barbarian': 'Barbaro',
    'Paladino': 'Paladino', 'Paladin': 'Paladino',
    'Ranger': 'Ranger',
    'Stregone': 'Stregone', 'Sorcerer': 'Stregone',
    'Warlock': 'Warlock',
    'Bardo': 'Bardo', 'Bard': 'Bardo',
    'Druido': 'Druido', 'Druid': 'Druido',
    'Monaco': 'Monaco', 'Monk': 'Monaco',
  };
  return map[className] || className || '—';
};

// Colore classe → classe DaisyUI semantica (rispetta il cambio tema)
const getClassColor = (className) => {
  const map = {
    'Guerriero': 'text-error',     'Fighter': 'text-error',       // guerriero/rosso
    'Barbaro':   'text-error',     'Barbarian': 'text-error',
    'Mago':      'text-info',      'Wizard': 'text-info',          // arcano/blu
    'Stregone':  'text-accent',    'Sorcerer': 'text-accent',      // magia spontanea
    'Warlock':   'text-secondary', 'Bardo': 'text-secondary',      // oscuro/versatile
    'Bard':      'text-secondary',
    'Chierico':  'text-warning',   'Cleric': 'text-warning',       // sacro/oro
    'Paladino':  'text-warning',   'Paladin': 'text-warning',
    'Ranger':    'text-success',   'Druido': 'text-success',       // natura/verde
    'Druid':     'text-success',
    'Ladro':     'text-neutral-content', 'Rogue': 'text-neutral-content',
    'Monaco':    'text-primary',   'Monk': 'text-primary',
    'Artificere':'text-info',      'Artificer': 'text-info',
  };
  return map[className] ?? 'text-base-content/60';
};

const getClassIconName = (className) => {
  const map = {
    'Guerriero': 'fighter', 'Fighter': 'fighter',
    'Mago': 'wizard', 'Wizard': 'wizard',
    'Ladro': 'rogue', 'Rogue': 'rogue',
    'Chierico': 'cleric', 'Cleric': 'cleric',
    'Barbaro': 'barbarian', 'Barbarian': 'barbarian',
    'Paladino': 'paladin', 'Paladin': 'paladin',
    'Ranger': 'ranger',
    'Stregone': 'sorcerer', 'Sorcerer': 'sorcerer',
    'Warlock': 'warlock',
    'Bardo': 'bard', 'Bard': 'bard',
    'Druido': 'druid', 'Druid': 'druid',
    'Monaco': 'monk', 'Monk': 'monk',
    'Artificere': 'artificer', 'Artificer': 'artificer',
  };
  return map[className] ?? null;
};

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
  variant = 'character', // 'character' | 'participant'
}) {
  const hpPercent = currentHp != null && maxHp ? (currentHp / maxHp) * 100 : 100;
  let hpColor = 'progress-success';
  if (hpPercent < 25) hpColor = 'progress-error';
  else if (hpPercent < 50) hpColor = 'progress-warning';

  const currentHpValue = currentHp ?? maxHp ?? 0;
  const maxHpValue = maxHp ?? currentHp ?? 100;
  const tempHpValue = tempHp ?? 0;
  const classIconName = getClassIconName(characterClass);
  const classLabel = getItalianClass(characterClass);
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