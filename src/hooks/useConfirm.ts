import { useState } from 'react';

export interface ConfirmState {
  isOpen: boolean;
  title?: string;
  message?: string;
  icon?: string;
  onConfirm?: () => Promise<void> | void;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({ isOpen: false });

  const confirm = ({ title, message, icon = '🗑️', onConfirm }: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({ isOpen: true, title, message, icon, onConfirm });
  };

  const closeConfirm = () => setConfirmState({ isOpen: false });

  return { confirmState, confirm, closeConfirm };
}
