import { useState, useEffect, FormEvent } from 'react';
import { FormModal, Field } from '../ui/FormModal';

export type CampaignFormData = { name: string; description: string };
const EMPTY: CampaignFormData = { name: '', description: '' };

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CampaignFormData) => void;
  initialData?: CampaignFormData;
  title?: string;
  confirmText?: string;
  loading?: boolean;
}

export function CampaignFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Nuova Campagna',
  confirmText = 'Crea',
  loading = false,
}: CampaignFormModalProps) {
  const [formData, setFormData] = useState<CampaignFormData>(initialData ?? EMPTY);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ?? EMPTY);
    }
  }, [isOpen, initialData]);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={title}
      confirmText={loading ? `${confirmText}...` : confirmText}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Nome" required>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Nome campagna"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          required
          autoFocus
        />
      </Field>
      <Field label="Descrizione">
        <textarea
          className="textarea textarea-bordered w-full"
          rows={3}
          placeholder="Descrizione"
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
        />
      </Field>
    </FormModal>
  );
}

