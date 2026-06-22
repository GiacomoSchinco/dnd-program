import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormModal, Field } from '../ui/FormModal';
import { SpellBasicFields } from './spellForm/SpellBasicFields';
import { SpellMechanicsFields } from './spellForm/SpellMechanicsFields';
import { SpellCastingFields } from './spellForm/SpellCastingFields';
import type { Spell } from '../../types';

type SpellFormData = Omit<Spell, 'id'>;
const EMPTY: SpellFormData = {
  name: '',
  level: 1,
  school: 'Evocation',
  classes: '',
  casting: '',
  damage: '',
  range: '',
  duration: '',
  components: '',
  material: '',
  concentration: false,
  ritual: false,
  save: '',
  upgrade: '',
  description: '',
};

interface SpellFormModalProps {
  isOpen: boolean;
  editingSpell?: Spell | null;
  onClose: () => void;
  onSubmit: (data: SpellFormData, original?: Spell | null) => void;
}

export function SpellFormModal({ isOpen, editingSpell, onClose, onSubmit }: SpellFormModalProps) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<SpellFormData>({
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (isOpen) reset(editingSpell ?? EMPTY);
  }, [isOpen, editingSpell, reset]);

  const onFormSubmit = (data: SpellFormData) => {
    onSubmit(data, editingSpell);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={editingSpell ? 'Modifica Incantesimo' : 'Nuovo Incantesimo'}
      confirmText={editingSpell ? 'Aggiorna' : 'Crea'}
      wide
      onClose={onClose}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <SpellBasicFields register={register} watch={watch} setValue={setValue} />
      <SpellMechanicsFields register={register} />
      <SpellCastingFields register={register} />

      <Field label="Descrizione">
        <textarea
          className="textarea textarea-bordered w-full"
          rows={4}
          {...register('description')}
          placeholder="Descrizione completa ed estesa dell'incantesimo..."
        />
      </Field>
    </FormModal>
  );
}
