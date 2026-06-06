import { ReactNode } from 'react';
import { ScrollText } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  colSpan?: boolean;
  /** @deprecated Usa sempre lo stesso stile */
  variant?: never;
  children?: ReactNode;
}

/**
 * EmptyState — messaggio unificato per dati assenti.
 * Stesso stile in TUTTE le pagine.
 */
export function EmptyState({ message, colSpan = false, children }: EmptyStateProps) {
  return (
    <div className={colSpan ? 'col-span-full' : ''}>
      <div className="flex flex-col items-center gap-3 py-12 text-center rounded-box border border-base-300 bg-base-100">
        <ScrollText size={40} className="opacity-30" />
        <p className="text-base-content/70 text-lg">{message}</p>
        {children && <div className="mt-1">{children}</div>}
      </div>
    </div>
  );
}
