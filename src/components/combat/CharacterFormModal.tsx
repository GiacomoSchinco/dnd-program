import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { CharacterClasses, CharacterRaces } from '../../db/database';
import { FormModal, Field, FieldRow } from '../ui/FormModal';
import type { Character } from '../../types';

export type CharFormData = Pick<Character, 'name' | 'class' | 'race' | 'level' | 'hp' | 'ac'>;
const EMPTY: CharFormData = { name: '', class: '', level: 1, race: '', hp: 10, ac: 10 };

interface CharacterFormModalProps {
  isOpen: boolean;
  editingChar?: Character | null;
  onClose: () => void;
  onSubmit: (data: CharFormData) => void;
}

export function CharacterFormModal({ isOpen, editingChar, onClose, onSubmit }: CharacterFormModalProps) {
  const [formData, setFormData] = useState<CharFormData>(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingChar ?? EMPTY);
  }, [isOpen, editingChar]);

  const set = (field: keyof CharFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field: keyof CharFormData, fallback = 1) => (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || fallback }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={editingChar ? 'Modifica Personaggio' : 'Nuovo Personaggio'}
      confirmText={editingChar ? 'Aggiorna' : 'Crea'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Nome" required>
        <input type="text" className="input input-bordered w-full"
          value={formData.name} onChange={set('name')} required autoFocus />
      </Field>

      <FieldRow>
        <Field label="Classe" required>
          <select className="select select-bordered w-full" value={formData.class} onChange={set('class')} required>
            <option value="">Seleziona...</option>
            {Object.values(CharacterClasses).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Livello">
          <input type="number" min="1" max="20" className="input input-bordered w-full"
            value={formData.level} onChange={setNum('level')} />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Razza">
          <select className="select select-bordered w-full" value={formData.race} onChange={set('race')}>
            <option value="">Seleziona razza...</option>
            {CharacterRaces.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="CA">
          <input type="number" min="1" className="input input-bordered w-full"
            value={formData.ac} onChange={setNum('ac')} />
        </Field>
      </FieldRow>

      <Field label="HP Massimi">
        <input type="number" min="1" className="input input-bordered w-full"
          value={formData.hp} onChange={setNum('hp')} />
      </Field>
    </FormModal>
  );
}
