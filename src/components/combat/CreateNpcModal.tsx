import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import type { CombatParticipant } from '../../types';

interface CreateNpcModalProps {
  isOpen: boolean;
  onConfirm: (participant: CombatParticipant) => void;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export function CreateNpcModal({ isOpen, onConfirm, onClose, showToast }: CreateNpcModalProps) {
  const [form, setForm] = useState({ name: '', hp: 10, ac: 10, initiative: '' });

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!form.name.trim()) { showToast('Inserisci un nome per l\'NPC'); return; }
    const ini = parseInt(form.initiative, 10);
    onConfirm({
      id: '',
      name: form.name.trim(),
      type: 'npc',
      hp: Number(form.hp) || 1,
      currentHp: Number(form.hp) || 1,
      maxHp: Number(form.hp) || 1,
      ac: Number(form.ac) || 10,
      initiative: isNaN(ini) ? 0 : ini,
    });
    setForm({ name: '', hp: 10, ac: 10, initiative: '' });
    onClose();
  };

  const handleClose = () => {
    setForm({ name: '', hp: 10, ac: 10, initiative: '' });
    onClose();
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <User size={18} /> Crea NPC
        </h3>
        <div className="space-y-3">
          <div className="form-control">
            <label className="label"><span className="label-text">Nome</span></label>
            <input
              type="text"
              className="input input-bordered"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Nome NPC"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">HP</span></label>
              <input
                type="number"
                className="input input-bordered"
                value={form.hp}
                onChange={(e) => setForm((s) => ({ ...s, hp: Number(e.target.value) }))}
                min="1"
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">CA</span></label>
              <input
                type="number"
                className="input input-bordered"
                value={form.ac}
                onChange={(e) => setForm((s) => ({ ...s, ac: Number(e.target.value) }))}
                min="1"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Iniziativa</span>
              <span className="label-text-alt text-base-content/50">d20 + mod</span>
            </label>
            <input
              type="number"
              className="input input-bordered input-lg text-center text-2xl font-bold"
              value={form.initiative}
              onChange={(e) => setForm((s) => ({ ...s, initiative: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="0"
              min="-10"
              max="40"
            />
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={handleClose}>Annulla</button>
          <button className="btn btn-info gap-1" onClick={handleCreate}>
            <Plus size={14} /> Aggiungi
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </dialog>
  );
}
