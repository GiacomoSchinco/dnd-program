import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  /** Titolo della pagina (usa PageHeader internamente) */
  title?: string;
  /** Icona accanto al titolo */
  icon?: ReactNode;
  /** Sottotitolo */
  subtitle?: string;
  /** Azioni a destra (bottoni, ecc.) */
  actions?: ReactNode;
  /** Larghezza massima (default: nessuna, eredita da Layout) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  /** Classe aggiuntiva */
  className?: string;
  /** Se true, elimina lo spazio verticale tra gli elementi child (default: false) */
  noGap?: boolean;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
  none: '',
};

export function PageWrapper({
  children,
  title,
  icon,
  subtitle,
  actions,
  maxWidth = 'none',
  className = '',
  noGap = false,
}: PageWrapperProps) {
  return (
    <div className={`${noGap ? '' : 'space-y-6'} ${maxWidthMap[maxWidth]} mx-auto ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            {title && (
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {icon}
                {title}
              </h1>
            )}
            {subtitle && <p className="text-base-content/60">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
