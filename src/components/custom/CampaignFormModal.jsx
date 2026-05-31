import { useState, useEffect } from 'react';
import { FormModal, Field } from './FormModal';

const EMPTY = { name: '', description: '' };

export function CampaignFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(EMPTY);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title="Nuova Campagna"
      confirmText="Crea Campagna"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Nome Campagna" required>
        <input type="text" className="input input-bordered w-full"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          required autoFocus />
      </Field>
      <Field label="Descrizione">
        <textarea className="textarea textarea-bordered w-full" rows="3"
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          placeholder="Descrivi la tua campagna..." />
      </Field>
    </FormModal>
  );
}
