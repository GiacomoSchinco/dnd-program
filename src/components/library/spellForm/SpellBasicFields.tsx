import { ChangeEvent } from 'react';
import { SpellSchools } from '../../../db/database';
import { Field, FieldRow } from '../../ui/FormModal';
import type { Spell } from '../../../types';

type SpellFormData = Omit<Spell, 'id'>;

interface SpellBasicFieldsProps {
  formData: SpellFormData;
  set: (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setNum: (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

/**
 * SpellBasicFields — nome, livello e scuola dell'incantesimo.
 */
export function SpellBasicFields({ formData, set, setNum }: SpellBasicFieldsProps) {
  return (
    <>
      <Field label="Nome" required>
        <input
          type="text"
          className="input input-bordered w-full"
          value={formData.name}
          onChange={set('name')}
          required
          autoFocus
        />
      </Field>

      <FieldRow>
        <Field label="Livello">
          <select
            className="select select-bordered w-full"
            value={formData.level}
            onChange={setNum('level')}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
              <option key={l} value={l}>
                {l === 0 ? 'Trucchetto' : `Livello ${l}`}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Scuola">
          <select
            className="select select-bordered w-full"
            value={formData.school}
            onChange={set('school')}
          >
            {Object.values(SpellSchools).map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </Field>
      </FieldRow>
    </>
  );
}
