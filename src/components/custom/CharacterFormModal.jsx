import { useState, useEffect } from 'react';
import { CharacterClasses, CharacterRaces } from '../../db/database';

const EMPTY = { name: '', class: '', level: 1, race: '', hp: 10, ac: 10 };

export function CharacterFormModal({ isOpen, editingChar, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingChar ?? EMPTY);
  }, [isOpen, editingChar]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field, fallback = 1) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: parseInt(e.target.value) || fallback }));

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {editingChar ? 'Modifica Personaggio' : 'Nuovo Personaggio'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">Nome</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.name}
              onChange={set('name')}
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Classe</label>
              <select
                className="select select-bordered"
                value={formData.class}
                onChange={set('class')}
                required
              >
                <option value="">Seleziona</option>
                {Object.values(CharacterClasses).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">Livello</label>
              <input
                type="number"
                className="input input-bordered"
                value={formData.level}
                onChange={setNum('level')}
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Razza</label>
              <select
                className="select select-bordered"
                value={formData.race}
                onChange={set('race')}
              >
                <option value="">Seleziona razza...</option>
                {CharacterRaces.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">CA</label>
              <input
                type="number"
                className="input input-bordered"
                value={formData.ac}
                onChange={setNum('ac')}
                min="1"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">HP Massimi</label>
            <input
              type="number"
              className="input input-bordered"
              value={formData.hp}
              onChange={setNum('hp')}
              min="1"
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              {editingChar ? 'Aggiorna' : 'Crea'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
