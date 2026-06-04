/**
 * FormModal — componente modale riutilizzabile con layout stabile.
 *
 * Il problema dei modali precedenti: DaisyUI `.label` imposta `display:flex`
 * con `justify-content:space-between`, che in alcuni temi rompe il layout
 * mettendo label e input sulla stessa riga o comportandosi in modo imprevedibile.
 *
 * Qui usiamo classi esplicite (`block`, `flex flex-col`) invece di affidarci
 * al comportamento tema-dipendente di `.form-control` e `.label`.
 *
 * Esportazioni:
 *  - <FormModal>       wrapper modale con titolo, footer annulla/conferma
 *  - <Field>           singolo campo: label sopra, input sotto (sempre flex-col)
 *  - <FieldRow>        griglia a N colonne per affiancare Field
 */

// ── Field ──────────────────────────────────────────────────────────────────

/**
 * @param {string}      label       - testo etichetta
 * @param {boolean}     required    - mostra asterisco rosso
 * @param {ReactNode}   children    - input, select, textarea, ecc.
 * @param {string}      hint        - testo piccolo sotto il campo (opzionale)
 */
import { ReactNode, FormEvent } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-base-content block">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {hint && <span className="text-xs text-base-content/50">{hint}</span>}
    </div>
  );
}

// ── FieldRow ───────────────────────────────────────────────────────────────

/**
 * @param {number}    cols      - numero di colonne (default 2)
 * @param {ReactNode} children  - Field components
 */
interface FieldRowProps {
  cols?: number;
  children: ReactNode;
}

export function FieldRow({ cols = 2, children }: FieldRowProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols] ?? 'grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-3`}>
      {children}
    </div>
  );
}

// ── FormModal ──────────────────────────────────────────────────────────────

/**
 * @param {boolean}     isOpen
 * @param {string}      title
 * @param {string}      [confirmText]   - testo bottone conferma (default "Salva")
 * @param {string}      [confirmVariant] - classe btn variante (default "btn-primary")
 * @param {boolean}     [wide]          - modal-box più larga (max-w-2xl)
 * @param {() => void}  onClose
 * @param {(e) => void} onSubmit        - chiamato su submit del form
 * @param {ReactNode}   children        - contenuto del form
 */
interface FormModalProps {
  isOpen: boolean;
  title: string;
  confirmText?: string;
  confirmVariant?: string;
  wide?: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

export function FormModal({
  isOpen,
  title,
  confirmText = 'Salva',
  confirmVariant = 'btn-primary',
  wide = false,
  loading = false,
  onClose,
  onSubmit,
  children,
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className={`modal-box flex flex-col gap-0 ${wide ? 'max-w-2xl' : ''}`}>
        {/* Header */}
        <h3 className="font-bold text-lg mb-4">{title}</h3>

        {/* Body */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3"
          noValidate
        >
          {children}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 mt-2 border-t border-base-300">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className={`btn ${confirmVariant}`} disabled={loading}>
              {loading && <span className="loading loading-spinner loading-xs" />}
              {confirmText}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
