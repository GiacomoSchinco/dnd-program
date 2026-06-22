import { useState } from 'react';
import { db } from '../../db/database';
import { seedMonsters, loadSeedSpells, clearSpellsCache } from '../../db/seedData';
import { ConfirmModal } from './ConfirmModal';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface ResetButtonProps {
  collapsed?: boolean;
}

export function ResetButton({ collapsed = false }: ResetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = async () => {
    try {
      // Svuota la cache e ricarica da JSON
      clearSpellsCache();
      const seedSpells = await loadSeedSpells();

      await db.transaction('rw', [
        db.activeCombat,
        db.combats,
        db.campaigns,
        db.characters,
        db.monsters,
        db.spells,
        db.npcs,
      ], async () => {
        await db.activeCombat.clear();
        await db.combats.clear();
        await db.campaigns.clear();
        await db.characters.clear();
        await db.monsters.clear();
        await db.spells.clear();
        await db.npcs.clear();
        // Re-seed subito dentro la stessa transazione per evitare duplicati
        await db.monsters.bulkAdd(seedMonsters);
        await db.spells.bulkAdd(seedSpells);
      });
      toast.success('Reset completato!');
      window.location.reload();
    } catch (error) {
      toast.error('Errore durante il reset');
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
        {collapsed ? <Trash2 size={16} /> : <><Trash2 size={16} /> Reset Completo</>}
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