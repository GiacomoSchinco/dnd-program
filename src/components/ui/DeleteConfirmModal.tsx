import { ConfirmModal } from './ConfirmModal';
import type { ConfirmState } from '../../hooks/useConfirm';

interface DeleteConfirmModalProps {
  confirmState: ConfirmState;
  onClose: () => void;
  confirmText?: string;
}

export function DeleteConfirmModal({ confirmState, onClose, confirmText = 'Elimina' }: DeleteConfirmModalProps) {
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
