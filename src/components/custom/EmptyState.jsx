/**
 * EmptyState — alert vuoto riutilizzabile per liste/griglie senza elementi.
 *
 * @param {string}  message   - testo da mostrare
 * @param {boolean} colSpan   - aggiunge col-span-full (utile dentro grid)
 * @param {string}  variant   - 'info' | 'neutral' (default 'neutral')
 */
export function EmptyState({ message, colSpan = false, variant = 'neutral' }) {
  const alertClass = variant === 'info' ? 'alert alert-info' : 'alert';
  return (
    <div className={colSpan ? 'col-span-full' : ''}>
      <div className={alertClass}>
        <span>{message}</span>
      </div>
    </div>
  );
}
