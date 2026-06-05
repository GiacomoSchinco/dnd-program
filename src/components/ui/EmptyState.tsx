import { ReactNode } from 'react';

interface EmptyStateProps {
  message: string;
  colSpan?: boolean;
  variant?: 'info' | 'neutral';
  children?: ReactNode;
}

/**
 * EmptyState — alert vuoto riutilizzabile per liste/griglie senza elementi.
 *
 * @param message - testo da mostrare
 * @param colSpan - aggiunge col-span-full (utile dentro grid)
 * @param variant - 'info' | 'neutral' (default 'neutral')
 * @param children - elementi aggiuntivi sotto il messaggio (opzionale)
 */
export function EmptyState({ message, colSpan = false, variant = 'neutral', children }: EmptyStateProps) {
  const alertClass = variant === 'info' ? 'alert alert-info' : 'alert';
  return (
    <div className={colSpan ? 'col-span-full' : ''}>
      <div className={`${alertClass} flex-col`}>
        <span>{message}</span>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
