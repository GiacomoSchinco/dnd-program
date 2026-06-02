import { ConfirmModal } from './ConfirmModal';

/**
 * Wrapper di ConfirmModal preconfigurato per le azioni di eliminazione.
 * Riduce il boilerplate ripetuto in ogni pagina.
 *
 * Uso:
 *   const { confirmState, confirm, closeConfirm } = useConfirm();
 *   // ...
 *   <DeleteConfirmModal confirmState={confirmState} onClose={closeConfirm} />
 */
export function DeleteConfirmModal({ confirmState, onClose, confirmText = 'Elimina' }) {
  return (
    <ConfirmModal
      isOpen={confirmState.isOpen}
      onClose={onClose}
      onConfirm={confirmState.onConfirm}
      title={confirmState.title}
      message={confirmState.message}
      icon={confirmState.icon}
      confirmText={confirmText}
      confirmVariant="error"
    />
  );
}
