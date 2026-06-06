import { ChangeEvent } from 'react';
import { Field, FieldRow } from '../../ui/FormModal';
import type { Spell } from '../../../types';

type SpellFormData = Omit<Spell, 'id'>;

interface SpellMechanicsFieldsProps {
  formData: SpellFormData;
  set: (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

/**
 * SpellMechanicsFields — danno, cura, gittata, durata, tempo di lancio, tiro salvezza.
 */
export function SpellMechanicsFields({ formData, set }: SpellMechanicsFieldsProps) {
  return (
    <>
      <FieldRow>
        <Field label="Danno" hint="es. 8d6">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.damage}
            onChange={set('damage')}
            placeholder="es. 8d6"
          />
        </Field>
        <Field label="Cura" hint="es. 2d8+mod">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.healing}
            onChange={set('healing')}
            placeholder="es. 2d8+mod"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Gittata">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.range}
            onChange={set('range')}
            placeholder="es. 120 ft"
          />
        </Field>
        <Field label="Durata">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.duration}
            onChange={set('duration')}
            placeholder="es. 1 ora"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Tempo di lancio">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.castingTime}
            onChange={set('castingTime')}
            placeholder="es. 1 azione, 1 azione bonus"
          />
        </Field>
        <Field label="Tiro Salvezza">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.saveType}
            onChange={set('saveType')}
            placeholder="es. Destrezza, Costituzione"
          />
        </Field>
      </FieldRow>
    </>
  );
}
