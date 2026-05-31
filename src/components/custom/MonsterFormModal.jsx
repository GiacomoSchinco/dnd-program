import { useState, useEffect } from 'react';

const EMPTY = { name: '', hp: 10, ac: 10, damage: '1d6', cr: '1/4', type: 'humanoid' };

export function MonsterFormModal({ isOpen, editingMonster, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(editingMonster ?? EMPTY);
  }, [isOpen, editingMonster]);

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
          {editingMonster ? 'Modifica Mostro' : 'Nuovo Mostro'}
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
              <label className="label">HP</label>
              <input
                type="number"
                min="1"
                className="input input-bordered"
                value={formData.hp}
                onChange={setNum('hp')}
              />
            </div>
            <div className="form-control">
              <label className="label">CA</label>
              <input
                type="number"
                min="1"
                className="input input-bordered"
                value={formData.ac}
                onChange={setNum('ac')}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">Dado Danno (es. 2d6+3)</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.damage}
              onChange={set('damage')}
              placeholder="2d6+3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">CR (Sfida)</label>
              <input
                type="text"
                className="input input-bordered"
                value={formData.cr}
                onChange={set('cr')}
              />
            </div>
            <div className="form-control">
              <label className="label">Tipo</label>
              <select
                className="select select-bordered"
                value={formData.type}
                onChange={set('type')}
              >
                <option value="humanoid">Umanoide</option>
                <option value="beast">Bestia</option>
                <option value="undead">Non Morto</option>
                <option value="dragon">Drago</option>
                <option value="giant">Gigante</option>
                <option value="goblinoid">Goblinide</option>
                <option value="lycanthrope">Lupo Mannaro</option>
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMonster ? 'Aggiorna' : 'Crea'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
