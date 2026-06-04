/**
 * FilterSelect — campo select con label, usato nelle barre di filtro.
 *
 * @param {string}    label     - etichetta sopra il select
 * @param {*}         value     - valore corrente
 * @param {Function}  onChange  - handler onChange (riceve l'evento)
 * @param {ReactNode} children  - opzioni <option>
 */
import { ReactNode, ChangeEvent } from 'react';

interface FilterSelectProps {
  label: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

export function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  return (
    <div className="form-control">
      <label className="label text-sm">{label}</label>
      <select
        className="select select-bordered select-sm"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </div>
  );
}
