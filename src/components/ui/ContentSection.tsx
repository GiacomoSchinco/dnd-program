import { ReactNode } from 'react';

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  margin?: string;
}

/**
 * ContentSection — wrapper per le sezioni di contenuto.
 * Gestisce esclusivamente margin e padding, senza applicare stili
 * come shadow, background o border radius.
 */
export function ContentSection({
  children,
  className = '',
  padding = 'p-4 sm:p-6',
  margin = '',
}: ContentSectionProps) {
  return (
    <div className={`${padding} ${margin} ${className}`}>
      {children}
    </div>
  );
}
