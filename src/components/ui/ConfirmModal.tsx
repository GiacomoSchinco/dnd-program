import { JSX, useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, Zap, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: string;
  icon?: string;
  isLoading?: boolean;
}

const ICON_MAP: Record<string, JSX.Element> = {
  '🗑️': <Trash2 size={28} />,
  '⚠️': <AlertTriangle size={28} />,
  '💥': <Zap size={28} />,
  '❗': <AlertCircle size={28} />,
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Conferma azione',
  message = 'Sei sicuro di voler procedere?',
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  confirmVariant = 'primary',
  icon = '⚠️',
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Mappa le varianti ai colori daisyUI
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    error: 'btn-error',
    warning: 'btn-warning',
    success: 'btn-success',
    ghost: 'btn-ghost',
  };

  const confirmClass = variantClasses[confirmVariant as keyof typeof variantClasses] || 'btn-primary';

  return (
    <dialog ref={modalRef} className="modal" onClose={handleCancel}>
      <div className="modal-box">
        {/* Header con icona */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-primary">{ICON_MAP[icon] ?? <AlertTriangle size={28} />}</div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>

        {/* Messaggio */}
        <div className="py-2">
          <p className="text-base-content/80">{message}</p>
        </div>

        {/* Bottoni azione */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${confirmClass}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
            {confirmText}
          </button>
        </div>
      </div>

      {/* Sfondo per chiudere cliccando fuori */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleCancel}>close</button>
      </form>
    </dialog>
  );
}