import { useState, useEffect } from 'react';
import { Plus, Swords } from 'lucide-react';
import type { CombatParticipant } from '../../types';

export interface PendingParticipant {
  participant: CombatParticipant;
  label: string;
}

interface InitiativeModalProps {
  pending: PendingParticipant | null;
  onConfirm: (participant: CombatParticipant) => void;
  onClose: () => void;
}

export function InitiativeModal({ pending, onConfirm, onClose }: InitiativeModalProps) {
  const [initiative, setInitiative] = useState('');

  useEffect(() => {
    if (pending) setInitiative('');
  }, [pending]);

  if (!pending) return null;

  const handleConfirm = () => {
    const ini = parseInt(initiative, 10);
    onConfirm({ ...pending.participant, initiative: isNaN(ini) ? 0 : ini });
    onClose();
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm">
        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
          <Swords size={18} /> Inserisci Iniziativa
        </h3>
        <p className="text-sm text-base-content/60 mb-4">{pending.label}</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Iniziativa</span>
            <span className="label-text-alt text-base-content/50">Tiro d20 + modificatore</span>
          </label>
          <input
            type="number"
            className="input input-bordered input-lg text-center text-2xl font-bold"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            placeholder="0"
            min="-10"
            max="40"
            autoFocus
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Annulla</button>
          <button className="btn btn-primary gap-1" onClick={handleConfirm}>
            <Plus size={14} /> Aggiungi
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}
