import { ChangeEvent } from 'react';
import { Field, FieldRow } from '../../ui/FormModal';
import type { Spell } from '../../../types';

type SpellFormData = Omit<Spell, 'id'>;

interface SpellCastingFieldsProps {
  formData: SpellFormData;
  set: (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setCheck: (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * SpellCastingFields — componenti, materiale, concentrazione e rituale.
 */
export function SpellCastingFields({ formData, set, setCheck }: SpellCastingFieldsProps) {
  return (
    <>
      <FieldRow>
        <Field label="Componenti">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.components}
            onChange={set('components')}
            placeholder="es. V, S, M"
          />
        </Field>
        <Field label="Materiale">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.material}
            onChange={set('material')}
            placeholder="es. una piuma d'oca"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Concentrazione">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              checked={!!formData.concentration}
              onChange={setCheck('concentration')}
            />
            <span className="ml-2 text-sm">Richiede concentrazione</span>
          </div>
        </Field>
        <Field label="Rituale">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              className="checkbox checkbox-info"
              checked={!!formData.ritual}
              onChange={setCheck('ritual')}
            />
            <span className="ml-2 text-sm">Può essere lanciato come rituale</span>
          </div>
        </Field>
      </FieldRow>
    </>
  );
}
