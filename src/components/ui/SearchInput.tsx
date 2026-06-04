import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Campo di ricerca con icona a sinistra.
 *
 * Props:
 *  value        string    Valore corrente
 *  onChange     fn        Callback chiamata con il nuovo valore stringa (non l'evento)
 *  placeholder  string    Testo placeholder (default "Cerca...")
 *  className    string    Classi aggiuntive per l'<input> (default "w-52")
 */
export function SearchInput({ value, onChange, placeholder = 'Cerca...', className = 'w-52' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
      />
      <input
        type="text"
        className={`input input-bordered input-sm pl-9 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
