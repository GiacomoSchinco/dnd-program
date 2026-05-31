import { useState } from 'react';
import { db } from '../../db/database';
import { ConfirmModal } from './ConfirmModal';

export function ResetButton({ collapsed = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = async () => {
    try {
      await db.combats.clear();
      await db.characters.clear();
      await db.campaigns.clear();
      await db.activeCombat.clear();
      await db.monsters.clear();
      await db.spells.clear();
      window.location.reload();
    } catch (error) {
      console.error('Errore reset:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`btn btn-error btn-sm ${collapsed ? 'btn-square w-10 h-10' : ''}`}
        title="Reset completo"
      >
        {collapsed ? '🗑️' : '🗑️ Reset Completo'}
      </button>
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleReset}
        title="Reset Completo"
        message="Questa azione cancellerà TUTTI i dati (campagne, personaggi, combattimenti, mostri). Non potrai recuperarli!"
        icon="💥"
        confirmText="Reset"
        confirmVariant="error"
      />
    </>
  );
}