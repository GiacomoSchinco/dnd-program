import { useState, useEffect } from 'react';

const EMPTY = { name: '', description: '' };

export function CampaignFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (isOpen) setFormData(EMPTY);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Nuova Campagna</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">Nome Campagna</label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div className="form-control">
            <label className="label">Descrizione</label>
            <textarea
              className="textarea textarea-bordered"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Descrivi la tua campagna..."
            />
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              Crea Campagna
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
