import { UseFormRegister } from 'react-hook-form';
import { Field, FieldRow } from '../../ui/FormModal';
import type { Spell } from '../../../types';

type SpellFormData = Omit<Spell, 'id'>;

interface SpellCastingFieldsProps {
  register: UseFormRegister<SpellFormData>;
}

/**
 * SpellCastingFields — componenti, materiale, concentrazione e rituale.
 */
export function SpellCastingFields({ register }: SpellCastingFieldsProps) {
  return (
    <>
      <FieldRow>
        <Field label="Componenti">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('components')}
            placeholder="es. V, S, M"
          />
        </Field>
        <Field label="Materiale">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('material')}
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
              {...register('concentration')}
            />
            <span className="ml-2 text-sm">Richiede concentrazione</span>
          </div>
        </Field>
        <Field label="Rituale">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              className="checkbox checkbox-info"
              {...register('ritual')}
            />
            <span className="ml-2 text-sm">Può essere lanciato come rituale</span>
          </div>
        </Field>
      </FieldRow>
    </>
  );
}
