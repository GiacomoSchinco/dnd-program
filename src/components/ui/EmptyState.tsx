interface EmptyStateProps {
  message: string;
  colSpan?: boolean;
  variant?: 'info' | 'neutral';
}

/**
 * EmptyState — alert vuoto riutilizzabile per liste/griglie senza elementi.
 *
 * @param message - testo da mostrare
 * @param colSpan - aggiunge col-span-full (utile dentro grid)
 * @param variant - 'info' | 'neutral' (default 'neutral')
 */
export function EmptyState({ message, colSpan = false, variant = 'neutral' }: EmptyStateProps) {
  const alertClass = variant === 'info' ? 'alert alert-info' : 'alert';
  return (
    <div className={colSpan ? 'col-span-full' : ''}>
      <div className={alertClass}>
        <span>{message}</span>
      </div>
    </div>
  );
}
