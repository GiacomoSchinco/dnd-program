import { ReactNode } from 'react';
import { SearchInput } from './SearchInput';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
}

/**
 * FilterBar — barra di ricerca e filtri con layout consistente.
 * Va posizionata tra PageHeader e ContentSection.
 */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Cerca...',
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="form-control">
        <label className="label text-sm">Cerca</label>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
      {children}
    </div>
  );
}
