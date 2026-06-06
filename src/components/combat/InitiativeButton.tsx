import { Swords } from 'lucide-react';

interface InitiativeButtonProps {
  round: number;
  onOpen: () => void;
}

/**
 * InitiativeButton — versione minimizzata del pannello iniziativa.
 * Mostra solo un pulsante con l'icona e il round corrente.
 */
export function InitiativeButton({ round, onOpen }: InitiativeButtonProps) {
  return (
    <div
      className="select-none cursor-pointer"
      onClick={onOpen}
    >
      <button
        className="btn btn-primary btn-circle shadow-xl text-lg pointer-events-none"
        title={`Apri iniziativa — Round ${round}`}
      >
        <Swords size={16} />
      </button>
      <span className="badge badge-primary badge-xs absolute -top-1 -right-1 pointer-events-none">
        {round}
      </span>
    </div>
  );
}
