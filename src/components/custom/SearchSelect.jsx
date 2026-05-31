import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Combobox con autocomplete riutilizzabile.
 *
 * Props:
 *   placeholder  string          Testo placeholder
 *   options      [{value, label, sublabel?}]
 *   onSelect     (value) => void  Chiamato al click su un'opzione
 *   disabled?    boolean
 *   buttonClassName?  string     Classi extra per il bottone trigger
 *   buttonContent    ReactNode   Contenuto del bottone trigger
 *   emptyText?   string          Testo se non ci sono opzioni
 *   extraActions?  ReactNode     Voci extra in fondo alla lista (es. "Crea nuovo...")
 */
export function SearchSelect({
  placeholder = 'Cerca...',
  options = [],
  onSelect,
  disabled = false,
  buttonClassName = 'btn btn-sm',
  buttonContent,
  emptyText = 'Nessun risultato',
  extraActions,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Chiudi cliccando fuori
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input quando si apre
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={buttonClassName}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
      >
        {buttonContent}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-[9999] w-64 bg-base-200 rounded-box shadow-2xl border border-base-content/10 flex flex-col overflow-hidden">
          {/* Campo ricerca */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-base-content/10">
            <Search size={14} className="text-base-content/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              className="bg-transparent outline-none text-sm flex-1 placeholder:text-base-content/40"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setOpen(false); setQuery(''); }
                if (e.key === 'Enter' && filtered.length === 1) handleSelect(filtered[0].value);
              }}
            />
            {query && (
              <button
                type="button"
                className="text-base-content/40 hover:text-base-content"
                onClick={() => setQuery('')}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Lista risultati */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && !extraActions && (
              <p className="text-xs text-base-content/50 px-3 py-2">{emptyText}</p>
            )}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-base-300 transition-colors flex flex-col"
                onClick={() => handleSelect(o.value)}
              >
                <span className="text-sm font-medium">{o.label}</span>
                {o.sublabel && (
                  <span className="text-xs text-base-content/50">{o.sublabel}</span>
                )}
              </button>
            ))}
          </div>

          {/* Azioni extra (es. "Crea nuovo...") */}
          {extraActions && (
            <div className="border-t border-base-content/10">
              {extraActions}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
