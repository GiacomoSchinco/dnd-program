import { useState } from 'react';

/**
 * Hook riutilizzabile per gestire il pattern ConfirmModal.
 *
 * Sostituisce il boilerplate:
 *   const [confirmState, setConfirmState] = useState({ isOpen: false });
 *   const closeConfirm = () => setConfirmState({ isOpen: false });
 *
 * Uso:
 *   const { confirmState, confirm, closeConfirm } = useConfirm();
 *
 *   confirm({
 *     title: 'Elimina X',
 *     message: `Vuoi eliminare ${item.name}?`,
 *     onConfirm: async () => { await deleteX(item.id); },
 *   });
 *
 *   <ConfirmModal
 *     isOpen={confirmState.isOpen}
 *     onClose={closeConfirm}
 *     onConfirm={confirmState.onConfirm}
 *     title={confirmState.title}
 *     message={confirmState.message}
 *     icon={confirmState.icon}
 *     confirmText="Elimina"
 *     confirmVariant="error"
 *   />
 */
export function useConfirm() {
  const [confirmState, setConfirmState] = useState({ isOpen: false });

  const confirm = ({ title, message, icon = '🗑️', onConfirm }) => {
    setConfirmState({ isOpen: true, title, message, icon, onConfirm });
  };

  const closeConfirm = () => setConfirmState({ isOpen: false });

  return { confirmState, confirm, closeConfirm };
}
