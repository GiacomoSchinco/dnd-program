import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { SpellSchools } from '../../db/database';
import { FormModal, Field, FieldRow } from '../ui/FormModal';
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
        <Field label="Livello">
          <select
            className="select select-bordered w-full"
            value={formData.level}
            onChange={setNum('level')}
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
            value={formData.school}
            onChange={set('school')}
          >
            {Object.values(SpellSchools).map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Danno" hint="es. 8d6">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.damage}
            onChange={set('damage')}
            placeholder="es. 8d6"
          />
        </Field>
        <Field label="Cura" hint="es. 2d8+mod">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.healing}
            onChange={set('healing')}
            placeholder="es. 2d8+mod"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Gittata">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.range}
            onChange={set('range')}
            placeholder="es. 120 ft"
          />
        </Field>
        <Field label="Durata">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.duration}
            onChange={set('duration')}
            placeholder="es. 1 ora"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Tempo di lancio">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.castingTime}
            onChange={set('castingTime')}
            placeholder="es. 1 azione, 1 azione bonus"
          />
        </Field>
        <Field label="Tiro Salvezza">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.saveType}
            onChange={set('saveType')}
            placeholder="es. Destrezza, Costituzione"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Componenti">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.components}
            onChange={set('components')}
            placeholder="es. V, S, M"
          />
        </Field>
        <Field label="Materiale">
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.material}
            onChange={set('material')}
            placeholder="es. una piuma d'oca"
          />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Concentrazione">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              checked={!!formData.concentration}
              onChange={setCheck('concentration')}
            />
            <span className="ml-2 text-sm">Richiede concentrazione</span>
          </div>
        </Field>
        <Field label="Rituale">
          <div className="flex items-center h-10">
            <input
              type="checkbox"
              className="checkbox checkbox-info"
              checked={!!formData.ritual}
              onChange={setCheck('ritual')}
            />
            <span className="ml-2 text-sm">Può essere lanciato come rituale</span>
          </div>
        </Field>
      </FieldRow>

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
