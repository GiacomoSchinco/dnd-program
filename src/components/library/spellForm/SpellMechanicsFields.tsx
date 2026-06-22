import { UseFormRegister } from 'react-hook-form';
import { Field, FieldRow } from '../../ui/FormModal';
import type { Spell } from '../../../types';

type SpellFormData = Omit<Spell, 'id'>;

interface SpellMechanicsFieldsProps {
  register: UseFormRegister<SpellFormData>;
}

/**
 * SpellMechanicsFields — danno, tiro salvezza, gittata, durata, tempo di lancio, potenziamento.
 */
export function SpellMechanicsFields({ register }: SpellMechanicsFieldsProps) {
  return (
    <>
      <FieldRow>
        <Field label="Danno" hint="es. 8d6">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('damage')}
            placeholder="es. 8d6 fuoco"
          />
        </Field>
        <Field label="Tiro Salvezza">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('save')}
            placeholder="es. Destrezza, Costituzione"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Gittata">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('range')}
            placeholder="es. 45 metri"
          />
        </Field>
        <Field label="Durata">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('duration')}
            placeholder="es. 1 ora"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Tempo di lancio">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('casting')}
            placeholder="es. 1 azione"
          />
        </Field>
        <Field label="Potenziamento">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('upgrade')}
            placeholder="es. +1d6 per slot"
          />
        </Field>
      </FieldRow>
    </>
  );
}
