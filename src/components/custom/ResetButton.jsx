import { db } from '../../db/database';

export function ResetButton() {
  const handleReset = async () => {
    if (confirm('⚠️ Sei sicuro? Questa azione cancellerà TUTTI i dati (campagne, personaggi, combattimenti, mostri). Non potrai recuperarli!')) {
      try {
        // Cancella tutte le tabelle
        await db.combats.clear();
        await db.characters.clear();
        await db.campaigns.clear();
        await db.activeCombat.clear();
        await db.monsters.clear();
        await db.spells.clear();
        
        console.log('✅ Tutti i dati cancellati');
        alert('Database pulito! L\'app si ricaricherà.');
        window.location.reload();
      } catch (error) {
        console.error('Errore reset:', error);
        alert('Errore durante il reset');
      }
    }
  };

  return (
    <button 
      onClick={handleReset}
      className="btn btn-error btn-sm"
    >
      🗑️ Reset Completo
    </button>
  );
}