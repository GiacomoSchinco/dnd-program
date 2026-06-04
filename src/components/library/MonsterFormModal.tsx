import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FormModal, Field, FieldRow } from '../ui/FormModal';
import type { Monster } from '../../types';

type MonsterFormData = Pick<Monster, 'name' | 'hp' | 'ac' | 'damage' | 'cr' | 'type' | 'description'>;
const EMPTY: MonsterFormData = { name: '', hp: 10, ac: 10, damage: '1d6', cr: '1/4', type: 'humanoid', description: '' };

interface MonsterFormModalProps {
  isOpen: boolean;
  editingMonster?: Monster | null;
  onClose: () => void;
  onSubmit: (data: MonsterFormData) => void;
}

export function MonsterFormModal({ isOpen, editingMonster, onClose, onSubmit }: MonsterFormModalProps) {
  const [formData, setFormData] = useState<MonsterFormData>(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingMonster ?? EMPTY);
  }, [isOpen, editingMonster]);

  const set = (field: keyof MonsterFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field: keyof MonsterFormData, fallback = 1) => (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || fallback }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={editingMonster ? 'Modifica Mostro' : 'Nuovo Mostro'}
      confirmText={editingMonster ? 'Aggiorna' : 'Crea'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
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
        <Field label="HP">
          <input type="number" min="1" className="input input-bordered w-full"
            value={formData.hp} onChange={setNum('hp')} />
        </Field>
        <Field label="CA">
          <input type="number" min="1" className="input input-bordered w-full"
            value={formData.ac} onChange={setNum('ac')} />
        </Field>
      </FieldRow>

      <Field label="Dado Danno" hint="es. 2d6+3">
        <input type="text" className="input input-bordered w-full"
          value={formData.damage} onChange={set('damage')} placeholder="2d6+3" />
      </Field>

      <FieldRow>
        <Field label="CR (Sfida)">
          <input type="text" className="input input-bordered w-full"
            value={formData.cr} onChange={set('cr')} />
        </Field>
        <Field label="Tipo">
          <select className="select select-bordered w-full" value={formData.type} onChange={set('type')}>
            <option value="humanoid">Umanoide</option>
            <option value="beast">Bestia</option>
            <option value="undead">Non Morto</option>
            <option value="dragon">Drago</option>
            <option value="giant">Gigante</option>
            <option value="goblinoid">Goblinide</option>
            <option value="lycanthrope">Licantropo</option>
          </select>
        </Field>
      </FieldRow>

      <Field label="Descrizione (opzionale)">
        <textarea className="textarea textarea-bordered w-full" rows={3}
          value={formData.description}
          onChange={set('description')}
          placeholder="Lore, tattiche, note sul mostro..." />
      </Field>
    </FormModal>
  );
}
