interface QuickHealthActionsProps {
  onDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  /**
   * 'card'  → layout a due colonne con etichette Danno/Cura (usato in CharacterCard)
   * 'row'   → bottoni in riga piatta senza etichette (usato in ParticipantActions)
   */
  variant?: 'card' | 'row';
}

const AMOUNTS = [1, 5, 10] as const;

export function QuickHealthActions({
  onDamage,
  onHeal,
  variant = 'row',
}: QuickHealthActionsProps) {
  if (variant === 'card') {
    return (
      <div className="flex items-stretch gap-3 pt-1">
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-error/70 uppercase tracking-wider">Danno</span>
          <div className="flex gap-1">
            {[...AMOUNTS].reverse().map((n) => (
              <button
                key={n}
                className="btn btn-xs btn-soft btn-error min-w-0 px-1.5"
                onClick={() => onDamage(n)}
                title={`Danno ${n}`}
              >
                -{n}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center w-px bg-base-300/50 self-stretch" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-success/70 uppercase tracking-wider">Cura</span>
          <div className="flex gap-1">
            {AMOUNTS.map((n) => (
              <button
                key={n}
                className="btn btn-xs btn-soft btn-success min-w-0 px-1.5"
                onClick={() => onHeal(n)}
                title={`Cura ${n}`}
              >
                +{n}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // variant === 'row'
  return (
    <div className="flex flex-wrap gap-2">
      {[...AMOUNTS].reverse().map((n) => (
        <button
          key={`dmg-${n}`}
          className="btn btn-error btn-sm"
          onClick={() => onDamage(n)}
        >
          -{n}
        </button>
      ))}
      {AMOUNTS.map((n) => (
        <button
          key={`heal-${n}`}
          className="btn btn-success btn-sm"
          onClick={() => onHeal(n)}
        >
          +{n}
        </button>
      ))}
    </div>
  );
}
