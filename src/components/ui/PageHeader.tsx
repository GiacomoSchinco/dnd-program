/**
 * Header di pagina standard: titolo + sottotitolo + azioni a destra.
 *
 * Props:
 *  icon      ReactNode   Icona accanto al titolo
 *  title     string      Testo del titolo (h1)
 *  subtitle  string      Testo secondario (opzionale)
 *  actions   ReactNode   Bottoni/controlli a destra (opzionale)
 */
import { ReactNode } from 'react';

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="text-base-content/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
