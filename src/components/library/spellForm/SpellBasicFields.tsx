import { useCallback } from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Field, FieldRow } from '../../ui/FormModal';
import { getClassName } from '../../../utils/icons';
import type { Spell } from '../../../types';

// Scuole: valore salvato (inglese) → label mostrata (italiano)
const SCHOOL_LABELS: Record<string, string> = {
  Abjuration: 'Abiurazione',
  Conjuration: 'Invocazione',
  Divination: 'Divinazione',
  Enchantment: 'Ammaestramento',
  Evocation: 'Evocazione',
  Illusion: 'Illusione',
  Necromancy: 'Necromanzia',
  Transmutation: 'Trasmutazione',
};

type SpellFormData = Omit<Spell, 'id'>;

interface SpellBasicFieldsProps {
  register: UseFormRegister<SpellFormData>;
  watch: UseFormWatch<SpellFormData>;
  setValue: UseFormSetValue<SpellFormData>;
}

// Classi disponibili in inglese (storage) → italiano (display via getClassName)
const CLASS_OPTIONS = [
  'Artificer', 'Barbarian', 'Bard', 'Cleric', 'Druid',
  'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue',
  'Sorcerer', 'Warlock', 'Wizard',
];

/**
 * SpellBasicFields — nome, livello, scuola e classi dell'incantesimo.
 */
export function SpellBasicFields({ register, watch, setValue }: SpellBasicFieldsProps) {
  const classesString = watch('classes');
  const selectedValues = classesString
    ? classesString.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const toggleClass = useCallback((cls: string) => {
    const current = new Set(selectedValues);
    if (current.has(cls)) {
      current.delete(cls);
    } else {
      current.add(cls);
    }
    setValue('classes', Array.from(current).join(', '));
  }, [selectedValues, setValue]);

  return (
    <>
      <Field label="Nome" required>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register('name', { required: true })}
          autoFocus
        />
      </Field>

      <FieldRow>
        <Field label="Livello">
          <select
            className="select select-bordered w-full"
            {...register('level', { valueAsNumber: true })}
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
            {...register('school')}
          >
            {Object.entries(SCHOOL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </FieldRow>

      <Field label="Classi">
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {CLASS_OPTIONS.map((cls) => {
            const isSelected = selectedValues.includes(cls);
            return (
              <button
                key={cls}
                type="button"
                onClick={() => toggleClass(cls)}
                className={`badge badge-sm gap-1 cursor-pointer transition-all ${
                  isSelected ? 'badge-primary' : 'badge-ghost'
                }`}
              >
                {getClassName(cls)}
                {isSelected && <span className="text-xs">✕</span>}
              </button>
            );
          })}
        </div>
      </Field>
    </>
  );
}
