import { useState, useEffect } from 'react';
import { FormModal, Field, FieldRow } from './FormModal';

const EMPTY = { name: '', hp: 10, ac: 10, damage: '1d6', cr: '1/4', type: 'humanoid', description: '' };

export function MonsterFormModal({ isOpen, editingMonster, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingMonster ?? EMPTY);
  }, [isOpen, editingMonster]);

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field, fallback = 1) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || fallback }));

  const handleSubmit = (e) => {
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
        <textarea className="textarea textarea-bordered w-full" rows="3"
          value={formData.description}
          onChange={set('description')}
          placeholder="Lore, tattiche, note sul mostro..." />
      </Field>
    </FormModal>
  );
}
