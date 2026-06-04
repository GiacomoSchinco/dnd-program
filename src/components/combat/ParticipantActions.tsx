import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { ConfirmModal } from '../ui';
import { Dices, Pencil, Trash2 } from 'lucide-react';
import type { CombatParticipant } from '../../types';

interface ConfirmState {
  isOpen: boolean;
  title?: string;
  message?: string;
  icon?: string;
  onConfirm?: () => void;
}

interface ParticipantActionsProps {
  participant: CombatParticipant;
  applyDamage: (id: string, damage: number) => void;
  heal: (id: string, heal: number) => void;
  removeParticipant: (id: string) => void;
  showToast: (msg: string) => void;
}

function rollDamageFormula(formula: string) {
  const match = formula.match(/(\d*)d(\d+)(?:([+-])(\d+))?/);
  if (!match) return null;
  const count = parseInt(match[1]) || 1;
  const sides = parseInt(match[2]);
  const sign = match[3] === '-' ? -1 : 1;
  const bonus = sign * (parseInt(match[4]) || 0);
  let total = bonus;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

export function ParticipantActions({ participant, applyDamage, heal, removeParticipant, showToast }: ParticipantActionsProps) {
  const [customDamage, setCustomDamage] = useState('');
  const [customHeal, setCustomHeal] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>({ isOpen: false });
  const closeConfirm = () => setConfirmState({ isOpen: false });

  const handleCustomDamage = () => {
    const val = parseInt(customDamage);
    if (!val || val <= 0) { showToast('Inserisci un valore valido'); return; }
    applyDamage(participant.id, val);
    showToast(`${participant.name} subisce ${val} danni`);
    setCustomDamage('');
    setShowCustom(false);
  };

  const handleCustomHeal = () => {
    const val = parseInt(customHeal);
    if (!val || val <= 0) { showToast('Inserisci un valore valido'); return; }
    heal(participant.id, val);
    showToast(`${participant.name} curato di ${val} HP`);
    setCustomHeal('');
    setShowCustom(false);
  };

  const handleRollDamage = () => {
    const total = rollDamageFormula(participant.damage ?? '');
    if (total == null) return;
    applyDamage(participant.id, total);
    showToast(`${participant.name} subisce ${total} danni (${participant.damage})`);
  };

  const handleRemove = () => {
    setConfirmState({
      isOpen: true,
      title: 'Rimuovi Partecipante',
      message: `Vuoi rimuovere ${participant.name} dal combattimento?`,
      icon: '🗑️',
      onConfirm: () => {
        removeParticipant(participant.id);
        showToast(`${participant.name} rimosso`);
      },
    });
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Azioni rapide */}
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-error btn-sm" onClick={() => applyDamage(participant.id, 1)}>-1</button>
        <button className="btn btn-error btn-sm" onClick={() => applyDamage(participant.id, 5)}>-5</button>
        <button className="btn btn-error btn-sm" onClick={() => applyDamage(participant.id, 10)}>-10</button>
        <button className="btn btn-success btn-sm" onClick={() => heal(participant.id, 1)}>+1</button>
        <button className="btn btn-success btn-sm" onClick={() => heal(participant.id, 5)}>+5</button>
        <button className="btn btn-success btn-sm" onClick={() => heal(participant.id, 10)}>+10</button>

        {participant.damage && (
          <button className="btn btn-warning btn-sm gap-1" onClick={handleRollDamage}>
            <Dices size={14} /> {participant.damage}
          </button>
        )}

        <button
          className="btn btn-outline btn-sm gap-1"
          onClick={() => setShowCustom((v) => !v)}
          title="Danno/cura personalizzato"
        >
          <Pencil size={14} /> Custom
        </button>

        <button className="btn btn-ghost btn-sm ml-auto" onClick={handleRemove}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Input personalizzati */}
      {showCustom && (
        <div className="flex flex-wrap gap-2 items-center bg-base-300 rounded-xl px-3 py-2">
          <div className="join">
            <input
              type="number"
              min="1"
              className="input input-bordered input-xs w-20 join-item"
              placeholder="Danno"
              value={customDamage}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomDamage(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCustomDamage()}
            />
            <button className="btn btn-error btn-xs join-item" onClick={handleCustomDamage}>
              Infliggi
            </button>
          </div>

          <div className="join">
            <input
              type="number"
              min="1"
              className="input input-bordered input-xs w-20 join-item"
              placeholder="Cura"
              value={customHeal}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomHeal(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCustomHeal()}
            />
            <button className="btn btn-success btn-xs join-item" onClick={handleCustomHeal}>
              Cura
            </button>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        icon={confirmState.icon}
        confirmText="Rimuovi"
        confirmVariant="error"
      />
    </div>
  );
}
