import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FormModal, Field } from '../ui/FormModal';
import { SpellBasicFields } from './spellForm/SpellBasicFields';
import { SpellMechanicsFields } from './spellForm/SpellMechanicsFields';
import { SpellCastingFields } from './spellForm/SpellCastingFields';
import type { Spell } from '../../types';

type SpellFormData = Omit<Spell, 'id'>;
const EMPTY: SpellFormData = {
  name: '',
  level: 1,
  school: 'Evocazione',
  damage: '',
  healing: '',
  range: '',
  duration: '',
  castingTime: '',
  components: '',
  material: '',
  concentration: false,
  ritual: false,
  saveType: '',
  effect: '',
};

interface SpellFormModalProps {
  isOpen: boolean;
  editingSpell?: Spell | null;
  onClose: () => void;
  onSubmit: (data: SpellFormData, original?: Spell | null) => void;
}

export function SpellFormModal({ isOpen, editingSpell, onClose, onSubmit }: SpellFormModalProps) {
  const [formData, setFormData] = useState<SpellFormData>(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingSpell ?? EMPTY);
  }, [isOpen, editingSpell]);

  const set = (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) }));

  const setCheck = (field: keyof SpellFormData) => (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData, editingSpell);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={editingSpell ? 'Modifica Incantesimo' : 'Nuovo Incantesimo'}
      confirmText={editingSpell ? 'Aggiorna' : 'Crea'}
      wide
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <SpellBasicFields formData={formData} set={set} setNum={setNum} />
      <SpellMechanicsFields formData={formData} set={set} />
      <SpellCastingFields formData={formData} set={set} setCheck={setCheck} />

      <Field label="Descrizione">
        <textarea
          className="textarea textarea-bordered w-full"
          rows={4}
          value={formData.effect}
          onChange={set('effect')}
          placeholder="Descrizione completa dell'effetto dell'incantesimo..."
        />
      </Field>
    </FormModal>
  );
}
