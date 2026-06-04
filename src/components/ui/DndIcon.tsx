import { useEffect, useState } from 'react';

/**
 * Determina se siamo in ambiente Electron o in produzione con file://
 */
function isElectron(): boolean {
  if (typeof window === 'undefined') return false;
  if (navigator.userAgent.includes('Electron')) return true;
  if (window.location.protocol === 'file:') return true;
  return false;
}

interface DndIconProps {
  name: string;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Icona D&D da `/public/icon/*.svg`
 *
 * Il colore segue la classe CSS `color` → usa classi Tailwind `text-*`
 *
 * In web usa mask-image con currentColor (colore dinamico).
 * In Electron (file://) carica l'SVG inline per evitare problemi CORS.
 *
 * @example
 * <DndIcon name="dice-twenty-faces-twenty" size={48} className="text-amber-500" />
 * <DndIcon name="rule-book" size={32} className="text-red-700" />
 */
export function DndIcon({ name, size = 24, className = '', 'aria-label': ariaLabel }: DndIconProps) {
  const electron = isElectron();
  const [svgContent, setSvgContent] = useState<string | null>(null);

  // In Electron, carica l'SVG inline per poter usare currentColor
  useEffect(() => {
    if (!electron) return;
    const iconPath = `./icon/${name}.svg`;
    fetch(iconPath)
      .then((res) => res.text())
      .then((text) => {
        // Sostituisci fill hardcoded con currentColor
        const colored = text
          .replace(/fill="#[0-9a-fA-F]+"/g, 'fill="currentColor"')
          .replace(/fill='#[0-9a-fA-F]+'/g, "fill='currentColor'")
          .replace(/class="[^"]*"/g, '');
        setSvgContent(colored);
      })
      .catch(() => setSvgContent(null));
  }, [electron, name]);

  // In Electron: SVG inline (rispetta currentColor)
  if (electron && svgContent) {
    return (
      <span
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }

  // Fallback Electron (se SVG non ancora caricato): mostra placeholder
  if (electron) {
    return (
      <span
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel}
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          backgroundColor: 'currentColor',
          borderRadius: '4px',
          opacity: 0.3,
        }}
      />
    );
  }

  // In web: mask-image con currentColor (funziona perfettamente)
  return (
    <span
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: 'currentColor',
        maskImage: `url('/icon/${name}.svg')`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url('/icon/${name}.svg')`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
