import { useState, useEffect } from 'react';
import { FormModal, Field, FieldRow } from './FormModal';

const EMPTY = { name: '', hp: 10, ac: 10, description: '' };

export function NpcFormModal({ isOpen, editingNpc, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        editingNpc
          ? { name: editingNpc.name, hp: editingNpc.hp, ac: editingNpc.ac, description: editingNpc.description || '' }
          : EMPTY,
      );
    }
  }, [isOpen, editingNpc]);

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  const setNum = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || 1 }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingNpc);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={editingNpc ? 'Modifica NPC' : 'Nuovo NPC'}
      confirmText={editingNpc ? 'Aggiorna' : 'Crea'}
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
      <Field label="Descrizione (opzionale)">
        <textarea
          className="textarea textarea-bordered w-full"
          rows="2"
          value={formData.description}
          onChange={set('description')}
          placeholder="Ruolo, note, background..."
        />
      </Field>
    </FormModal>
  );
}
