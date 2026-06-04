import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FormModal, Field, FieldRow } from '../ui/FormModal';
import type { Npc } from '../../types';

type NpcFormData = { name: string; hp: number; ac: number; description: string };
const EMPTY: NpcFormData = { name: '', hp: 10, ac: 10, description: '' };

interface NpcFormModalProps {
  isOpen: boolean;
  editingNpc?: Npc | null;
  onClose: () => void;
  onSubmit: (data: NpcFormData, original?: Npc | null) => void;
}

export function NpcFormModal({ isOpen, editingNpc, onClose, onSubmit }: NpcFormModalProps) {
  const [formData, setFormData] = useState<NpcFormData>(EMPTY);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        editingNpc
          ? { 
              name: editingNpc.name, 
              hp: editingNpc.hp ?? 10, 
              ac: editingNpc.ac ?? 10, 
              description: editingNpc.description || '' 
            }
          : EMPTY,
      );
    }
  }, [isOpen, editingNpc]);

  const setText = (field: 'name' | 'description') => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    
  const setNum = (field: 'hp' | 'ac') => (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || 1 }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
          onChange={setText('name')}
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
          rows={2}
          value={formData.description}
          onChange={setText('description')}
          placeholder="Ruolo, note, background..."
        />
      </Field>
    </FormModal>
  );
}
